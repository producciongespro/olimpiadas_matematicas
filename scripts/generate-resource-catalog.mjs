import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { interactiveBooklets } from '../apps/public-web/src/features/interactive-booklets/interactive-booklets.js'

const historical = JSON.parse(readFileSync(new URL('../apps/public-web/src/features/booklets/historical-booklets.json', import.meta.url)))
const gradeNames = ['Primer año', 'Segundo año', 'Tercer año', 'Cuarto año', 'Quinto año', 'Sexto año']
const gradeFiles = ['1ero', '2do', '3ero', '4to', '5to', '6to']
const editions = [{
  year: 2025,
  type: 'pdf',
  materials: ['estudiante', 'docente'].flatMap((role) => gradeFiles.map((file, index) => ({
    key: `2025-${role}-${index + 1}`,
    grade: index + 1,
    role,
    title: gradeNames[index],
    description: `Cuadernillo para ${role === 'docente' ? 'docentes' : 'estudiantes'} · PDF`,
    href: `/data/2025/cuadernillos/cuadernillo_mateamtica_${file}_2025-${role.toUpperCase()}.pdf`,
    image: `/assets/legacy/booklets/2025/ico-0${index + 1}-2025${role === 'docente' ? '-docente' : ''}.png`,
  }))),
}]
for (const [year, items] of Object.entries(historical).sort((a, b) => Number(b[0]) - Number(a[0]))) {
  editions.push({ year: Number(year), type: 'pdf', materials: items.map((item, index) => ({
    key: `${year}-${item.role}-${item.grade || 'general'}-${index}`,
    grade: item.grade || null,
    role: item.role,
    title: item.grade ? gradeNames[item.grade - 1] : 'Colección completa',
    description: `Cuadernillo ${year} · PDF`,
    href: item.href,
    image: item.image,
  })) })
}
for (const [year, items] of Object.entries(interactiveBooklets).sort((a, b) => Number(b[0]) - Number(a[0]))) {
  editions.push({ year: Number(year), type: 'interactive', materials: items.map(([grade, part, href, image]) => ({
    key: `${year}-interactive-${grade}-${part.toLowerCase()}`,
    grade: Number(grade), role: 'estudiante', part,
    title: gradeNames[Number(grade) - 1],
    description: `${year === '2020' ? 'Parte' : 'Actividad'} ${part} · Genially`,
    href, image,
  })) })
}
const content = {
  eyebrow: 'Recursos de preparación', title: 'Colección de cuadernillos',
  description: 'Estos materiales recopilan ejercicios aplicados en etapas circuitales y regionales. Ofrecen a estudiantes y docentes un panorama de los problemas que pueden encontrar durante las eliminatorias.',
  editions,
}
const json = `${JSON.stringify(content, null, 2)}\n`
writeFileSync(new URL('../packages/shared/src/resourceBooklets.json', import.meta.url), json)
writeFileSync(new URL('../apps/api/app/Database/Seeds/Data/resource-booklets.json', import.meta.url), json)
for (const image of new Set(editions.flatMap((edition) => edition.materials.map((item) => item.image)).filter(Boolean))) {
  const source = new URL(`../apps/public-web/public${image}`, import.meta.url)
  const target = new URL(`../apps/admin-web/public${image}`, import.meta.url)
  if (!existsSync(source)) throw new Error(`Falta imagen de respaldo: ${image}`)
  mkdirSync(dirname(fileURLToPath(target)), { recursive: true })
  copyFileSync(source, target)
}
console.log(`${editions.length} ediciones, ${editions.reduce((sum, edition) => sum + edition.materials.length, 0)} materiales`)
