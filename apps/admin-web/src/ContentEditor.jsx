import {
  defaultHeroContent,
  defaultGeneralInformationContent,
  defaultCalendarContent,
  defaultContactContent,
  defaultAboutContent,
  defaultOlcomepIntroductionContent,
  defaultPartnersContent,
  defaultRegionalCoordinationsContent,
  defaultCurrentEditionContent,
  defaultResourceBookletsContent,
  defaultSiteHeaderContent,
  defaultSiteFooterContent,
  mergeHeroContent,
  mergeGeneralInformationContent,
  mergeCalendarContent,
  mergeContactContent,
  mergeAboutContent,
  mergeOlcomepIntroductionContent,
  mergePartnersContent,
  mergeRegionalCoordinationsContent,
  mergeCurrentEditionContent,
  mergeResourceBookletsContent,
} from '@olcomep/shared'
import { AboutUsSection, CalendarSection, ContactSection, CurrentEditionSection, GeneralInformationSection, HeroSection, OlcomepIntroductionSection, PartnersSection, RegionalCoordinationSection, ResourceBookletsSection, SiteHeader, SiteFooter } from '@olcomep/ui'
import { ArrowDown, ArrowUp, Download, ExternalLink, FileText, Image, List, MousePointerClick, Plus, Save, Send, Trash2, Type, UserRound, X } from 'lucide-react'
import { publicAssetUrl } from './publicAssetUrl.js'
import { useEffect, useRef, useState } from 'react'

const formatFileSize = (bytes) => bytes ? `${(bytes / 1024 / 1024).toFixed(bytes >= 1024 * 1024 ? 1 : 2)} MB` : ''

const buttonFields = new Set(['primary_label', 'secondary_label', 'manual_label', 'registration_label', 'bulk_label', 'promotion_label'])
const imageFields = new Set(['image_alt'])
const actionIcons = { texts: Type, buttons: MousePointerClick, images: Image, items: List, files: FileText, pdf: FileText, interactive: List }
const sectionActions = {
  hero: [['texts', 'Editar textos'], ['buttons', 'Editar nombres de botones'], ['images', 'Editar imagen']],
  calendar: [['texts', 'Editar textos'], ['buttons', 'Editar nombre del enlace'], ['items', 'Editar actividades'], ['files', 'Editar manual']],
  'current-edition': [['texts', 'Editar textos'], ['buttons', 'Editar nombres de enlaces'], ['items', 'Editar documentos'], ['files', 'Editar archivos e imagen']],
  'regional-coordinations': [['texts', 'Editar textos'], ['items', 'Editar regiones y personas']],
  partners: [['texts', 'Editar textos'], ['items', 'Editar instituciones y logotipos']],
  about: [['texts', 'Editar títulos y párrafos'], ['items', 'Editar hitos de la historia']],
  'general-information': [['texts', 'Editar títulos'], ['items', 'Editar preguntas']],
  'resource-booklets': [['texts', 'Editar textos'], ['pdf', 'Editar cuadernillos PDF'], ['interactive', 'Editar cuadernillos interactivos']],
  contact: [['texts', 'Editar textos'], ['items', 'Editar datos de contacto']],
}
const actionsFor = (key) => sectionActions[key] || [['texts', 'Editar textos']]

const editors = {
  'resource-booklets': {
    defaults: defaultResourceBookletsContent, merge: mergeResourceBookletsContent,
    fields: [['eyebrow', 'Antetítulo', 80], ['title', 'Título', 120], ['description', 'Descripción', 600, true]],
    preview: (content) => <ResourceBookletsSection content={content}/>,
    publishMessage: 'El catálogo público de recursos será sustituido por el borrador completo.',
    successMessage: 'Recursos y cuadernillos publicados correctamente.', supportsImage: false,
  },
  hero: {
    defaults: defaultHeroContent,
    merge: mergeHeroContent,
    fields: [
      ['eyebrow', 'Antetítulo', 80], ['title', 'Título principal', 120], ['audience', 'Población participante', 100],
      ['description', 'Descripción', 420, true], ['primary_label', 'Texto del botón principal', 60],
      ['secondary_label', 'Texto del botón secundario', 60], ['image_alt', 'Texto alternativo de la imagen', 255],
    ],
    preview: (content) => <HeroSection content={content}/>,
    publishMessage: 'La portada pública será sustituida por el borrador completo.',
    successMessage: 'Portada publicada correctamente.',
    supportsImage: true,
  },
  'olcomep-introduction': {
    defaults: defaultOlcomepIntroductionContent,
    merge: mergeOlcomepIntroductionContent,
    fields: [
      ['eyebrow', 'Antetítulo', 80], ['title', 'Título', 120],
      ['first_paragraph', 'Primer párrafo', 600, true], ['second_paragraph', 'Segundo párrafo', 600, true],
    ],
    preview: (content) => <OlcomepIntroductionSection content={content}/>,
    publishMessage: 'La sección “Conoce OLCOMEP” pública será sustituida por el borrador completo.',
    successMessage: 'Sección “Conoce OLCOMEP” publicada correctamente.',
    supportsImage: false,
  },
  calendar: {
    defaults: defaultCalendarContent,
    merge: mergeCalendarContent,
    fields: [
      ['eyebrow', 'Antetítulo', 80], ['title', 'Título', 120], ['description', 'Descripción', 500, true],
      ['notice', 'Aviso sobre fechas', 400, true], ['footer', 'Nota final', 500, true],
      ['manual_label', 'Texto del enlace al manual', 80],
    ],
    preview: (content) => <CalendarSection content={content}/>,
    publishMessage: 'El calendario público será sustituido por el borrador completo.',
    successMessage: 'Calendario publicado correctamente.',
    supportsManual: true,
    supportsImage: false,
  },
  partners: {
    defaults: defaultPartnersContent,
    merge: mergePartnersContent,
    fields: [
      ['eyebrow', 'Antetítulo', 80], ['title', 'Título', 120], ['description', 'Descripción', 500, true],
      ['collaborators_title', 'Título de colaboradores', 160], ['collaborators_note', 'Nota de colaboradores', 120], ['sponsors_title', 'Título de patrocinadores', 160],
    ],
    preview: (content) => <PartnersSection content={content}/>,
    publishMessage: 'La sección pública de colaboradores y patrocinadores será sustituida por el borrador completo.',
    successMessage: 'Colaboradores y patrocinadores publicados correctamente.',
    supportsImage: false,
  },
  about: {
    defaults: defaultAboutContent,
    merge: mergeAboutContent,
    fields: [['eyebrow', 'Antetítulo', 80], ['title', 'Título', 120], ['closing_title', 'Título del cierre', 180]],
    preview: (content) => <AboutUsSection content={content}/>,
    publishMessage: 'La sección pública “Acerca de nosotros” será sustituida por el borrador completo.',
    successMessage: '“Acerca de nosotros” publicado correctamente.',
    supportsImage: false,
  },
  'general-information': {
    defaults: defaultGeneralInformationContent,
    merge: mergeGeneralInformationContent,
    fields: [['faq_eyebrow', 'Antetítulo', 80], ['faq_title', 'Título', 160]],
    preview: (content) => <GeneralInformationSection content={content}/>,
    publishMessage: 'La sección pública “Preguntas frecuentes” será sustituida por el borrador completo.',
    successMessage: '“Preguntas frecuentes” publicada correctamente.',
    supportsImage: false,
  },
  'regional-coordinations': {
    defaults: defaultRegionalCoordinationsContent, merge: mergeRegionalCoordinationsContent,
    fields: [['eyebrow', 'Antetítulo', 80], ['title', 'Título', 120], ['description', 'Descripción', 600, true], ['summary_title', 'Título del resumen', 180], ['summary_description', 'Descripción del resumen', 600, true], ['directory_title', 'Título del directorio', 180], ['search_label', 'Etiqueta del buscador', 160]],
    preview: (content) => <RegionalCoordinationSection content={content}/>,
    publishMessage: 'El directorio público de coordinaciones regionales será sustituido por el borrador completo.', successMessage: 'Coordinaciones regionales publicadas correctamente.', supportsImage: false,
  },
  'current-edition': {
    defaults: defaultCurrentEditionContent, merge: mergeCurrentEditionContent,
    fields: [
      ['edition_year', 'Año de la edición', 4],
      ['eyebrow', 'Antetítulo', 80], ['title', 'Título', 160], ['description', 'Descripción', 600, true],
      ['registration_title', 'Título del estado de inscripción', 180], ['registration_description', 'Descripción del estado', 600, true], ['registration_label', 'Texto del enlace histórico', 120], ['registration_href', 'Destino del enlace histórico', 512],
      ['bulk_eyebrow', 'Antetítulo de inscripción masiva', 80], ['bulk_title', 'Título de inscripción masiva', 180], ['bulk_description', 'Descripción de inscripción masiva', 600, true], ['bulk_label', 'Texto de descarga', 120],
      ['promotion_label', 'Texto del enlace promocional', 120], ['promotion_href', 'Destino promocional', 512], ['image_alt', 'Texto alternativo de la imagen', 255],
    ],
    preview: (content) => <CurrentEditionSection content={content}/>,
    publishMessage: 'La sección pública “Edición vigente” será sustituida por el borrador completo.', successMessage: '“Edición vigente” publicada correctamente.', supportsImage: true,
  },
  contact: {
    defaults: defaultContactContent, merge: mergeContactContent,
    fields: [['eyebrow', 'Antetítulo', 80], ['title', 'Título', 120], ['description', 'Texto introductorio', 600, true], ['contact_name', 'Persona o unidad de contacto', 180], ['contact_role', 'Cargo o descripción funcional', 240]],
    preview: (content) => <ContactSection content={content}/>,
    publishMessage: 'La sección pública “Contacto” será sustituida por el borrador completo.', successMessage: '“Contacto” publicado correctamente.', supportsImage: false,
  },
}

function CanvasSection({ children, label, onSelect, selected, sectionKey }) {
  return <div className={`editorial-canvas-section ${selected ? 'editorial-canvas-section-selected' : ''}`} data-editorial-section={sectionKey}>
    <div className="editorial-section-control"><span><small>Sección editorial</small><strong>{label}</strong></span><small className="editorial-section-hint">Seleccione el contenido que desea cambiar</small></div>
    <div className="editorial-section-actions" aria-label={`Acciones de ${label}`}>{actionsFor(sectionKey).filter(([action]) => sectionKey !== 'resource-booklets' || action === 'texts').map(([action, actionLabel]) => { const Icon = actionIcons[action]; return <button aria-label={`${actionLabel} de ${label}`} data-editorial-action={action} key={action} onClick={() => onSelect(sectionKey, action)} type="button"><Icon aria-hidden="true" size={17}/>{actionLabel}</button> })}</div>
    {children}
  </div>
}

