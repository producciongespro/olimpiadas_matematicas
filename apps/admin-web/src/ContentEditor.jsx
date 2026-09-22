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
  mergeHeroContent,
  mergeGeneralInformationContent,
  mergeCalendarContent,
  mergeContactContent,
  mergeAboutContent,
  mergeOlcomepIntroductionContent,
  mergePartnersContent,
  mergeRegionalCoordinationsContent,
  mergeCurrentEditionContent,
} from '@olcomep/shared'
import { AboutUsSection, CalendarSection, ContactSection, CurrentEditionSection, GeneralInformationSection, HeroSection, OlcomepIntroductionSection, PartnersSection, RegionalCoordinationSection } from '@olcomep/ui'
import { ArrowDown, ArrowUp, Download, ExternalLink, Monitor, Plus, Save, Send, Smartphone, Trash2, UserRound, X } from 'lucide-react'
import { useEffect, useState } from 'react'

const editors = {
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
    fields: [['eyebrow', 'Antetítulo', 80], ['title', 'Título', 120], ['description', 'Descripción', 500, true], ['faq_eyebrow', 'Antetítulo de preguntas', 80], ['faq_title', 'Título de preguntas', 160]],
    preview: (content) => <GeneralInformationSection content={content}/>,
    publishMessage: 'La sección pública “Información general” será sustituida por el borrador completo.',
    successMessage: '“Información general” publicada correctamente.',
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
      ['eyebrow', 'Antetítulo', 80], ['title', 'Título', 160], ['description', 'Descripción', 600, true],
      ['registration_title', 'Título del estado de inscripción', 180], ['registration_description', 'Descripción del estado', 600, true], ['registration_label', 'Texto del enlace histórico', 120], ['registration_href', 'Destino del enlace histórico', 512],
      ['bulk_eyebrow', 'Antetítulo de inscripción masiva', 80], ['bulk_title', 'Título de inscripción masiva', 180], ['bulk_description', 'Descripción de inscripción masiva', 600, true], ['bulk_label', 'Texto de descarga', 120], ['bulk_href', 'Destino de descarga', 512],
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

export function ContentEditor({ api, busy, run, setConfirmation }) {
  const [sections, setSections] = useState([])
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
  const [viewport, setViewport] = useState('desktop')

  const section = sections.find(({ key }) => key === selectedKey) || null
  const editor = editors[selectedKey] || editors.hero

  const applySection = (next) => {
    const nextEditor = editors[next?.key] || editors.hero
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
  }

  useEffect(() => {
    let active = true
    run(() => api.adminSiteSections()).then((result) => {
      if (!active || !result) return
      const editable = result.filter(({ key }) => editors[key])
      setSections(editable)
      applySection(editable.find(({ key }) => key === 'hero') || editable[0])
    })
    return () => { active = false }
  }, [api, run])

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

  const selectSection = (key) => {
    setSelectedKey(key)
    applySection(sections.find((item) => item.key === key))
  }
  const updateSection = (next, preserveContactPreviews = false) => {
    setSections((current) => current.map((item) => item.key === next.key ? next : item))
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
  const addInformationRoute = () => setContent((current) => ({ ...current, routes: [...current.routes, { key: `ruta-${Date.now()}-${Math.floor(Math.random() * 10000)}`, title: '', description: '', href: '#informacion-general', label: '', icon: 'help', external: false }] }))
  const addFaq = () => setContent((current) => ({ ...current, faqs: [...current.faqs, { key: `pregunta-${Date.now()}-${Math.floor(Math.random() * 10000)}`, question: '', answer: '' }] }))
  const addEditionResource = () => setContent((current) => ({ ...current, resources: [...current.resources, { key: `documento-${Date.now()}-${Math.floor(Math.random() * 10000)}`, title: '', description: '', format: 'PDF', href: '/', icon: 'file' }] }))
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
      form.set('routes_json', JSON.stringify(content.routes))
      form.set('faqs_json', JSON.stringify(content.faqs))
    }
    if (selectedKey === 'regional-coordinations') {
      form.set('regions_json', JSON.stringify(content.regions))
      Object.entries(contactPhotoFiles).forEach(([key, file]) => { if (file) form.set(`photo_${key}`, file) })
    }
    if (selectedKey === 'current-edition') form.set('resources_json', JSON.stringify(content.resources))
    if (selectedKey === 'contact') {
      form.set('phones_json', JSON.stringify(content.phones.filter(Boolean)))
      form.set('emails_json', JSON.stringify(content.emails.filter(Boolean)))
      form.set('resources_json', JSON.stringify(content.resources))
    }
    if (image) form.set('image', image)
    const result = await run(() => api.saveSiteSectionDraft(selectedKey, form), `Borrador de “${section?.label || selectedKey}” guardado.`)
    if (result) updateSection(result, selectedKey === 'regional-coordinations')
  }
  const publish = () => setConfirmation({
    text: `${editor.publishMessage} La versión anterior permanecerá en el historial.`,
    action: async () => {
      const result = await run(() => api.publishSiteSection(selectedKey), editor.successMessage)
      if (result) updateSection(result)
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

  return <section className="content-editor py-7" aria-labelledby="content-title">
    <div className="section-heading"><div><h2 id="content-title">Contenido del sitio</h2><p>Edite cada sección y compruebe el resultado con el mismo componente de la vista pública.</p></div></div>
    <div className="mt-5 flex flex-wrap gap-2" role="tablist" aria-label="Secciones editables">
      {sections.map((item) => <button aria-selected={selectedKey === item.key} className={`button ${selectedKey === item.key ? 'publish-button' : ''}`} key={item.key} onClick={() => selectSection(item.key)} role="tab" type="button">{item.label}</button>)}
    </div>
    <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(22rem,0.75fr)_minmax(0,1.25fr)]">
      <form className="panel grid content-start gap-4" onSubmit={save}>
        <div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-black">{section?.label || 'Contenido'}</h3><p className="mt-1 text-sm text-slate-600">Versión {section?.schema_version || 1} del esquema</p></div><span className={`status ${section?.draft ? 'status-draft' : 'status-published'}`}>{section?.draft ? 'Borrador pendiente' : 'Publicado'}</span></div>
        {editor.fields.map(([field, label, maxLength, multiline]) => <label className="field" key={field}><span>{label}</span>{multiline ? <textarea className="control min-h-28" maxLength={maxLength} onChange={(event) => setContent((value) => ({ ...value, [field]: event.target.value }))} required value={content[field]}/> : <input className="control" maxLength={maxLength} onChange={(event) => setContent((value) => ({ ...value, [field]: event.target.value }))} required value={content[field]}/>}</label>)}
        {selectedKey === 'contact' && <><label className="field"><span>Teléfonos, uno por línea</span><textarea className="control min-h-24" onChange={(event) => setContent((current) => ({ ...current, phones: event.target.value.split(/\r?\n/) }))} value={content.phones.join('\n')}/></label><label className="field"><span>Correos, uno por línea</span><textarea className="control min-h-24" onChange={(event) => setContent((current) => ({ ...current, emails: event.target.value.split(/\r?\n/) }))} value={content.emails.join('\n')}/></label><fieldset className="grid gap-4 border-t border-slate-200 pt-5"><legend className="font-black">Recursos adicionales</legend><button className="button justify-self-start" onClick={() => setContent((current) => ({ ...current, resources: [...current.resources, { key: `recurso-${Date.now()}`, title: '', description: '', href: '/' }] }))} type="button"><Plus aria-hidden="true"/>Agregar recurso</button>{content.resources.map((resource, index) => <div className="rounded-xl border border-slate-200 p-4" key={resource.key}><button aria-label="Eliminar recurso" className="icon-action float-right text-red-700" onClick={() => removeInstitution('resources', index)} type="button"><Trash2 aria-hidden="true"/></button><label className="field"><span>Título</span><input className="control" onChange={(event) => updateInstitution('resources', index, 'title', event.target.value)} required value={resource.title}/></label><label className="field mt-3"><span>Descripción</span><textarea className="control" onChange={(event) => updateInstitution('resources', index, 'description', event.target.value)} required value={resource.description}/></label><label className="field mt-3"><span>Destino</span><input className="control" onChange={(event) => updateInstitution('resources', index, 'href', event.target.value)} required value={resource.href}/></label></div>)}</fieldset></>}
        {selectedKey === 'calendar' && <fieldset className="grid gap-4 border-t border-slate-200 pt-5"><legend className="font-black">Actividades del cronograma</legend><div className="flex items-center justify-between gap-3"><p className="text-sm text-slate-600">{content.schedule.length} actividades en este borrador.</p><button className="button" onClick={addActivity} type="button"><Plus aria-hidden="true"/>Agregar actividad</button></div>{content.schedule.length === 0 && <p className="rounded-xl border border-dashed border-slate-300 p-5 text-sm text-slate-600">El calendario quedará sin actividades cuando publique este borrador. Puede agregar una nueva actividad cuando lo necesite.</p>}{content.schedule.map((activity, index) => <div className="rounded-xl border border-slate-200 p-4" key={index}><div className="mb-3 flex flex-wrap items-center justify-between gap-2"><p className="font-black text-brand-primary">Actividad {index + 1}</p><div className="flex gap-2"><button aria-label={`Subir actividad ${index + 1}`} className="icon-action" disabled={index === 0} onClick={() => moveActivity(index, -1)} type="button"><ArrowUp aria-hidden="true"/></button><button aria-label={`Bajar actividad ${index + 1}`} className="icon-action" disabled={index === content.schedule.length - 1} onClick={() => moveActivity(index, 1)} type="button"><ArrowDown aria-hidden="true"/></button><button aria-label={`Eliminar actividad ${index + 1}`} className="icon-action text-red-700" onClick={() => removeActivity(index)} type="button"><Trash2 aria-hidden="true"/></button></div></div><div className="grid gap-3"><label className="field"><span>Fecha visible</span><input className="control" maxLength="100" onChange={(event) => updateSchedule(index, 'date', event.target.value)} required value={activity.date}/></label><div className="grid gap-3 sm:grid-cols-2"><label className="field"><span>Fecha inicial ISO</span><input className="control" onChange={(event) => updateSchedule(index, 'dateTime', event.target.value)} pattern="[0-9]{4}-[0-9]{2}(-[0-9]{2})?" required value={activity.dateTime}/></label><label className="field"><span>Fecha final ISO (opcional)</span><input className="control" onChange={(event) => updateSchedule(index, 'endDateTime', event.target.value)} pattern="[0-9]{4}-[0-9]{2}(-[0-9]{2})?" value={activity.endDateTime || ''}/></label></div><label className="field"><span>Título</span><input className="control" maxLength="180" onChange={(event) => updateSchedule(index, 'title', event.target.value)} required value={activity.title}/></label><label className="field"><span>Descripción</span><textarea className="control min-h-24" maxLength="700" onChange={(event) => updateSchedule(index, 'description', event.target.value)} required value={activity.description}/></label><label className="flex items-center gap-3 text-sm font-bold"><input checked={Boolean(activity.highlighted)} onChange={(event) => updateSchedule(index, 'highlighted', event.target.checked)} type="checkbox"/>Destacar actividad</label></div></div>)}</fieldset>}
        {selectedKey === 'partners' && ['collaborators', 'sponsors'].map((collection) => <fieldset className="grid gap-4 border-t border-slate-200 pt-5" key={collection}><legend className="font-black">{collection === 'collaborators' ? 'Instituciones colaboradoras' : 'Patrocinadores'}</legend><div className="flex items-center justify-between gap-3"><p className="text-sm text-slate-600">{content[collection].length} elementos.</p><button className="button" onClick={() => addInstitution(collection)} type="button"><Plus aria-hidden="true"/>Agregar</button></div>{content[collection].map((institution, index) => <div className="rounded-xl border border-slate-200 p-4" key={institution.key}><div className="mb-3 flex items-center justify-between gap-2"><p className="font-black text-brand-primary">Elemento {index + 1}</p><div className="flex gap-2"><button aria-label="Subir" className="icon-action" disabled={index === 0} onClick={() => moveInstitution(collection, index, -1)} type="button"><ArrowUp aria-hidden="true"/></button><button aria-label="Bajar" className="icon-action" disabled={index === content[collection].length - 1} onClick={() => moveInstitution(collection, index, 1)} type="button"><ArrowDown aria-hidden="true"/></button><button aria-label="Eliminar" className="icon-action text-red-700" onClick={() => removeInstitution(collection, index)} type="button"><Trash2 aria-hidden="true"/></button></div></div><div className="grid gap-3"><label className="field"><span>Nombre</span><input className="control" maxLength="180" onChange={(event) => updateInstitution(collection, index, 'name', event.target.value)} required value={institution.name}/></label><label className="field"><span>Sitio web (opcional)</span><input className="control" maxLength="512" onChange={(event) => updateInstitution(collection, index, 'url', event.target.value)} type="url" value={institution.url || ''}/></label>{collection === 'sponsors' && <label className="field"><span>Descripción</span><textarea className="control min-h-24" maxLength="600" onChange={(event) => updateInstitution(collection, index, 'description', event.target.value)} value={institution.description || ''}/></label>}<label className="field"><span>Logotipo (opcional)</span><input accept="image/jpeg,image/png,image/webp" className="control file-control" onChange={(event) => chooseInstitutionLogo(institution.key, event.target.files?.[0] || null)} type="file"/><small>Si no selecciona uno nuevo, se conserva el logotipo vigente.</small></label></div></div>)}</fieldset>)}
        {selectedKey === 'about' && <><fieldset className="grid gap-4 border-t border-slate-200 pt-5"><legend className="font-black">Introducción</legend><button className="button justify-self-start" onClick={() => addTextItem('introduction')} type="button"><Plus aria-hidden="true"/>Agregar párrafo</button>{content.introduction.map((paragraph, index) => <div className="flex items-start gap-2" key={index}><textarea className="control min-h-28" maxLength="1200" onChange={(event) => updateTextItem('introduction', index, event.target.value)} required value={paragraph}/><button aria-label={`Eliminar párrafo ${index + 1}`} className="icon-action text-red-700" onClick={() => removeTextItem('introduction', index)} type="button"><Trash2 aria-hidden="true"/></button></div>)}</fieldset><fieldset className="grid gap-4 border-t border-slate-200 pt-5"><legend className="font-black">Cronología</legend><button className="button justify-self-start" onClick={addMilestone} type="button"><Plus aria-hidden="true"/>Agregar hito</button>{content.milestones.map((milestone, index) => <div className="rounded-xl border border-slate-200 p-4" key={milestone.key}><div className="mb-3 flex justify-between gap-2"><strong>Hito {index + 1}</strong><div className="flex gap-2"><button aria-label="Subir hito" className="icon-action" disabled={index === 0} onClick={() => moveMilestone(index, -1)} type="button"><ArrowUp aria-hidden="true"/></button><button aria-label="Bajar hito" className="icon-action" disabled={index === content.milestones.length - 1} onClick={() => moveMilestone(index, 1)} type="button"><ArrowDown aria-hidden="true"/></button><button aria-label="Eliminar hito" className="icon-action text-red-700" onClick={() => removeMilestone(index)} type="button"><Trash2 aria-hidden="true"/></button></div></div><div className="grid gap-3"><label className="field"><span>Periodo</span><input className="control" maxLength="100" onChange={(event) => updateMilestone(index, 'period', event.target.value)} required value={milestone.period}/></label><label className="field"><span>Título</span><input className="control" maxLength="180" onChange={(event) => updateMilestone(index, 'title', event.target.value)} required value={milestone.title}/></label><label className="field"><span>Descripción</span><textarea className="control min-h-24" maxLength="900" onChange={(event) => updateMilestone(index, 'description', event.target.value)} required value={milestone.description}/></label></div></div>)}</fieldset><fieldset className="grid gap-4 border-t border-slate-200 pt-5"><legend className="font-black">Párrafos de cierre</legend><button className="button justify-self-start" onClick={() => addTextItem('closing_paragraphs')} type="button"><Plus aria-hidden="true"/>Agregar párrafo</button>{content.closing_paragraphs.map((paragraph, index) => <div className="flex items-start gap-2" key={index}><textarea className="control min-h-28" maxLength="1200" onChange={(event) => updateTextItem('closing_paragraphs', index, event.target.value)} required value={paragraph}/><button aria-label={`Eliminar párrafo de cierre ${index + 1}`} className="icon-action text-red-700" onClick={() => removeTextItem('closing_paragraphs', index)} type="button"><Trash2 aria-hidden="true"/></button></div>)}</fieldset></>}
        {selectedKey === 'general-information' && <><fieldset className="grid gap-4 border-t border-slate-200 pt-5"><legend className="font-black">Rutas informativas</legend><button className="button justify-self-start" onClick={addInformationRoute} type="button"><Plus aria-hidden="true"/>Agregar ruta</button>{content.routes.map((route, index) => <div className="rounded-xl border border-slate-200 p-4" key={route.key}><div className="mb-3 flex justify-between gap-2"><strong>Ruta {index + 1}</strong><div className="flex gap-2"><button aria-label="Subir ruta" className="icon-action" disabled={index === 0} onClick={() => moveInstitution('routes', index, -1)} type="button"><ArrowUp aria-hidden="true"/></button><button aria-label="Bajar ruta" className="icon-action" disabled={index === content.routes.length - 1} onClick={() => moveInstitution('routes', index, 1)} type="button"><ArrowDown aria-hidden="true"/></button><button aria-label="Eliminar ruta" className="icon-action text-red-700" onClick={() => removeInstitution('routes', index)} type="button"><Trash2 aria-hidden="true"/></button></div></div><div className="grid gap-3"><label className="field"><span>Título</span><input className="control" maxLength="180" onChange={(event) => updateInstitution('routes', index, 'title', event.target.value)} required value={route.title}/></label><label className="field"><span>Descripción</span><textarea className="control min-h-24" maxLength="700" onChange={(event) => updateInstitution('routes', index, 'description', event.target.value)} required value={route.description}/></label><label className="field"><span>Texto accesible del enlace</span><input className="control" maxLength="255" onChange={(event) => updateInstitution('routes', index, 'label', event.target.value)} required value={route.label}/></label><label className="field"><span>Destino</span><input className="control" maxLength="512" onChange={(event) => updateInstitution('routes', index, 'href', event.target.value)} required value={route.href}/></label><label className="field"><span>Icono</span><select className="control" onChange={(event) => updateInstitution('routes', index, 'icon', event.target.value)} value={route.icon}><option value="file">Documento</option><option value="users">Participantes</option><option value="calendar">Calendario</option><option value="help">Ayuda</option></select></label><label className="flex items-center gap-3 text-sm font-bold"><input checked={Boolean(route.external)} onChange={(event) => updateInstitution('routes', index, 'external', event.target.checked)} type="checkbox"/>Abrir en una pestaña nueva</label></div></div>)}</fieldset><fieldset className="grid gap-4 border-t border-slate-200 pt-5"><legend className="font-black">Preguntas frecuentes</legend><button className="button justify-self-start" onClick={addFaq} type="button"><Plus aria-hidden="true"/>Agregar pregunta</button>{content.faqs.map((faq, index) => <div className="rounded-xl border border-slate-200 p-4" key={faq.key}><div className="mb-3 flex justify-between gap-2"><strong>Pregunta {index + 1}</strong><div className="flex gap-2"><button aria-label="Subir pregunta" className="icon-action" disabled={index === 0} onClick={() => moveInstitution('faqs', index, -1)} type="button"><ArrowUp aria-hidden="true"/></button><button aria-label="Bajar pregunta" className="icon-action" disabled={index === content.faqs.length - 1} onClick={() => moveInstitution('faqs', index, 1)} type="button"><ArrowDown aria-hidden="true"/></button><button aria-label="Eliminar pregunta" className="icon-action text-red-700" onClick={() => removeInstitution('faqs', index)} type="button"><Trash2 aria-hidden="true"/></button></div></div><label className="field"><span>Pregunta</span><input className="control" maxLength="300" onChange={(event) => updateInstitution('faqs', index, 'question', event.target.value)} required value={faq.question}/></label><label className="field mt-3"><span>Respuesta</span><textarea className="control min-h-28" maxLength="1200" onChange={(event) => updateInstitution('faqs', index, 'answer', event.target.value)} required value={faq.answer}/></label></div>)}</fieldset></>}
        {selectedKey === 'regional-coordinations' && <fieldset className="grid gap-4 border-t border-slate-200 pt-5"><legend className="font-black">Directorio regional</legend><button className="button justify-self-start" onClick={addRegion} type="button"><Plus aria-hidden="true"/>Agregar región</button>{content.regions.map((region, regionIndex) => <div className="rounded-xl border border-slate-200 p-4" key={regionIndex}><div className="mb-3 flex justify-between gap-2"><strong>Región {regionIndex + 1}</strong><div className="flex gap-2"><button aria-label="Subir región" className="icon-action" disabled={regionIndex === 0} onClick={() => moveInstitution('regions', regionIndex, -1)} type="button"><ArrowUp aria-hidden="true"/></button><button aria-label="Bajar región" className="icon-action" disabled={regionIndex === content.regions.length - 1} onClick={() => moveInstitution('regions', regionIndex, 1)} type="button"><ArrowDown aria-hidden="true"/></button><button aria-label="Eliminar región" className="icon-action text-red-700" onClick={() => removeInstitution('regions', regionIndex)} type="button"><Trash2 aria-hidden="true"/></button></div></div><label className="field"><span>Nombre de la región</span><input className="control" maxLength="180" onChange={(event) => updateRegion(regionIndex, event.target.value)} required value={region.region}/></label><div className="mt-4 grid gap-3"><button className="button justify-self-start" onClick={() => addContact(regionIndex)} type="button"><Plus aria-hidden="true"/>Agregar contacto</button>{region.contacts.map((contact, contactIndex) => { const contactPhotoUrl = contactPhotoPreviewUrls[contact.key] || storedContactPhotoUrls[contact.key] || contact.photo_url; return <div className="rounded-lg bg-slate-50 p-3" key={contact.key}><div className="flex items-start gap-2"><div className="grid flex-1 gap-3"><div className="grid gap-3 sm:grid-cols-[5rem_1fr]"><div className="aspect-[5/7] w-20 overflow-hidden rounded-md border border-slate-300 bg-white">{contactPhotoUrl ? <img alt="" className="h-full w-full object-cover" src={contactPhotoUrl}/> : <span className="flex h-full items-center justify-center text-slate-400"><UserRound aria-hidden="true" size={38}/></span>}</div><div className="grid content-start gap-2"><label className="field"><span>Fotografía del asesor (opcional)</span><input accept="image/jpeg,image/png,image/webp" className="control file-control" onChange={(event) => chooseContactPhoto(contact.key, event.target.files?.[0] || null)} type="file"/><small>JPEG, PNG o WebP. Si no hay fotografía se mostrará una silueta.</small></label>{contactPhotoUrl && <button className="button justify-self-start" onClick={() => removeContactPhoto(contact.key)} type="button"><X aria-hidden="true"/>Retirar fotografía</button>}</div></div><label className="field"><span>Nombre</span><input className="control" maxLength="180" onChange={(event) => updateContact(regionIndex, contactIndex, 'name', event.target.value)} required value={contact.name}/></label><label className="field"><span>Correos institucionales, uno por línea</span><textarea className="control min-h-20" onChange={(event) => updateContact(regionIndex, contactIndex, 'emails', event.target.value.split(/\r?\n/))} value={contact.emails.join('\n')}/></label></div><div className="flex gap-2"><button aria-label="Subir contacto" className="icon-action" disabled={contactIndex === 0} onClick={() => moveContact(regionIndex, contactIndex, -1)} type="button"><ArrowUp aria-hidden="true"/></button><button aria-label="Bajar contacto" className="icon-action" disabled={contactIndex === region.contacts.length - 1} onClick={() => moveContact(regionIndex, contactIndex, 1)} type="button"><ArrowDown aria-hidden="true"/></button><button aria-label="Eliminar contacto" className="icon-action text-red-700" onClick={() => removeContact(regionIndex, contactIndex)} type="button"><Trash2 aria-hidden="true"/></button></div></div></div> })}</div></div>)}</fieldset>}
        {selectedKey === 'current-edition' && <fieldset className="grid gap-4 border-t border-slate-200 pt-5"><legend className="font-black">Documentos oficiales</legend><button className="button justify-self-start" onClick={addEditionResource} type="button"><Plus aria-hidden="true"/>Agregar documento</button>{content.resources.length === 0 && <p className="rounded-xl border border-dashed border-slate-300 p-5 text-sm text-slate-600">La edición se publicará sin documentos descargables.</p>}{content.resources.map((resource, index) => <div className="rounded-xl border border-slate-200 p-4" key={resource.key}><div className="mb-3 flex justify-between gap-2"><strong>Documento {index + 1}</strong><div className="flex gap-2"><button aria-label="Subir documento" className="icon-action" disabled={index === 0} onClick={() => moveInstitution('resources', index, -1)} type="button"><ArrowUp aria-hidden="true"/></button><button aria-label="Bajar documento" className="icon-action" disabled={index === content.resources.length - 1} onClick={() => moveInstitution('resources', index, 1)} type="button"><ArrowDown aria-hidden="true"/></button><button aria-label="Eliminar documento" className="icon-action text-red-700" onClick={() => removeInstitution('resources', index)} type="button"><Trash2 aria-hidden="true"/></button></div></div><div className="grid gap-3"><label className="field"><span>Título</span><input className="control" maxLength="180" onChange={(event) => updateInstitution('resources', index, 'title', event.target.value)} required value={resource.title}/></label><label className="field"><span>Descripción</span><textarea className="control min-h-24" maxLength="700" onChange={(event) => updateInstitution('resources', index, 'description', event.target.value)} required value={resource.description}/></label><div className="grid gap-3 sm:grid-cols-2"><label className="field"><span>Formato</span><input className="control" maxLength="100" onChange={(event) => updateInstitution('resources', index, 'format', event.target.value)} required value={resource.format}/></label><label className="field"><span>Icono</span><select className="control" onChange={(event) => updateInstitution('resources', index, 'icon', event.target.value)} value={resource.icon}><option value="file">Documento</option><option value="archive">Archivo comprimido</option><option value="spreadsheet">Hoja de cálculo</option></select></label></div><label className="field"><span>Destino</span><input className="control" maxLength="512" onChange={(event) => updateInstitution('resources', index, 'href', event.target.value)} required value={resource.href}/></label></div></div>)}</fieldset>}
        {editor.supportsImage && <label className="field"><span>Reemplazar imagen</span><input accept="image/jpeg,image/png,image/webp" className="control file-control" onChange={chooseImage} type="file"/><small>Se almacenará en la API. Sin un archivo nuevo se conserva la imagen vigente.</small></label>}
        {editor.supportsManual && <fieldset className="grid gap-3 border-t border-slate-200 pt-5"><legend className="font-black">Manual de la edición</legend><label className="field"><span>Subir o reemplazar manual</span><input accept="application/pdf,.pdf" className="control file-control" onChange={chooseManual} type="file"/><small>PDF de hasta 16 MB. Sin un archivo nuevo se conserva el manual vigente.</small></label>{manualUrl && <div className="flex flex-wrap gap-2"><a className="icon-action gap-2 px-3" href={manualUrl} rel="noopener noreferrer" target="_blank"><ExternalLink aria-hidden="true"/>Abrir manual</a><a className="icon-action gap-2 px-3" download={manualFile?.name || content.manual_name || true} href={manualUrl}><Download aria-hidden="true"/>Descargar PDF</a></div>}</fieldset>}
        <div className="flex flex-wrap gap-3 pt-2"><button className="button" disabled={busy || !section} type="submit"><Save aria-hidden="true"/>Guardar borrador</button><button className="button publish-button" disabled={busy || !section?.draft} onClick={publish} type="button"><Send aria-hidden="true"/>Publicar</button></div>
      </form>
      <div className="min-w-0"><div className="mb-3 flex items-center justify-between gap-3"><h3 className="font-black">Vista previa del borrador</h3><div className="flex gap-2" aria-label="Tamaño de la vista previa"><button aria-label="Vista móvil" aria-pressed={viewport === 'mobile'} className="icon-action" onClick={() => setViewport('mobile')} type="button"><Smartphone aria-hidden="true"/></button><button aria-label="Vista de escritorio" aria-pressed={viewport === 'desktop'} className="icon-action" onClick={() => setViewport('desktop')} type="button"><Monitor aria-hidden="true"/></button></div></div><div className={`site-preview ${viewport === 'mobile' ? 'site-preview-mobile' : ''}`}><div className="site-preview-canvas">{editor.preview(previewContent)}</div></div></div>
    </div>
  </section>
}
