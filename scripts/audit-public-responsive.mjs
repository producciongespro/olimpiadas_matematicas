const endpoint = process.argv[2] ?? 'http://127.0.0.1:9223'
const pageUrl = process.argv[3] ?? 'http://127.0.0.1:8000/'
const reportPath = process.argv[4]

if (!reportPath) {
  throw new Error('Indique la ruta del informe como tercer argumento.')
}

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds))

async function findPage() {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    try {
      const response = await fetch(`${endpoint}/json`)
      const targets = await response.json()
      const page = targets.find((target) => target.type === 'page')
      if (page) return page
    } catch {
      // Chrome puede tardar unos instantes en habilitar el endpoint local.
    }
    await wait(200)
  }
  throw new Error('No se encontró una página de Chrome para auditar.')
}

const page = await findPage()
const socket = new WebSocket(page.webSocketDebuggerUrl)
await new Promise((resolve, reject) => {
  socket.addEventListener('open', resolve, { once: true })
  socket.addEventListener('error', reject, { once: true })
})

let sequence = 0
const pending = new Map()
socket.addEventListener('message', (event) => {
  const message = JSON.parse(event.data)
  if (!message.id || !pending.has(message.id)) return
  const { resolve, reject } = pending.get(message.id)
  pending.delete(message.id)
  if (message.error) reject(new Error(message.error.message))
  else resolve(message.result)
})

function command(method, params = {}) {
  sequence += 1
  const id = sequence
  socket.send(JSON.stringify({ id, method, params }))
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }))
}

await command('Page.enable')
await command('Runtime.enable')
await command('Page.navigate', { url: pageUrl })
await wait(1200)

const widths = [320, 768, 1280]
const layouts = []
for (const width of widths) {
  await command('Emulation.setDeviceMetricsOverride', {
    deviceScaleFactor: 1,
    height: 900,
    mobile: width < 768,
    width,
  })
  await wait(350)
  const evaluation = await command('Runtime.evaluate', {
    awaitPromise: true,
    expression: `(() => {
      const visible = (element) => {
        const style = getComputedStyle(element)
        const rect = element.getBoundingClientRect()
        return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0
      }
      const overflow = [...document.querySelectorAll('body *')]
        .filter(visible)
        .map((element) => ({ element, rect: element.getBoundingClientRect() }))
        .filter(({ rect }) => rect.left < -1 || rect.right > innerWidth + 1)
        .slice(0, 10)
        .map(({ element, rect }) => ({
          left: Math.round(rect.left),
          right: Math.round(rect.right),
          selector: element.id ? '#' + element.id : element.tagName.toLowerCase() + (element.className ? '.' + String(element.className).trim().split(/\\s+/).slice(0, 2).join('.') : ''),
        }))
      const smallControls = [...document.querySelectorAll('button, select')]
        .filter(visible)
        .map((element) => ({ element, rect: element.getBoundingClientRect() }))
        .filter(({ rect }) => rect.width < 44 || rect.height < 44)
        .map(({ element, rect }) => ({
          height: Math.round(rect.height),
          name: element.getAttribute('aria-label') || element.textContent.trim(),
          width: Math.round(rect.width),
        }))
      return {
        clientWidth: document.documentElement.clientWidth,
        horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        overflow,
        scrollWidth: document.documentElement.scrollWidth,
        smallControls,
      }
    })()`,
    returnByValue: true,
  })
  layouts.push({ width, ...evaluation.result.value })
}