function MediaCanvasSection({ children, label, onEdit }) {
  return <div className="editorial-canvas-section"><div className="editorial-section-control"><span><small>Sección editorial</small><strong>{label}</strong></span><small className="editorial-section-hint">Seleccione el contenido que desea cambiar</small></div><div className="editorial-section-actions"><button aria-label={`Editar ${label}`} data-editorial-action="items" onClick={onEdit} type="button"><Image aria-hidden="true" size={17}/>Editar imágenes y textos</button></div>{children}</div>
}

function AdminCarouselPreview({ slides }) {
  const published = slides.filter((item) => item.status === 'published')
  const slide = published[0]
  return <section aria-label="Imágenes destacadas" className="bg-white px-5 py-4 sm:px-8 sm:py-6">{slide ? <div className="relative mx-auto max-w-content overflow-hidden rounded-gallery bg-slate-950"><img alt={slide.alt_text} className="main-carousel-image w-full object-cover opacity-80" height={slide.height} src={slide.media_url} width={slide.width}/>{slide.title && <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/95 to-transparent px-5 pb-5 pt-14 text-white sm:px-8"><p className="max-w-3xl text-xl font-black sm:text-2xl">{slide.title}</p></div>}<p className="absolute right-4 top-4 rounded-full bg-slate-950/80 px-3 py-1 text-xs font-bold text-white">{published.length} {published.length === 1 ? 'imagen publicada' : 'imágenes publicadas'}</p></div> : <div className="mx-auto max-w-content rounded-gallery border border-dashed border-slate-300 bg-slate-50 p-8 text-center"><p className="font-black text-slate-800">Carrusel sin imágenes publicadas</p><p className="mt-2 text-sm text-slate-600">Use “Editar” para agregar o habilitar una diapositiva.</p></div>}</section>
}

function AdminEventsPreview({ events }) {
  const published = events.filter((item) => item.status === 'published')
  return <section aria-labelledby="titulo-galeria-editorial" className="scroll-mt-28 py-16 sm:py-20" id="galeria"><div className="mx-auto max-w-content px-5 sm:px-8"><p className="eyebrow text-brand-primary">Memoria OLCOMEP</p><h2 className="section-title mt-3" id="titulo-galeria-editorial">Galería de eventos</h2>{published.length === 0 ? <div className="mt-8 rounded-md border border-dashed border-slate-300 bg-slate-50 p-8"><p className="font-black text-slate-800">Todavía no hay eventos publicados.</p><p className="mt-2 text-sm text-slate-600">Use “Editar” para crear el primer evento o habilitar uno anterior.</p></div> : <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{published.map((event) => <article className="overflow-hidden rounded-xl border border-slate-200 bg-white" key={event.id}>{event.cover_url ? <img alt="" className="aspect-[4/3] w-full object-cover" src={event.cover_url}/> : <div className="aspect-[4/3] bg-slate-100"/>}<div className="p-4"><h3 className="font-black text-slate-900">{event.name}</h3>{event.event_date && <p className="mt-1 text-sm font-bold text-brand-primary">{event.event_date}</p>}{event.description && <p className="mt-2 line-clamp-3 text-sm text-slate-600">{event.description}</p>}</div></article>)}</div>}</div></section>
}

function ResourceCatalogFields({ bookletFiles, bookletImageFiles, chooseBooklet, chooseBookletImage, content, mode, setContent }) {
  const updateEdition = (index, change) => setContent((current) => ({ ...current, editions: current.editions.map((item, position) => position === index ? { ...item, ...change } : item) }))
  const updateMaterial = (editionIndex, materialIndex, change) => setContent((current) => ({ ...current, editions: current.editions.map((edition, position) => position === editionIndex ? { ...edition, materials: edition.materials.map((item, itemPosition) => itemPosition === materialIndex ? { ...item, ...change } : item) } : edition) }))
  const move = (editionIndex, materialIndex, direction) => setContent((current) => {
    const editions = structuredClone(current.editions)
    const items = materialIndex === null ? editions : editions[editionIndex].materials
    const target = (materialIndex === null ? editionIndex : materialIndex) + direction
    const index = materialIndex === null ? editionIndex : materialIndex
    if (target < 0 || target >= items.length) return current
    ;[items[index], items[target]] = [items[target], items[index]]
    return { ...current, editions }
  })
  const remove = (editionIndex, materialIndex = null) => setContent((current) => ({ ...current, editions: materialIndex === null ? current.editions.filter((_, index) => index !== editionIndex) : current.editions.map((edition, index) => index === editionIndex ? { ...edition, materials: edition.materials.filter((_, position) => position !== materialIndex) } : edition) }))
  const addEdition = () => setContent((current) => ({ ...current, editions: [...current.editions, { year: Math.max(new Date().getFullYear(), ...current.editions.filter((edition) => edition.type === mode).map((edition) => Number(edition.year) + 1)), type: mode, materials: [] }] }))
  const addMaterial = (index) => updateEdition(index, { materials: [...content.editions[index].materials, { key: `material-${Date.now()}`, grade: null, role: 'general', title: '', description: '', href: '', image: '' }] })
  return <fieldset className="grid gap-5 border-t border-slate-200 pt-5"><legend className="font-black">{mode === 'pdf' ? 'Cuadernillos PDF' : 'Cuadernillos interactivos'}</legend><p className="text-sm text-slate-600">{mode === 'pdf' ? 'La edición PDF más reciente aparece como vigente; al publicar una posterior, la anterior pasa al archivo histórico. Cada cuadernillo nuevo requiere un PDF.' : 'Cada actividad interactiva usa un enlace y puede tener su propio ícono.'}</p><button className="button justify-self-start" onClick={addEdition} type="button"><Plus aria-hidden="true"/>Agregar edición {mode === 'pdf' ? 'PDF' : 'interactiva'}</button>{content.editions.length === 0 && <p>No hay ediciones en el borrador.</p>}{content.editions.map((edition, index) => edition.type === mode && <div className="rounded-xl border border-slate-200 p-4" key={`${edition.type}-${edition.year}-${index}`}><fieldset className="grid gap-3" disabled={edition.type === 'pdf' && Number(edition.year) < Math.max(...content.editions.filter((item) => item.type === 'pdf').map((item) => Number(item.year)))}>{edition.type === 'pdf' && Number(edition.year) < Math.max(...content.editions.filter((item) => item.type === 'pdf').map((item) => Number(item.year))) && <p className="text-sm font-bold text-slate-600">Archivo histórico · solo consulta</p>}<div className="flex items-center justify-between gap-3"><strong>Edición {edition.year}</strong><div className="flex gap-2"><button aria-label="Subir edición" className="icon-action" disabled={index === 0} onClick={() => move(index, null, -1)} type="button"><ArrowUp aria-hidden="true"/></button><button aria-label="Bajar edición" className="icon-action" disabled={index === content.editions.length - 1} onClick={() => move(index, null, 1)} type="button"><ArrowDown aria-hidden="true"/></button><button aria-label="Eliminar edición" className="icon-action text-red-700" onClick={() => remove(index)} type="button"><Trash2 aria-hidden="true"/></button></div></div><div className="mt-3 grid gap-3 sm:grid-cols-2"><label className="field"><span>Año</span><input className="control" min="1900" max="2100" onChange={(event) => updateEdition(index, { year: event.target.value })} required type="number" value={edition.year}/></label><label className="field"><span>Tipo</span><select className="control" onChange={(event) => updateEdition(index, { type: event.target.value })} value={edition.type}><option value="pdf">PDF</option><option value="interactive">Interactivo</option></select></label></div><div className="mt-4 grid gap-3"><button className="button justify-self-start" onClick={() => addMaterial(index)} type="button"><Plus aria-hidden="true"/>Agregar material</button>{edition.materials.map((item, itemIndex) => <div className="rounded-lg bg-slate-50 p-3" key={`${item.key}-${itemIndex}`}><div className="flex justify-between gap-2"><strong>Material {itemIndex + 1}</strong><div className="flex gap-2"><button aria-label="Subir material" className="icon-action" disabled={itemIndex === 0} onClick={() => move(index, itemIndex, -1)} type="button"><ArrowUp aria-hidden="true"/></button><button aria-label="Bajar material" className="icon-action" disabled={itemIndex === edition.materials.length - 1} onClick={() => move(index, itemIndex, 1)} type="button"><ArrowDown aria-hidden="true"/></button><button aria-label="Eliminar material" className="icon-action text-red-700" onClick={() => remove(index, itemIndex)} type="button"><Trash2 aria-hidden="true"/></button></div></div><div className="mt-3 grid gap-3 sm:grid-cols-2">{[['key','Clave estable'],['title','Título'],['description','Descripción'],['part','Parte (opcional)']].map(([field,label]) => <label className="field" key={field}><span>{label}</span><input className="control" onChange={(event) => updateMaterial(index, itemIndex, { [field]: event.target.value })} required={field !== 'part'} value={item[field] || ''}/></label>)}{<div className="field"><span>{mode === 'interactive' ? 'Ícono del cuadernillo (opcional)' : 'Imagen decorativa (opcional)'}</span><input accept="image/jpeg,image/png,image/webp" className="control file-control" onChange={(event) => { chooseBookletImage(edition.year + '_' + edition.type + '_' + item.key, event.target.files?.[0] || null); updateMaterial(index, itemIndex, { remove_image: false }) }} type="file"/><small>{bookletImageFiles[edition.year + '_' + edition.type + '_' + item.key]?.name || item.image_name || (item.image && !item.remove_image ? 'Imagen histórica conservada' : (mode === 'interactive' ? 'JPEG, PNG o WebP. Recomendado: 256 × 256 píxeles; máximo 512 × 512 y 1 MB.' : 'JPEG, PNG o WebP. Recomendado: 256 × 256 píxeles.'))}</small>{(item.image || item.image_uuid || bookletImageFiles[edition.year + '_' + edition.type + '_' + item.key]) && !item.remove_image && <button className="text-action justify-self-start" onClick={() => { chooseBookletImage(edition.year + '_' + edition.type + '_' + item.key, null); updateMaterial(index, itemIndex, { remove_image: true }) }} type="button">Retirar imagen</button>}{item.remove_image && <button className="text-action justify-self-start" onClick={() => updateMaterial(index, itemIndex, { remove_image: false })} type="button">Conservar imagen</button>}</div>}{edition.type === 'interactive' ? <label className="field"><span>Enlace de la actividad</span><input className="control" onChange={(event) => updateMaterial(index, itemIndex, { href: event.target.value })} required value={item.href || ''}/></label> : <label className="field"><span>{item.file_name || item.href ? 'Reemplazar PDF' : 'Cargar PDF'}</span><input accept="application/pdf,.pdf" className="control file-control" onChange={(event) => chooseBooklet(edition.year + '_' + item.key, event.target.files?.[0] || null)} required={!item.file_name && !item.href && !bookletFiles[edition.year + '_' + item.key]} type="file"/><small>{bookletFiles[edition.year + '_' + item.key]?.name || item.file_name || (item.href ? 'Archivo heredado conservado' : 'PDF de hasta 16 MB. El enlace se genera automáticamente.')}</small></label>}<label className="field"><span>Grado (opcional)</span><select className="control" onChange={(event) => updateMaterial(index, itemIndex, { grade: event.target.value ? Number(event.target.value) : null })} value={item.grade || ''}><option value="">General</option>{[1,2,3,4,5,6].map((grade) => <option key={grade} value={grade}>{grade}</option>)}</select></label><label className="field"><span>Rol</span><select className="control" onChange={(event) => updateMaterial(index, itemIndex, { role: event.target.value })} value={item.role}><option value="estudiante">Estudiante</option><option value="docente">Docente</option><option value="general">General</option></select></label></div></div>)}</div></fieldset></div>)}</fieldset>
}

function EditorialListFields({ content, setContent, collection, title, fields, protectedKey = null }) {
  const items = content[collection]
  const update = (index, field, value) => setContent((current) => ({ ...current, [collection]: current[collection].map((item, position) => position === index ? { ...item, [field]: value } : item) }))
  const move = (index, direction) => setContent((current) => {
    const list = [...current[collection]]
    const target = index + direction
    if (target < 0 || target >= list.length) return current
    ;[list[index], list[target]] = [list[target], list[index]]
    return { ...current, [collection]: list }
  })
  const remove = (index) => { if (items[index]?.key === protectedKey) return; setContent((current) => ({ ...current, [collection]: current[collection].filter((_, position) => position !== index) })) }
  const add = () => setContent((current) => ({ ...current, [collection]: [...current[collection], { key: `item-${Date.now()}-${Math.floor(Math.random() * 1_000_000_000)}`, ...Object.fromEntries(fields.map(([field]) => [field, field === 'names' ? [] : ''])) }] }))
  return <fieldset className="grid gap-4 border-t border-slate-200 pt-5"><legend className="font-black">{title}</legend><button className="button justify-self-start" onClick={add} type="button"><Plus aria-hidden="true"/>Agregar {collection === 'links' ? 'enlace' : 'grupo'}</button>{items.length === 0 && <p>La colección está vacía.</p>}{items.map((item, index) => <div className="rounded-xl border border-slate-200 p-4" key={`${item.key}-${index}`}><div className="mb-3 flex justify-between gap-2"><strong>{title} {index + 1}</strong><div className="flex gap-2"><button aria-label={`Subir ${title} ${index + 1}`} className="icon-action" disabled={index === 0} onClick={() => move(index, -1)} type="button"><ArrowUp aria-hidden="true"/></button><button aria-label={`Bajar ${title} ${index + 1}`} className="icon-action" disabled={index === items.length - 1} onClick={() => move(index, 1)} type="button"><ArrowDown aria-hidden="true"/></button><button aria-label={`Eliminar ${title} ${index + 1}`} className="icon-action text-red-700" disabled={item.key === protectedKey} onClick={() => remove(index)} type="button"><Trash2 aria-hidden="true"/></button></div></div><div className="grid gap-3">{fields.map(([field, label]) => <label className="field" key={field}><span>{label}</span>{field === 'names' ? <textarea className="control min-h-24" onChange={(event) => update(index, field, event.target.value.split(/\r?\n/))} value={item.names.join('\n')}/> : <input className="control" maxLength={field === 'href' ? 512 : 180} onChange={(event) => update(index, field, event.target.value)} readOnly={item.key === protectedKey} required value={item[field] || ''}/>}</label>)}</div></div>)}</fieldset>
}

function EditorialSiteCanvas({ content, events, logoUrl, mepLogoUrl, onEditCarousel, onEditEvents, onSelect, selectedKey, slides }) {
  return <div className="olcomep-site editorial-site-canvas bg-white text-ink">
    <SiteHeader content={defaultSiteHeaderContent} currentEdition={content['current-edition']} calificameHref={content.contact?.resources?.find((item) => item.key === 'calificame')?.href} logoUrl={logoUrl} mepLogoUrl={mepLogoUrl} preview/>
    <div className="editorial-canvas-notice" role="note"><strong>Vista editorial completa</strong><span>Carrusel, contenido y galería se muestran juntos en el orden de la página pública.</span></div>
    <main id="contenido-editorial-completo">
      <MediaCanvasSection label="Carrusel principal" onEdit={onEditCarousel}><AdminCarouselPreview slides={slides}/></MediaCanvasSection>
      <CanvasSection label="Portada principal" onSelect={onSelect} selected={selectedKey === 'hero'} sectionKey="hero"><HeroSection content={content.hero}/></CanvasSection>
      <CanvasSection label="Preguntas frecuentes" onSelect={onSelect} selected={selectedKey === 'general-information'} sectionKey="general-information"><GeneralInformationSection content={content['general-information']}/></CanvasSection>
      <CanvasSection label="Calendario" onSelect={onSelect} selected={selectedKey === 'calendar'} sectionKey="calendar"><CalendarSection content={content.calendar}/></CanvasSection>
      <MediaCanvasSection label="Eventos y fotografías" onEdit={onEditEvents}><AdminEventsPreview events={events}/></MediaCanvasSection>
      <CanvasSection label="Conoce OLCOMEP" onSelect={onSelect} selected={selectedKey === 'olcomep-introduction'} sectionKey="olcomep-introduction"><OlcomepIntroductionSection content={content['olcomep-introduction']} logoUrl={logoUrl}/></CanvasSection>
      <CanvasSection label="Acerca de nosotros" onSelect={onSelect} selected={selectedKey === 'about'} sectionKey="about"><AboutUsSection content={content.about}/></CanvasSection>
      <CanvasSection label="Colaboradores y patrocinadores" onSelect={onSelect} selected={selectedKey === 'partners'} sectionKey="partners"><PartnersSection content={content.partners}/></CanvasSection>
      <CanvasSection label="Coordinaciones regionales" onSelect={onSelect} selected={selectedKey === 'regional-coordinations'} sectionKey="regional-coordinations"><RegionalCoordinationSection content={content['regional-coordinations']}/></CanvasSection>
      <CanvasSection label="Edición vigente" onSelect={onSelect} selected={selectedKey === 'current-edition'} sectionKey="current-edition"><CurrentEditionSection content={content['current-edition']}/></CanvasSection>
      <CanvasSection label="Recursos y cuadernillos" onSelect={onSelect} selected={selectedKey === 'resource-booklets'} sectionKey="resource-booklets"><ResourceBookletsSection content={content['resource-booklets']} onEditPdf={() => onSelect('resource-booklets', 'pdf')} onEditInteractive={() => onSelect('resource-booklets', 'interactive')}/></CanvasSection>
      <CanvasSection label="Contacto" onSelect={onSelect} selected={selectedKey === 'contact'} sectionKey="contact"><ContactSection content={content.contact}/></CanvasSection>
    </main>
    <SiteFooter content={content['site-footer']} logoUrl={logoUrl} mepLogoUrl={mepLogoUrl} preview/>
  </div>
}

export function ContentEditor({ api, busy, events, logoUrl, mepLogoUrl, onDirtyChange, onEditCarousel, onEditEvents, run, saveError, setConfirmation, slides }) {
  const [sections, setSections] = useState([])
  const [footerContent, setFooterContent] = useState(defaultSiteFooterContent)
  const [selectedKey, setSelectedKey] = useState('hero')
  const [content, setContent] = useState(defaultHeroContent)
  const [image, setImage] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [manualFile, setManualFile] = useState(null)
  const [manualPreviewUrl, setManualPreviewUrl] = useState(null)
  const [storedManualUrl, setStoredManualUrl] = useState(null)
  const [logoFiles, setLogoFiles] = useState({})
  const [logoPreviewUrls, setLogoPreviewUrls] = useState({})
  const [contactPhotoFiles, setContactPhotoFiles] = useState({})
  const [contactPhotoPreviewUrls, setContactPhotoPreviewUrls] = useState({})
  const [storedContactPhotoUrls, setStoredContactPhotoUrls] = useState({})
  const [editionDocumentFiles, setEditionDocumentFiles] = useState({})
  const [bookletFiles, setBookletFiles] = useState({})
  const [bookletImageFiles, setBookletImageFiles] = useState({})
  const [bookletImagePreviewUrls, setBookletImagePreviewUrls] = useState({})
  const [storedBookletImageUrls, setStoredBookletImageUrls] = useState({})
  const [editionDocumentPreviewUrls, setEditionDocumentPreviewUrls] = useState({})
  const [storedEditionDocumentUrls, setStoredEditionDocumentUrls] = useState({})
  const [bulkTemplateFile, setBulkTemplateFile] = useState(null)
  const [bulkTemplatePreviewUrl, setBulkTemplatePreviewUrl] = useState(null)
  const [storedBulkTemplateUrl, setStoredBulkTemplateUrl] = useState(null)
  const [editorOpen, setEditorOpen] = useState(false)
  const [activeAction, setActiveAction] = useState('texts')
  const inspectorTitleRef = useRef(null)
  const previewRef = useRef(null)

  const section = sections.find(({ key }) => key === selectedKey) || null
  const editor = editors[selectedKey] || editors.hero

  const applySection = (next, key = next?.key ?? selectedKey) => {
    const nextEditor = editors[key]
    setContent(nextEditor.merge(next?.draft?.content || next?.published?.content || nextEditor.defaults))
    setImage(null)
    setPreviewUrl(null)
    if (manualPreviewUrl) URL.revokeObjectURL(manualPreviewUrl)
    setManualFile(null)
    setManualPreviewUrl(null)
    setStoredManualUrl(null)
    Object.values(logoPreviewUrls).forEach((url) => URL.revokeObjectURL(url))
    setLogoFiles({})
    setLogoPreviewUrls({})
    Object.values(contactPhotoPreviewUrls).forEach((url) => URL.revokeObjectURL(url))
    setContactPhotoFiles({})
    setContactPhotoPreviewUrls({})
    setStoredContactPhotoUrls({})
    Object.values(editionDocumentPreviewUrls).forEach((url) => URL.revokeObjectURL(url))
    setEditionDocumentFiles({})
    setBookletFiles({})
    Object.values(bookletImagePreviewUrls).forEach((url) => URL.revokeObjectURL(url))
    setBookletImageFiles({})
    setBookletImagePreviewUrls({})
    setStoredBookletImageUrls({})
    setEditionDocumentPreviewUrls({})
    setStoredEditionDocumentUrls({})
    if (bulkTemplatePreviewUrl) URL.revokeObjectURL(bulkTemplatePreviewUrl)
    setBulkTemplateFile(null)
    setBulkTemplatePreviewUrl(null)
    setStoredBulkTemplateUrl(null)
  }

  useEffect(() => {
    let active = true
    run(() => api.adminSiteSections()).then((result) => {
      if (!active || !result) return
      const editable = result.filter(({ key }) => editors[key])
      setSections(editable)
      const initialSection = editable.find(({ key }) => key === 'hero') || editable[0]
      const initialKey = initialSection?.key ?? 'hero'
      setSelectedKey(initialKey)
      applySection(initialSection, initialKey)
    })
    return () => { active = false }
  }, [api, run])

  useEffect(() => {
    let active = true
    api.siteHome().then((result) => {
      if (active && result.sections?.['site-footer']?.content) setFooterContent(result.sections['site-footer'].content)
    }).catch(() => {})
    return () => { active = false }
  }, [api])

  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl) }, [previewUrl])

  useEffect(() => {
    let active = true
    let objectUrl = null
    if (selectedKey !== 'calendar' || !content.manual_uuid) {
      setStoredManualUrl(null)
      return () => { active = false }
    }
    api.adminMediaObjectUrl(content.manual_uuid).then((url) => {
      objectUrl = url
      if (active) setStoredManualUrl(url)
      else URL.revokeObjectURL(url)
    }).catch(() => { if (active) setStoredManualUrl(null) })
    return () => { active = false; if (objectUrl) URL.revokeObjectURL(objectUrl) }
  }, [api, selectedKey, content.manual_uuid])

  const contactMediaSignature = selectedKey === 'regional-coordinations'
    ? content.regions.flatMap((region) => region.contacts.map((contact) => contact.media_uuid || '')).join('|')
    : ''
  useEffect(() => {
    let active = true
    const objectUrls = []
    const contacts = selectedKey === 'regional-coordinations' ? content.regions.flatMap((region) => region.contacts).filter((contact) => contact.media_uuid) : []
    if (contacts.length === 0) {
      setStoredContactPhotoUrls({})
      return () => { active = false }
    }
    Promise.all(contacts.map(async (contact) => [contact.key, await api.adminMediaObjectUrl(contact.media_uuid)])).then((entries) => {
      entries.forEach(([, url]) => objectUrls.push(url))
      if (active) setStoredContactPhotoUrls(Object.fromEntries(entries))
      else objectUrls.forEach((url) => URL.revokeObjectURL(url))
    }).catch(() => { if (active) setStoredContactPhotoUrls({}) })
    return () => { active = false; objectUrls.forEach((url) => URL.revokeObjectURL(url)) }
  }, [api, selectedKey, contactMediaSignature])

  const editionMediaSignature = selectedKey === 'current-edition'
    ? content.resources.map((resource) => resource.file_uuid || '').join('|')
    : ''
  useEffect(() => {
    let active = true
    const objectUrls = []
    const resources = selectedKey === 'current-edition' ? content.resources.filter((resource) => resource.file_uuid) : []
    if (resources.length === 0) {
      setStoredEditionDocumentUrls({})
      return () => { active = false }
    }
    Promise.all(resources.map(async (resource) => [resource.key, await api.adminMediaObjectUrl(resource.file_uuid)])).then((entries) => {
      entries.forEach(([, url]) => objectUrls.push(url))
      if (active) setStoredEditionDocumentUrls(Object.fromEntries(entries))
      else objectUrls.forEach((url) => URL.revokeObjectURL(url))
    }).catch(() => { if (active) setStoredEditionDocumentUrls({}) })
    return () => { active = false; objectUrls.forEach((url) => URL.revokeObjectURL(url)) }
  }, [api, selectedKey, editionMediaSignature])

  const bookletImageSignature = selectedKey === 'resource-booklets'
    ? content.editions.flatMap((edition) => edition.materials.map((material) => `${edition.year}_${edition.type}_${material.key}:${material.image_uuid || ''}`)).join('|')
    : ''
  useEffect(() => {
    let active = true
    const objectUrls = []
    const images = selectedKey === 'resource-booklets'
      ? content.editions.flatMap((edition) => edition.materials.filter((material) => material.image_uuid).map((material) => [`${edition.year}_${edition.type}_${material.key}`, material.image_uuid]))
      : []
    if (images.length === 0) {
      setStoredBookletImageUrls({})
      return () => { active = false }
    }
    Promise.all(images.map(async ([key, uuid]) => [key, await api.adminMediaObjectUrl(uuid)])).then((entries) => {
      entries.forEach(([, url]) => objectUrls.push(url))
      if (active) setStoredBookletImageUrls(Object.fromEntries(entries))
      else objectUrls.forEach((url) => URL.revokeObjectURL(url))
    }).catch(() => { if (active) setStoredBookletImageUrls({}) })
    return () => { active = false; objectUrls.forEach((url) => URL.revokeObjectURL(url)) }
  }, [api, selectedKey, bookletImageSignature])

  useEffect(() => {
    let active = true
    let objectUrl = null
    if (selectedKey !== 'current-edition' || !content.bulk_file_uuid || content.bulk_remove) {
      setStoredBulkTemplateUrl(null)
      return () => { active = false }
    }
    api.adminMediaObjectUrl(content.bulk_file_uuid).then((url) => {
      objectUrl = url
      if (active) setStoredBulkTemplateUrl(url)
      else URL.revokeObjectURL(url)
    }).catch(() => { if (active) setStoredBulkTemplateUrl(null) })
    return () => { active = false; if (objectUrl) URL.revokeObjectURL(objectUrl) }
  }, [api, selectedKey, content.bulk_file_uuid, content.bulk_remove])

  const applySectionSelection = (key, openEditor = false, action = 'texts') => {
    setSelectedKey(key)
    setActiveAction(action)
    applySection(sections.find((item) => item.key === key), key)
    if (openEditor) setEditorOpen(true)
    requestAnimationFrame(() => {
      const canvasSection = previewRef.current?.querySelector(`[data-editorial-section="${key}"]`)
      if (canvasSection) {
        previewRef.current.scrollTo({
          top: Math.max(0, canvasSection.offsetTop - 12),
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        })
      }
      if (openEditor) inspectorTitleRef.current?.focus()
    })
  }
  const selectSection = (key, openEditor = false, action = 'texts') => {
    if (key === selectedKey) {
      if (openEditor) {
        setActiveAction(action)
        setEditorOpen(true)
        requestAnimationFrame(() => inspectorTitleRef.current?.focus())
      }
      return
    }
    if (hasLocalChanges) {
      const nextLabel = sections.find((item) => item.key === key)?.label || 'otra sección'
      setConfirmation({
        title: 'Descartar cambios sin guardar',
        text: `Los cambios locales de “${section?.label || selectedKey}” se perderán al abrir “${nextLabel}”.`,
        confirmLabel: 'Descartar y continuar',
        action: () => applySectionSelection(key, openEditor, action),
      })
      return
    }
    applySectionSelection(key, openEditor, action)
  }
  const updateSection = (next, preserveContactPreviews = false) => {
    setSections((current) => current.some((item) => item.key === next.key)
      ? current.map((item) => item.key === next.key ? next : item)
      : [...current, next])
    if (preserveContactPreviews && next.key === 'regional-coordinations') {
      setContent(editors['regional-coordinations'].merge(next?.draft?.content || next?.published?.content || defaultRegionalCoordinationsContent))
      setContactPhotoFiles({})
      return
    }
    applySection(next)
  }
  const chooseImage = (event) => {
    const file = event.target.files?.[0] || null
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setImage(file)
    setPreviewUrl(file ? URL.createObjectURL(file) : null)
  }
  const chooseBookletImage = (key, file) => {
    if (bookletImagePreviewUrls[key]) URL.revokeObjectURL(bookletImagePreviewUrls[key])
    setBookletImageFiles((current) => ({ ...current, [key]: file }))
    setBookletImagePreviewUrls((current) => ({ ...current, [key]: file ? URL.createObjectURL(file) : null }))
  }
  const chooseManual = (event) => {
    const file = event.target.files?.[0] || null
    if (manualPreviewUrl) URL.revokeObjectURL(manualPreviewUrl)
    setManualFile(file)
    setManualPreviewUrl(file ? URL.createObjectURL(file) : null)
  }
  const updateSchedule = (index, field, value) => setContent((current) => ({
    ...current,
    schedule: current.schedule.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item),
  }))
  const addActivity = () => setContent((current) => ({
    ...current,
    schedule: [...current.schedule, { date: '', dateTime: '', title: '', description: '', highlighted: false }],
  }))
  const removeActivity = (index) => setContent((current) => ({
    ...current,
    schedule: current.schedule.filter((_, itemIndex) => itemIndex !== index),
  }))
  const moveActivity = (index, direction) => setContent((current) => {
    const target = index + direction
    if (target < 0 || target >= current.schedule.length) return current
    const schedule = [...current.schedule]
    ;[schedule[index], schedule[target]] = [schedule[target], schedule[index]]
    return { ...current, schedule }
  })
  const updateInstitution = (collection, index, field, value) => setContent((current) => ({ ...current, [collection]: current[collection].map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item) }))
  const addInstitution = (collection) => setContent((current) => ({ ...current, [collection]: [...current[collection], { key: `item-${Date.now()}-${Math.floor(Math.random() * 10000)}`, name: '', description: '', url: '' }] }))
  const removeInstitution = (collection, index) => setContent((current) => ({ ...current, [collection]: current[collection].filter((_, itemIndex) => itemIndex !== index) }))
  const moveInstitution = (collection, index, direction) => setContent((current) => {
    const target = index + direction
    if (target < 0 || target >= current[collection].length) return current
    const items = [...current[collection]]
    ;[items[index], items[target]] = [items[target], items[index]]
    return { ...current, [collection]: items }
  })
  const chooseInstitutionLogo = (key, file) => {
    if (logoPreviewUrls[key]) URL.revokeObjectURL(logoPreviewUrls[key])
    setLogoFiles((current) => ({ ...current, [key]: file }))
    setLogoPreviewUrls((current) => ({ ...current, [key]: file ? URL.createObjectURL(file) : null }))
  }
  const updateTextItem = (collection, index, value) => setContent((current) => ({ ...current, [collection]: current[collection].map((item, itemIndex) => itemIndex === index ? value : item) }))
  const addTextItem = (collection) => setContent((current) => ({ ...current, [collection]: [...current[collection], ''] }))
  const removeTextItem = (collection, index) => setContent((current) => ({ ...current, [collection]: current[collection].filter((_, itemIndex) => itemIndex !== index) }))
  const updateMilestone = (index, field, value) => setContent((current) => ({ ...current, milestones: current.milestones.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item) }))
  const addMilestone = () => setContent((current) => ({ ...current, milestones: [...current.milestones, { key: `hito-${Date.now()}-${Math.floor(Math.random() * 10000)}`, period: '', title: '', description: '' }] }))
  const removeMilestone = (index) => setContent((current) => ({ ...current, milestones: current.milestones.filter((_, itemIndex) => itemIndex !== index) }))
  const moveMilestone = (index, direction) => setContent((current) => { const target = index + direction; if (target < 0 || target >= current.milestones.length) return current; const milestones = [...current.milestones]; [milestones[index], milestones[target]] = [milestones[target], milestones[index]]; return { ...current, milestones } })
  const addFaq = () => setContent((current) => ({ ...current, faqs: [...current.faqs, { key: `pregunta-${Date.now()}-${Math.floor(Math.random() * 10000)}`, question: '', answer: '' }] }))
  const addEditionResource = () => setContent((current) => ({ ...current, resources: [...current.resources, { key: `documento-${Date.now()}-${Math.floor(Math.random() * 10000)}`, title: '', description: '' }] }))
  const chooseEditionDocument = (key, file) => {
    if (editionDocumentPreviewUrls[key]) URL.revokeObjectURL(editionDocumentPreviewUrls[key])
    setEditionDocumentFiles((current) => ({ ...current, [key]: file }))
    setEditionDocumentPreviewUrls((current) => ({ ...current, [key]: file ? URL.createObjectURL(file) : null }))
  }
  const chooseBulkTemplate = (file) => {
    if (bulkTemplatePreviewUrl) URL.revokeObjectURL(bulkTemplatePreviewUrl)
    setBulkTemplateFile(file)
    setBulkTemplatePreviewUrl(file ? URL.createObjectURL(file) : null)
    setContent((current) => ({ ...current, bulk_remove: false }))
  }
  const removeBulkTemplate = () => {
    if (bulkTemplatePreviewUrl) URL.revokeObjectURL(bulkTemplatePreviewUrl)
    setBulkTemplateFile(null)
    setBulkTemplatePreviewUrl(null)
    setContent((current) => ({ ...current, bulk_remove: true, bulk_href: null }))
  }
  const addRegion = () => setContent((current) => ({ ...current, regions: [...current.regions, { region: '', contacts: [] }] }))
  const updateRegion = (index, value) => setContent((current) => ({ ...current, regions: current.regions.map((item, itemIndex) => itemIndex === index ? { ...item, region: value } : item) }))
  const addContact = (regionIndex) => setContent((current) => ({ ...current, regions: current.regions.map((region, index) => index === regionIndex ? { ...region, contacts: [...region.contacts, { key: `regional-${Date.now()}-${Math.floor(Math.random() * 10000)}`, name: '', emails: [] }] } : region) }))
  const updateContact = (regionIndex, contactIndex, field, value) => setContent((current) => ({ ...current, regions: current.regions.map((region, index) => index === regionIndex ? { ...region, contacts: region.contacts.map((contact, itemIndex) => itemIndex === contactIndex ? { ...contact, [field]: value } : contact) } : region) }))
  const removeContact = (regionIndex, contactIndex) => setContent((current) => ({ ...current, regions: current.regions.map((region, index) => index === regionIndex ? { ...region, contacts: region.contacts.filter((_, itemIndex) => itemIndex !== contactIndex) } : region) }))
  const moveContact = (regionIndex, contactIndex, direction) => setContent((current) => ({
    ...current,
    regions: current.regions.map((region, index) => {
      if (index !== regionIndex) return region
      const target = contactIndex + direction
      if (target < 0 || target >= region.contacts.length) return region
      const contacts = [...region.contacts]
      ;[contacts[contactIndex], contacts[target]] = [contacts[target], contacts[contactIndex]]
      return { ...region, contacts }
    }),
  }))
  const chooseContactPhoto = (key, file) => {
    if (contactPhotoPreviewUrls[key]) URL.revokeObjectURL(contactPhotoPreviewUrls[key])
    setContactPhotoFiles((current) => ({ ...current, [key]: file }))
    setContactPhotoPreviewUrls((current) => ({ ...current, [key]: file ? URL.createObjectURL(file) : null }))
    setContent((current) => ({ ...current, regions: current.regions.map((region) => ({ ...region, contacts: region.contacts.map((contact) => contact.key === key ? { ...contact, remove_photo: false } : contact) })) }))
  }
  const removeContactPhoto = (key) => {
    if (contactPhotoPreviewUrls[key]) URL.revokeObjectURL(contactPhotoPreviewUrls[key])
    setContactPhotoFiles((current) => ({ ...current, [key]: null }))
    setContactPhotoPreviewUrls((current) => ({ ...current, [key]: null }))
    setContent((current) => ({ ...current, regions: current.regions.map((region) => ({ ...region, contacts: region.contacts.map((contact) => contact.key === key ? { ...contact, remove_photo: true, photo_url: null } : contact) })) }))
  }
  const save = async (event) => {
    event.preventDefault()
    const form = new FormData()
    editor.fields.forEach(([field]) => form.set(field, content[field] || ''))
    if (selectedKey === 'calendar') form.set('schedule_json', JSON.stringify(content.schedule))
    if (selectedKey === 'calendar' && manualFile) form.set('manual', manualFile)
    if (selectedKey === 'partners') {
      form.set('collaborators_json', JSON.stringify(content.collaborators))
      form.set('sponsors_json', JSON.stringify(content.sponsors))
      Object.entries(logoFiles).forEach(([key, file]) => { if (file) form.set(`logo_${key}`, file) })
    }
    if (selectedKey === 'about') {
      form.set('introduction_json', JSON.stringify(content.introduction))
      form.set('milestones_json', JSON.stringify(content.milestones))
      form.set('closing_paragraphs_json', JSON.stringify(content.closing_paragraphs))
    }
    if (selectedKey === 'general-information') {
      form.set('faqs_json', JSON.stringify(content.faqs))
    }
    if (selectedKey === 'regional-coordinations') {
      form.set('regions_json', JSON.stringify(content.regions))
      Object.entries(contactPhotoFiles).forEach(([key, file]) => { if (file) form.set(`photo_${key}`, file) })
    }
    if (selectedKey === 'current-edition') {
      form.set('edition_year', String(content.edition_year))
      form.set('resources_json', JSON.stringify(content.resources))
      Object.entries(editionDocumentFiles).forEach(([key, file]) => { if (file) form.set(`document_${key}`, file) })
      if (bulkTemplateFile) form.set('bulk_template', bulkTemplateFile)
      if (content.bulk_href) form.set('bulk_href', content.bulk_href)
      form.set('bulk_remove', content.bulk_remove ? '1' : '0')
    }
    if (selectedKey === 'contact') {
      form.set('phones_json', JSON.stringify(content.phones.filter(Boolean)))
      form.set('emails_json', JSON.stringify(content.emails.filter(Boolean)))
      form.set('resources_json', JSON.stringify(content.resources))
    }
    if (selectedKey === 'resource-booklets') {
      form.set('editions_json', JSON.stringify(content.editions))
      Object.entries(bookletFiles).forEach(([key, file]) => { if (file) form.set(`booklet_${key}`, file) })
      Object.entries(bookletImageFiles).forEach(([key, file]) => { if (file) form.set(`booklet_image_${key}`, file) })
    }
    if (image) form.set('image', image)
    const result = await run(() => api.saveSiteSectionDraft(selectedKey, form), `Borrador de “${section?.label || selectedKey}” guardado.`)
    if (result) {
      updateSection(result, selectedKey === 'regional-coordinations')
    }
  }
  const publish = () => setConfirmation({
    text: `${editor.publishMessage} La versión anterior permanecerá en el historial.`,
    action: async () => {
      const result = await run(() => api.publishSiteSection(selectedKey), editor.successMessage)
      if (result) {
        updateSection(result)
        setEditorOpen(false)
      }
    },
  })
  const previewContent = { ...content, image_url: previewUrl || content.image_url }
  const manualUrl = manualPreviewUrl || storedManualUrl || content.manual_href
  if (selectedKey === 'calendar') previewContent.manual_href = manualUrl
  if (selectedKey === 'partners') {
    previewContent.collaborators = content.collaborators.map((item) => ({ ...item, logo_url: logoPreviewUrls[item.key] || item.logo_url }))
    previewContent.sponsors = content.sponsors.map((item) => ({ ...item, logo_url: logoPreviewUrls[item.key] || item.logo_url }))
  }
  if (selectedKey === 'regional-coordinations') {
    previewContent.regions = content.regions.map((region) => ({ ...region, contacts: region.contacts.map((contact) => ({ ...contact, photo_url: contactPhotoPreviewUrls[contact.key] || storedContactPhotoUrls[contact.key] || contact.photo_url })) }))
  }
  if (selectedKey === 'current-edition') {
    previewContent.resources = content.resources.map((resource) => ({
      ...resource,
      href: editionDocumentPreviewUrls[resource.key] || storedEditionDocumentUrls[resource.key] || resource.href,
      file_name: editionDocumentFiles[resource.key]?.name || resource.file_name,
      file_size: editionDocumentFiles[resource.key]?.size || resource.file_size,
      format: 'PDF',
      icon: 'file',
    }))
    previewContent.bulk_href = content.bulk_remove ? null : (bulkTemplatePreviewUrl || storedBulkTemplateUrl || content.bulk_href)
  }
  if (selectedKey === 'resource-booklets') {
    previewContent.editions = content.editions.map((edition) => ({ ...edition, materials: edition.materials.map((material) => {
      const key = `${edition.year}_${edition.type}_${material.key}`
      return { ...material, image: material.remove_image ? undefined : (bookletImagePreviewUrls[key] || storedBookletImageUrls[key] || material.image) }
    }) }))
  }
  const canvasContent = Object.fromEntries(Object.entries(editors).map(([key, config]) => {
    const item = sections.find((candidate) => candidate.key === key)
    return [key, config.merge(item?.draft?.content || item?.published?.content || config.defaults)]
  }))
  canvasContent['site-footer'] = footerContent
  canvasContent[selectedKey] = previewContent
  const persistedContent = editor.merge(section?.draft?.content || section?.published?.content || editor.defaults)
  const hasPendingFiles = Boolean(image || manualFile || bulkTemplateFile || Object.values(logoFiles).some(Boolean) || Object.values(contactPhotoFiles).some(Boolean) || Object.values(editionDocumentFiles).some(Boolean) || Object.values(bookletFiles).some(Boolean) || Object.values(bookletImageFiles).some(Boolean))
  const hasLocalChanges = hasPendingFiles || JSON.stringify(content) !== JSON.stringify(persistedContent)
  const draftCount = sections.filter((item) => item.draft).length
  const publishedCount = sections.length - draftCount
  const closeEditor = () => {
    if (hasLocalChanges) {
      setConfirmation({
        title: 'Cerrar sin guardar',
        text: `Los cambios locales de “${section?.label || selectedKey}” se perderán.`,
        confirmLabel: 'Descartar cambios',
        action: () => { applySection(section); setEditorOpen(false) },
      })
      return
    }
    setEditorOpen(false)
  }
  const renderEditorField = ([field, label, maxLength, multiline]) => <label className="field" key={field}><span>{label}</span>{multiline ? <textarea className="control min-h-28" maxLength={maxLength} onChange={(event) => setContent((value) => ({ ...value, [field]: event.target.value }))} required value={content[field]}/> : <input className="control" maxLength={maxLength} onChange={(event) => setContent((value) => ({ ...value, [field]: event.target.value }))} required type={field === 'edition_year' ? 'number' : 'text'} min={field === 'edition_year' ? 2000 : undefined} max={field === 'edition_year' ? 2100 : undefined} value={content[field]}/>}</label>
  const editionField = (field) => renderEditorField(editor.fields.find(([candidate]) => candidate === field))
  const bulkTemplateUrl = content.bulk_remove ? null : (bulkTemplatePreviewUrl || storedBulkTemplateUrl || content.bulk_href)
  const bulkTemplateName = bulkTemplateFile?.name || content.bulk_file_name || (content.bulk_href ? decodeURIComponent(content.bulk_href.split('/').pop()) : '')
  const bulkTemplateSize = bulkTemplateFile?.size || content.bulk_file_size

  useEffect(() => {
    onDirtyChange?.(hasLocalChanges)
  }, [hasLocalChanges, onDirtyChange])

  useEffect(() => () => onDirtyChange?.(false), [onDirtyChange])

  useEffect(() => {
    if (!hasLocalChanges) return undefined
    const warnBeforeUnload = (event) => {
      event.preventDefault()
      event.returnValue = ''
    }
    window.addEventListener('beforeunload', warnBeforeUnload)
    return () => window.removeEventListener('beforeunload', warnBeforeUnload)
  }, [hasLocalChanges])

  useEffect(() => {
    if (!editorOpen) return undefined
    const previousOverflow = document.body.style.overflow
    const closeWithEscape = (event) => { if (event.key === 'Escape') closeEditor() }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', closeWithEscape)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', closeWithEscape)
    }
  }, [editorOpen, hasLocalChanges])

  return <section className="content-editor py-7" aria-labelledby="content-title">
    <div className="section-heading"><div><h2 id="content-title">Contenido del sitio</h2><p>Seleccione “Editar” directamente sobre la sección de la página pública que desea modificar.</p></div></div>
    <div className="editorial-navigation-heading mt-5"><p className="editorial-status-summary" role="status"><strong>{sections.length} secciones:</strong> {publishedCount} al día · {draftCount} con borrador pendiente{hasLocalChanges ? ' · 1 con cambios locales' : ''}</p></div>
    <div className="editorial-public-surface site-preview mt-5" ref={previewRef}>
      <EditorialSiteCanvas content={publicAssetUrl(canvasContent)} events={events} logoUrl={logoUrl} mepLogoUrl={mepLogoUrl} onEditCarousel={onEditCarousel} onEditEvents={onEditEvents} onSelect={(key, action) => selectSection(key, true, action)} selectedKey={editorOpen ? selectedKey : null} slides={slides}/>
    </div>
    {editorOpen && <div className="editor-modal-backdrop" role="presentation"><section aria-labelledby="editorial-inspector-title" aria-modal="true" className="editor-modal" role="dialog">
      <header className="editor-modal-header"><div><p className="text-xs font-black uppercase tracking-[.14em] text-brand-primary">{actionsFor(selectedKey).find(([action]) => action === activeAction)?.[1]}</p><h3 className="mt-1 font-black" id="editorial-inspector-title" ref={inspectorTitleRef} tabIndex="-1">{section?.label || 'Contenido'}</h3><div className="mt-2 flex flex-wrap gap-2"><span className={`status ${section?.draft ? 'status-draft' : 'status-published'}`}>{section?.draft ? 'Borrador pendiente' : 'Publicado'}</span>{hasLocalChanges && <span className="status status-unsaved" role="status">Cambios sin guardar</span>}</div></div><button aria-label={`Cerrar edición de ${section?.label || 'la sección'}`} className="icon-action" onClick={closeEditor} type="button"><X aria-hidden="true"/></button></header>
      <form aria-labelledby="editorial-inspector-title" className="editor-modal-form grid content-start gap-4" id="editorial-section-form" onSubmit={save}>
        <p className="text-sm text-slate-600">{actionsFor(selectedKey).find(([action]) => action === activeAction)?.[1]} en {section?.label || 'esta sección'}. Los demás contenidos se conservan en el borrador.</p>
        {selectedKey !== 'current-edition' && editor.fields.filter(([field]) => activeAction === (buttonFields.has(field) ? 'buttons' : imageFields.has(field) ? 'images' : 'texts')).map(renderEditorField)}
        {selectedKey === 'resource-booklets' && ['pdf', 'interactive'].includes(activeAction) && <ResourceCatalogFields bookletFiles={bookletFiles} bookletImageFiles={bookletImageFiles} chooseBooklet={(key, file) => setBookletFiles((current) => ({ ...current, [key]: file }))} chooseBookletImage={chooseBookletImage} content={content} mode={activeAction} setContent={setContent}/>}
        {selectedKey === 'current-edition' && activeAction === 'texts' && <>
          <fieldset className="grid gap-4"><legend className="text-lg font-black text-slate-900">1. Información principal</legend><p className="text-sm text-slate-600">Identifica la edición y presenta su información general en la página pública.</p>{['edition_year', 'eyebrow', 'title', 'description'].map(editionField)}</fieldset>
          <fieldset className="grid gap-4 border-t border-slate-200 pt-5"><legend className="text-lg font-black text-slate-900">Estado de inscripción</legend><p className="text-sm text-slate-600">Comunica el estado actual de la inscripción.</p>{['registration_title', 'registration_description'].map(editionField)}</fieldset>
        </>}
        {selectedKey === 'current-edition' && activeAction === 'texts' && ['bulk_eyebrow', 'bulk_title', 'bulk_description'].map(editionField)}
        {selectedKey === 'current-edition' && activeAction === 'buttons' && ['registration_label', 'registration_href', 'bulk_label', 'promotion_label', 'promotion_href'].map(editionField)}
        {selectedKey === 'contact' && activeAction === 'items' && <><label className="field"><span>Teléfonos, uno por línea</span><textarea className="control min-h-24" onChange={(event) => setContent((current) => ({ ...current, phones: event.target.value.split(/\r?\n/) }))} value={content.phones.join('\n')}/></label><label className="field"><span>Correos, uno por línea</span><textarea className="control min-h-24" onChange={(event) => setContent((current) => ({ ...current, emails: event.target.value.split(/\r?\n/) }))} value={content.emails.join('\n')}/></label><fieldset className="grid gap-4 border-t border-slate-200 pt-5"><legend className="font-black">Recursos adicionales</legend><button className="button justify-self-start" onClick={() => setContent((current) => ({ ...current, resources: [...current.resources.slice(0, current.resources.findIndex((resource) => resource.key === 'youtube') + 1), { key: `recurso-${Date.now()}`, title: '', description: '', href: '/' }, ...current.resources.slice(current.resources.findIndex((resource) => resource.key === 'youtube') + 1)] }))} type="button"><Plus aria-hidden="true"/>Agregar recurso</button>{content.resources.map((resource, index) => resource.key === 'calificame' ? null : <div className="rounded-xl border border-slate-200 p-4" key={resource.key}><button aria-label="Eliminar recurso" className="icon-action float-right text-red-700" onClick={() => removeInstitution('resources', index)} type="button"><Trash2 aria-hidden="true"/></button><label className="field"><span>Título</span><input className="control" onChange={(event) => updateInstitution('resources', index, 'title', event.target.value)} required value={resource.title}/></label><label className="field mt-3"><span>Descripción</span><textarea className="control" onChange={(event) => updateInstitution('resources', index, 'description', event.target.value)} required value={resource.description}/></label><label className="field mt-3"><span>Destino</span><input className="control" onChange={(event) => updateInstitution('resources', index, 'href', event.target.value)} required value={resource.href}/></label></div>)}</fieldset></>}
        {selectedKey === 'calendar' && activeAction === 'items' && <fieldset className="grid gap-4 border-t border-slate-200 pt-5"><legend className="font-black">Actividades del cronograma</legend><div className="flex items-center justify-between gap-3"><p className="text-sm text-slate-600">{content.schedule.length} actividades en este borrador.</p><button className="button" onClick={addActivity} type="button"><Plus aria-hidden="true"/>Agregar actividad</button></div>{content.schedule.length === 0 && <p className="rounded-xl border border-dashed border-slate-300 p-5 text-sm text-slate-600">El calendario quedará sin actividades cuando publique este borrador. Puede agregar una nueva actividad cuando lo necesite.</p>}{content.schedule.map((activity, index) => <div className="rounded-xl border border-slate-200 p-4" key={index}><div className="mb-3 flex flex-wrap items-center justify-between gap-2"><p className="font-black text-brand-primary">Actividad {index + 1}</p><div className="flex gap-2"><button aria-label={`Subir actividad ${index + 1}`} className="icon-action" disabled={index === 0} onClick={() => moveActivity(index, -1)} type="button"><ArrowUp aria-hidden="true"/></button><button aria-label={`Bajar actividad ${index + 1}`} className="icon-action" disabled={index === content.schedule.length - 1} onClick={() => moveActivity(index, 1)} type="button"><ArrowDown aria-hidden="true"/></button><button aria-label={`Eliminar actividad ${index + 1}`} className="icon-action text-red-700" onClick={() => removeActivity(index)} type="button"><Trash2 aria-hidden="true"/></button></div></div><div className="grid gap-3"><label className="field"><span>Fecha visible</span><input className="control" maxLength="100" onChange={(event) => updateSchedule(index, 'date', event.target.value)} required value={activity.date}/></label><div className="grid gap-3 sm:grid-cols-2"><label className="field"><span>Fecha inicial ISO</span><input className="control" onChange={(event) => updateSchedule(index, 'dateTime', event.target.value)} pattern="[0-9]{4}-[0-9]{2}(-[0-9]{2})?" required value={activity.dateTime}/></label><label className="field"><span>Fecha final ISO (opcional)</span><input className="control" onChange={(event) => updateSchedule(index, 'endDateTime', event.target.value)} pattern="[0-9]{4}-[0-9]{2}(-[0-9]{2})?" value={activity.endDateTime || ''}/></label></div><label className="field"><span>Título</span><input className="control" maxLength="180" onChange={(event) => updateSchedule(index, 'title', event.target.value)} required value={activity.title}/></label><label className="field"><span>Descripción</span><textarea className="control min-h-24" maxLength="700" onChange={(event) => updateSchedule(index, 'description', event.target.value)} required value={activity.description}/></label><label className="flex items-center gap-3 text-sm font-bold"><input checked={Boolean(activity.highlighted)} onChange={(event) => updateSchedule(index, 'highlighted', event.target.checked)} type="checkbox"/>Destacar actividad</label></div></div>)}</fieldset>}
        {selectedKey === 'partners' && activeAction === 'items' && ['collaborators', 'sponsors'].map((collection) => <fieldset className="grid gap-4 border-t border-slate-200 pt-5" key={collection}><legend className="font-black">{collection === 'collaborators' ? 'Instituciones colaboradoras' : 'Patrocinadores'}</legend><div className="flex items-center justify-between gap-3"><p className="text-sm text-slate-600">{content[collection].length} elementos.</p><button className="button" onClick={() => addInstitution(collection)} type="button"><Plus aria-hidden="true"/>Agregar</button></div>{content[collection].map((institution, index) => <div className="rounded-xl border border-slate-200 p-4" key={institution.key}><div className="mb-3 flex items-center justify-between gap-2"><p className="font-black text-brand-primary">Elemento {index + 1}</p><div className="flex gap-2"><button aria-label="Subir" className="icon-action" disabled={index === 0} onClick={() => moveInstitution(collection, index, -1)} type="button"><ArrowUp aria-hidden="true"/></button><button aria-label="Bajar" className="icon-action" disabled={index === content[collection].length - 1} onClick={() => moveInstitution(collection, index, 1)} type="button"><ArrowDown aria-hidden="true"/></button><button aria-label="Eliminar" className="icon-action text-red-700" onClick={() => removeInstitution(collection, index)} type="button"><Trash2 aria-hidden="true"/></button></div></div><div className="grid gap-3"><label className="field"><span>Nombre</span><input className="control" maxLength="180" onChange={(event) => updateInstitution(collection, index, 'name', event.target.value)} required value={institution.name}/></label><label className="field"><span>Sitio web (opcional)</span><input className="control" maxLength="512" onChange={(event) => updateInstitution(collection, index, 'url', event.target.value)} type="url" value={institution.url || ''}/></label>{collection === 'sponsors' && <label className="field"><span>Descripción</span><textarea className="control min-h-24" maxLength="600" onChange={(event) => updateInstitution(collection, index, 'description', event.target.value)} value={institution.description || ''}/></label>}<label className="field"><span>Logotipo (opcional)</span><input accept="image/jpeg,image/png,image/webp" className="control file-control" onChange={(event) => chooseInstitutionLogo(institution.key, event.target.files?.[0] || null)} type="file"/><small>JPEG, PNG o WebP. Recomendado: 600 × 600 píxeles, con el logotipo centrado en un lienzo transparente, sin deformarlo. Si no selecciona uno nuevo, se conserva el logotipo vigente.</small></label></div></div>)}</fieldset>)}
        {selectedKey === 'about' && activeAction === 'texts' && <fieldset className="grid gap-4 border-t border-slate-200 pt-5"><legend className="font-black">Introducción</legend><button className="button justify-self-start" onClick={() => addTextItem('introduction')} type="button"><Plus aria-hidden="true"/>Agregar párrafo</button>{content.introduction.map((paragraph, index) => <div className="flex items-start gap-2" key={index}><textarea className="control min-h-28" maxLength="1200" onChange={(event) => updateTextItem('introduction', index, event.target.value)} required value={paragraph}/><button aria-label={`Eliminar párrafo ${index + 1}`} className="icon-action text-red-700" onClick={() => removeTextItem('introduction', index)} type="button"><Trash2 aria-hidden="true"/></button></div>)}</fieldset>}{selectedKey === 'about' && activeAction === 'items' && <fieldset className="grid gap-4 border-t border-slate-200 pt-5"><legend className="font-black">Hitos de la historia</legend><button className="button justify-self-start" onClick={addMilestone} type="button"><Plus aria-hidden="true"/>Agregar hito</button>{content.milestones.map((milestone, index) => <div className="rounded-xl border border-slate-200 p-4" key={milestone.key}><div className="mb-3 flex justify-between gap-2"><strong>Hito {index + 1}</strong><div className="flex gap-2"><button aria-label="Subir hito" className="icon-action" disabled={index === 0} onClick={() => moveMilestone(index, -1)} type="button"><ArrowUp aria-hidden="true"/></button><button aria-label="Bajar hito" className="icon-action" disabled={index === content.milestones.length - 1} onClick={() => moveMilestone(index, 1)} type="button"><ArrowDown aria-hidden="true"/></button><button aria-label="Eliminar hito" className="icon-action text-red-700" onClick={() => removeMilestone(index)} type="button"><Trash2 aria-hidden="true"/></button></div></div><div className="grid gap-3"><label className="field"><span>Periodo</span><input className="control" maxLength="100" onChange={(event) => updateMilestone(index, 'period', event.target.value)} required value={milestone.period}/></label><label className="field"><span>Título</span><input className="control" maxLength="180" onChange={(event) => updateMilestone(index, 'title', event.target.value)} required value={milestone.title}/></label><label className="field"><span>Descripción</span><textarea className="control min-h-24" maxLength="900" onChange={(event) => updateMilestone(index, 'description', event.target.value)} required value={milestone.description}/></label></div></div>)}</fieldset>}{selectedKey === 'about' && activeAction === 'texts' && <fieldset className="grid gap-4 border-t border-slate-200 pt-5"><legend className="font-black">Párrafos de cierre</legend><button className="button justify-self-start" onClick={() => addTextItem('closing_paragraphs')} type="button"><Plus aria-hidden="true"/>Agregar párrafo</button>{content.closing_paragraphs.map((paragraph, index) => <div className="flex items-start gap-2" key={index}><textarea className="control min-h-28" maxLength="1200" onChange={(event) => updateTextItem('closing_paragraphs', index, event.target.value)} required value={paragraph}/><button aria-label={`Eliminar párrafo de cierre ${index + 1}`} className="icon-action text-red-700" onClick={() => removeTextItem('closing_paragraphs', index)} type="button"><Trash2 aria-hidden="true"/></button></div>)}</fieldset>}
        {selectedKey === 'general-information' && activeAction === 'items' && <fieldset className="grid gap-4 border-t border-slate-200 pt-5"><legend className="font-black">Preguntas frecuentes</legend><button className="button justify-self-start" onClick={addFaq} type="button"><Plus aria-hidden="true"/>Agregar pregunta</button>{content.faqs.map((faq, index) => <div className="rounded-xl border border-slate-200 p-4" key={faq.key}><div className="mb-3 flex justify-between gap-2"><strong>Pregunta {index + 1}</strong><div className="flex gap-2"><button aria-label="Subir pregunta" className="icon-action" disabled={index === 0} onClick={() => moveInstitution('faqs', index, -1)} type="button"><ArrowUp aria-hidden="true"/></button><button aria-label="Bajar pregunta" className="icon-action" disabled={index === content.faqs.length - 1} onClick={() => moveInstitution('faqs', index, 1)} type="button"><ArrowDown aria-hidden="true"/></button><button aria-label="Eliminar pregunta" className="icon-action text-red-700" onClick={() => removeInstitution('faqs', index)} type="button"><Trash2 aria-hidden="true"/></button></div></div><label className="field"><span>Pregunta</span><input className="control" maxLength="300" onChange={(event) => updateInstitution('faqs', index, 'question', event.target.value)} required value={faq.question}/></label><label className="field mt-3"><span>Respuesta</span><textarea className="control min-h-28" maxLength="1200" onChange={(event) => updateInstitution('faqs', index, 'answer', event.target.value)} required value={faq.answer}/></label></div>)}</fieldset>}
        {selectedKey === 'regional-coordinations' && activeAction === 'items' && <fieldset className="grid gap-4 border-t border-slate-200 pt-5"><legend className="font-black">Directorio regional</legend><button className="button justify-self-start" onClick={addRegion} type="button"><Plus aria-hidden="true"/>Agregar región</button>{content.regions.map((region, regionIndex) => <div className="rounded-xl border border-slate-200 p-4" key={regionIndex}><div className="mb-3 flex justify-between gap-2"><strong>Región {regionIndex + 1}</strong><div className="flex gap-2"><button aria-label="Subir región" className="icon-action" disabled={regionIndex === 0} onClick={() => moveInstitution('regions', regionIndex, -1)} type="button"><ArrowUp aria-hidden="true"/></button><button aria-label="Bajar región" className="icon-action" disabled={regionIndex === content.regions.length - 1} onClick={() => moveInstitution('regions', regionIndex, 1)} type="button"><ArrowDown aria-hidden="true"/></button><button aria-label="Eliminar región" className="icon-action text-red-700" onClick={() => removeInstitution('regions', regionIndex)} type="button"><Trash2 aria-hidden="true"/></button></div></div><label className="field"><span>Nombre de la región</span><input className="control" maxLength="180" onChange={(event) => updateRegion(regionIndex, event.target.value)} required value={region.region}/></label><div className="mt-4 grid gap-3"><button className="button justify-self-start" onClick={() => addContact(regionIndex)} type="button"><Plus aria-hidden="true"/>Agregar contacto</button>{region.contacts.map((contact, contactIndex) => { const contactPhotoUrl = contactPhotoPreviewUrls[contact.key] || storedContactPhotoUrls[contact.key] || contact.photo_url; return <div className="rounded-lg bg-slate-50 p-3" key={contact.key}><div className="flex items-start gap-2"><div className="grid flex-1 gap-3"><div className="grid gap-3 sm:grid-cols-[5rem_1fr]"><div className="aspect-[5/7] w-20 overflow-hidden rounded-md border border-slate-300 bg-white">{contactPhotoUrl ? <img alt="" className="h-full w-full object-cover" src={contactPhotoUrl}/> : <span className="flex h-full items-center justify-center text-slate-400"><UserRound aria-hidden="true" size={38}/></span>}</div><div className="grid content-start gap-2"><label className="field"><span>Fotografía del asesor (opcional)</span><input accept="image/jpeg,image/png,image/webp" className="control file-control" onChange={(event) => chooseContactPhoto(contact.key, event.target.files?.[0] || null)} type="file"/><small>JPEG, PNG o WebP, hasta 8 MB. Tamaño recomendado: 500 × 700 píxeles (ancho × alto, formato vertical 5:7). Centra el rostro y deja un margen alrededor. Si no hay fotografía, se mostrará una silueta.</small></label>{contactPhotoUrl && <button className="button justify-self-start" onClick={() => removeContactPhoto(contact.key)} type="button"><X aria-hidden="true"/>Retirar fotografía</button>}</div></div><label className="field"><span>Nombre</span><input className="control" maxLength="180" onChange={(event) => updateContact(regionIndex, contactIndex, 'name', event.target.value)} required value={contact.name}/></label><label className="field"><span>Correos institucionales, uno por línea</span><textarea className="control min-h-20" onChange={(event) => updateContact(regionIndex, contactIndex, 'emails', event.target.value.split(/\r?\n/))} value={contact.emails.join('\n')}/></label></div><div className="flex gap-2"><button aria-label="Subir contacto" className="icon-action" disabled={contactIndex === 0} onClick={() => moveContact(regionIndex, contactIndex, -1)} type="button"><ArrowUp aria-hidden="true"/></button><button aria-label="Bajar contacto" className="icon-action" disabled={contactIndex === region.contacts.length - 1} onClick={() => moveContact(regionIndex, contactIndex, 1)} type="button"><ArrowDown aria-hidden="true"/></button><button aria-label="Eliminar contacto" className="icon-action text-red-700" onClick={() => removeContact(regionIndex, contactIndex)} type="button"><Trash2 aria-hidden="true"/></button></div></div></div> })}</div></div>)}</fieldset>}
        {selectedKey === 'current-edition' && activeAction === 'items' && <fieldset className="grid gap-4 border-t border-slate-200 pt-5">
          <legend className="text-lg font-black text-slate-900">3. Documentos oficiales</legend>
          <p className="text-sm text-slate-600">Los archivos se organizan automáticamente con el año de la edición. El formato, el nombre y la ruta no necesitan edición manual.</p>
          <button className="button justify-self-start" onClick={addEditionResource} type="button"><Plus aria-hidden="true"/>Agregar documento</button>
          {content.resources.length === 0 && <p className="rounded-xl border border-dashed border-slate-300 p-5 text-sm text-slate-600">La edición se publicará sin documentos descargables.</p>}
          {content.resources.map((resource, index) => {
            const documentUrl = editionDocumentPreviewUrls[resource.key] || storedEditionDocumentUrls[resource.key] || resource.href
            const documentName = editionDocumentFiles[resource.key]?.name || resource.file_name
            const documentSize = editionDocumentFiles[resource.key]?.size || resource.file_size
            return <div className="rounded-xl border border-slate-200 p-4" key={resource.key}>
              <div className="mb-3 flex justify-between gap-2"><strong>Documento {index + 1}</strong><div className="flex gap-2"><button aria-label="Subir documento" className="icon-action" disabled={index === 0} onClick={() => moveInstitution('resources', index, -1)} type="button"><ArrowUp aria-hidden="true"/></button><button aria-label="Bajar documento" className="icon-action" disabled={index === content.resources.length - 1} onClick={() => moveInstitution('resources', index, 1)} type="button"><ArrowDown aria-hidden="true"/></button><button aria-label="Eliminar documento" className="icon-action text-red-700" onClick={() => removeInstitution('resources', index)} type="button"><Trash2 aria-hidden="true"/></button></div></div>
              <div className="grid gap-3">
                <label className="field"><span>Título</span><input className="control" maxLength="180" onChange={(event) => updateInstitution('resources', index, 'title', event.target.value)} required value={resource.title}/></label>
                <label className="field"><span>Descripción</span><textarea className="control min-h-24" maxLength="700" onChange={(event) => updateInstitution('resources', index, 'description', event.target.value)} required value={resource.description}/></label>
                <label className="field"><span>{documentName ? 'Reemplazar archivo PDF' : 'Subir archivo PDF'}</span><input accept="application/pdf,.pdf" className="control file-control" onChange={(event) => chooseEditionDocument(resource.key, event.target.files?.[0] || null)} required={!documentUrl} type="file"/><small>PDF de hasta 16 MB. Se conservará el archivo actual si no selecciona otro.</small></label>
                {documentName && <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm"><strong className="block break-all text-slate-900">{documentName}</strong>{documentSize && <span className="mt-1 block text-slate-600">PDF · {formatFileSize(documentSize)}</span>}</div>}
                {documentUrl && <div className="flex flex-wrap gap-2"><a className="icon-action gap-2 px-3" href={documentUrl} rel="noopener noreferrer" target="_blank"><ExternalLink aria-hidden="true"/>Abrir archivo</a><a className="icon-action gap-2 px-3" download={documentName || true} href={documentUrl}><Download aria-hidden="true"/>Descargar PDF</a></div>}
              </div>
            </div>
          })}
        </fieldset>}
        {selectedKey === 'current-edition' && activeAction === 'files' && <>
          <fieldset className="grid gap-4 border-t border-slate-200 pt-5"><legend className="text-lg font-black text-slate-900">4. Plantilla de inscripción masiva</legend><p className="text-sm text-slate-600">Administra la única plantilla XLSX activa para esta edición. Sustituirla o retirarla no altera la versión pública hasta publicar el borrador.</p><label className="field"><span>{bulkTemplateUrl ? 'Sustituir plantilla XLSX' : 'Subir plantilla XLSX'}</span><input accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,.xlsx" className="control file-control" onChange={(event) => chooseBulkTemplate(event.target.files?.[0] || null)} type="file"/><small>Archivo XLSX válido de hasta 16 MB.</small></label>{bulkTemplateUrl ? <div className="grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4"><div><strong className="block break-all text-slate-900">{bulkTemplateName || 'Plantilla vigente'}</strong>{bulkTemplateSize && <span className="mt-1 block text-sm text-slate-600">XLSX · {formatFileSize(bulkTemplateSize)}</span>}</div><div className="flex flex-wrap gap-2"><a className="icon-action gap-2 px-3" download={bulkTemplateName || true} href={bulkTemplateUrl}><Download aria-hidden="true"/>Descargar XLSX</a><button className="icon-action gap-2 px-3 text-red-700" onClick={removeBulkTemplate} type="button"><Trash2 aria-hidden="true"/>Retirar plantilla</button></div></div> : <p className="rounded-lg border border-dashed border-slate-300 p-4 text-sm text-slate-600">No se publicará una plantilla de inscripción masiva.</p>}</fieldset>
          <fieldset className="grid gap-4 border-t border-slate-200 pt-5"><legend className="text-lg font-black text-slate-900">5. Promoción</legend><p className="text-sm text-slate-600">Configura la imagen institucional y el enlace al material audiovisual de la edición.</p>{['image_alt'].map(editionField)}<label className="field"><span>Reemplazar imagen promocional</span><input accept="image/jpeg,image/png,image/webp" className="control file-control" onChange={chooseImage} type="file"/><small>JPEG, PNG o WebP. Recomendado: 740 × 600 píxeles (ancho × alto), en formato horizontal. Sin un archivo nuevo se conserva la imagen vigente.</small></label></fieldset>
        </>}
        {editor.supportsImage && selectedKey !== 'current-edition' && activeAction === 'images' && <label className="field"><span>Reemplazar imagen</span><input accept="image/jpeg,image/png,image/webp" className="control file-control" onChange={chooseImage} type="file"/><small>JPEG, PNG o WebP. Recomendado: 1500 × 500 píxeles (3:1 horizontal), preferiblemente con fondo transparente si es una ilustración. Sin un archivo nuevo se conserva la imagen vigente.</small></label>}
        {editor.supportsManual && activeAction === 'files' && <fieldset className="grid gap-3 border-t border-slate-200 pt-5"><legend className="font-black">Manual de la edición</legend><label className="field"><span>Subir o reemplazar manual</span><input accept="application/pdf,.pdf" className="control file-control" onChange={chooseManual} type="file"/><small>PDF de hasta 16 MB. Sin un archivo nuevo se conserva el manual vigente.</small></label>{manualUrl && <div className="flex flex-wrap gap-2"><a className="icon-action gap-2 px-3" href={manualUrl} rel="noopener noreferrer" target="_blank"><ExternalLink aria-hidden="true"/>Abrir manual</a><a className="icon-action gap-2 px-3" download={manualFile?.name || content.manual_name || true} href={manualUrl}><Download aria-hidden="true"/>Descargar PDF</a></div>}</fieldset>}
        <footer className="editor-modal-actions">{saveError && <p className="notice notice-error w-full" role="alert">{saveError}</p>}<p>{hasLocalChanges ? 'Guarde el borrador para conservar estos cambios.' : section?.draft ? 'Borrador guardado. Puede publicarlo o cerrar el editor.' : 'No hay cambios pendientes.'}</p><div><button className="text-action" onClick={closeEditor} type="button">Cerrar</button><button className="button" disabled={busy || !hasLocalChanges} type="submit"><Save aria-hidden="true"/>Guardar borrador</button><button className="button publish-button" disabled={busy || !section?.draft || hasLocalChanges} onClick={publish} type="button"><Send aria-hidden="true"/>Publicar</button></div></footer>
      </form>
    </section></div>}
  </section>
}