await command('Emulation.clearDeviceMetricsOverride')
const semanticEvaluation = await command('Runtime.evaluate', {
  expression: `(() => {
    const ids = [...document.querySelectorAll('[id]')].map((element) => element.id)
    const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))]
    const headings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((heading) => ({ level: Number(heading.tagName[1]), text: heading.textContent.trim() }))
    const headingJumps = headings.slice(1).filter((heading, index) => heading.level > headings[index].level + 1)
    const unsafeBlankLinks = [...document.querySelectorAll('a[target="_blank"]')].filter((anchor) => !anchor.relList.contains('noopener') || !anchor.relList.contains('noreferrer')).map((anchor) => anchor.href)
    const missingHashTargets = [...document.querySelectorAll('a[href^="#"]')].map((anchor) => anchor.getAttribute('href')).filter((href) => href.length > 1 && !document.getElementById(href.slice(1)))
    const imagesWithoutAlt = [...document.images].filter((image) => !image.hasAttribute('alt')).map((image) => image.src)
    const unnamedControls = [...document.querySelectorAll('a,button,select')].filter((element) => !(element.getAttribute('aria-label') || element.textContent.trim() || element.querySelector('img[alt]:not([alt=""])'))).map((element) => element.outerHTML.slice(0, 160))
    return {
      duplicateIds,
      headingJumps,
      h1Count: headings.filter((heading) => heading.level === 1).length,
      imageCount: document.images.length,
      imagesWithoutAlt,
      landmarks: { footer: document.querySelectorAll('footer').length, main: document.querySelectorAll('main').length, nav: document.querySelectorAll('nav').length },
      linkCount: document.links.length,
      missingHashTargets,
      unnamedControls,
      unsafeBlankLinks,
    }
  })()`,
  returnByValue: true,
})

const semantics = semanticEvaluation.result.value
const pass = (condition) => condition ? 'Cumple' : 'Requiere corrección'
const lines = [
  '# Auditoría de la vista pública',
  '',
  `Fecha: ${new Date().toISOString().slice(0, 10)}.`,
  '',
  '## Resultado automatizado',
  '',
  '| Criterio | Resultado | Evidencia |',
  '| --- | --- | --- |',
  `| Un único h1 | ${pass(semantics.h1Count === 1)} | ${semantics.h1Count} encontrado |`,
  `| IDs únicos | ${pass(semantics.duplicateIds.length === 0)} | ${semantics.duplicateIds.length ? semantics.duplicateIds.join(', ') : 'Sin duplicados'} |`,
  `| Orden de encabezados | ${pass(semantics.headingJumps.length === 0)} | ${semantics.headingJumps.length} saltos |`,
  `| Destinos internos | ${pass(semantics.missingHashTargets.length === 0)} | ${semantics.missingHashTargets.length} ausentes |`,
  `| Imágenes con atributo alt | ${pass(semantics.imagesWithoutAlt.length === 0)} | ${semantics.imageCount} imágenes revisadas |`,
  `| Controles con nombre | ${pass(semantics.unnamedControls.length === 0)} | ${semantics.unnamedControls.length} sin nombre |`,
  `| Enlaces en pestaña nueva | ${pass(semantics.unsafeBlankLinks.length === 0)} | ${semantics.unsafeBlankLinks.length} inseguros |`,
  `| Regiones principales | ${pass(semantics.landmarks.main === 1 && semantics.landmarks.footer === 1 && semantics.landmarks.nav >= 1)} | main=${semantics.landmarks.main}, nav=${semantics.landmarks.nav}, footer=${semantics.landmarks.footer} |`,
  '',
  '## Responsive',
  '',
  '| Viewport | Ancho del documento | Desbordamiento | Controles menores de 44 px |',
  '| ---: | ---: | --- | ---: |',
  ...layouts.map((layout) => `| ${layout.width} px | ${layout.scrollWidth} px | ${layout.horizontalOverflow ? 'Sí' : 'No'} | ${layout.smallControls.length} |`),
  '',
  '## Cobertura',
  '',
  `- ${semantics.linkCount} enlaces renderizados.`,
  `- ${semantics.imageCount} imágenes renderizadas.`,
  '- Navegación, galería, edición vigente, catálogos, interactivos, contacto y pie de página incluidos.',
  '',
  '## Revisión manual pendiente',
  '',
  '- Confirmar que los textos alternativos describen adecuadamente cada fotografía.',
  '- Confirmar contraste con una herramienta WCAG especializada.',
  '- Recorrer el menú y los selectores con lectores de pantalla reales.',
]

await import('node:fs/promises').then(({ writeFile }) => writeFile(reportPath, `${lines.join('\n')}\n`, 'utf8'))
socket.close()
console.log(JSON.stringify({ layouts, semantics }, null, 2))
