import { defaultHeroContent, mergeHeroContent } from '@olcomep/shared'
import { HeroSection } from '@olcomep/ui'
import { Monitor, Save, Send, Smartphone } from 'lucide-react'
import { useEffect, useState } from 'react'

const fields = [
  ['eyebrow', 'Antetítulo', 80], ['title', 'Título principal', 120], ['audience', 'Población participante', 100],
  ['description', 'Descripción', 420], ['primary_label', 'Texto del botón principal', 60], ['primary_href', 'Destino del botón principal', 512],
  ['secondary_label', 'Texto del botón secundario', 60], ['secondary_href', 'Destino del botón secundario', 512], ['image_alt', 'Texto alternativo de la imagen', 255],
]
const publicSiteUrl = (import.meta.env.VITE_PUBLIC_SITE_URL || 'http://localhost:5173').replace(/\/$/, '')

export function ContentEditor({ api, busy, run, setConfirmation }) {
  const [section, setSection] = useState(null)
  const [content, setContent] = useState(defaultHeroContent)
  const [image, setImage] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [viewport, setViewport] = useState('desktop')

  const applySection = (next) => {
    setSection(next); setContent(mergeHeroContent(next?.draft?.content || next?.published?.content)); setImage(null); setPreviewUrl(null)
  }
  useEffect(() => { let active = true; run(() => api.adminSiteSection('hero')).then((result) => { if (active && result) applySection(result) }); return () => { active = false } }, [api, run])
  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl) }, [previewUrl])

  const chooseImage = (event) => {
    const file = event.target.files?.[0] || null
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setImage(file); setPreviewUrl(file ? URL.createObjectURL(file) : null)
  }
  const save = async (event) => {
    event.preventDefault(); const form = new FormData()
    fields.forEach(([field]) => form.set(field, content[field] || ''))
    if (image) form.set('image', image)
    const result = await run(() => api.saveSiteSectionDraft('hero', form), 'Borrador de la portada guardado.')
    if (result) applySection(result)
  }
  const publish = () => setConfirmation({ text: 'La portada pública será sustituida por el borrador completo. La versión anterior permanecerá en el historial.', action: async () => { const result = await run(() => api.publishSiteSection('hero'), 'Portada publicada correctamente.'); if (result) applySection(result) } })
  const storedImageUrl = content.image_url?.startsWith('/') ? `${publicSiteUrl}${content.image_url}` : content.image_url
  const previewContent = { ...content, image_url: previewUrl || storedImageUrl }

  return <section className="content-editor py-7" aria-labelledby="content-title">
    <div className="section-heading"><div><h2 id="content-title">Contenido del sitio</h2><p>Edite el borrador y compruebe el resultado con el mismo componente de la vista pública.</p></div></div>
    <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(22rem,0.75fr)_minmax(0,1.25fr)]">
      <form className="panel grid content-start gap-4" onSubmit={save}>
        <div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-black">Portada principal</h3><p className="mt-1 text-sm text-slate-600">Versión 1 del esquema</p></div><span className={`status ${section?.draft ? 'status-draft' : 'status-published'}`}>{section?.draft ? 'Borrador pendiente' : 'Publicado'}</span></div>
        {fields.map(([field, label, maxLength]) => <label className="field" key={field}><span>{label}</span>{field === 'description' ? <textarea className="control min-h-28" maxLength={maxLength} onChange={(event) => setContent((value) => ({ ...value, [field]: event.target.value }))} required value={content[field]}/> : <input className="control" maxLength={maxLength} onChange={(event) => setContent((value) => ({ ...value, [field]: event.target.value }))} required value={content[field]}/>}</label>)}
        <label className="field"><span>Reemplazar imagen</span><input accept="image/jpeg,image/png,image/webp" className="control file-control" onChange={chooseImage} type="file"/><small>Se almacenará en la API. Sin un archivo nuevo se conserva la imagen vigente.</small></label>
        <div className="flex flex-wrap gap-3 pt-2"><button className="button" disabled={busy} type="submit"><Save aria-hidden="true"/>Guardar borrador</button><button className="button publish-button" disabled={busy || !section?.draft} onClick={publish} type="button"><Send aria-hidden="true"/>Publicar</button></div>
      </form>
      <div className="min-w-0"><div className="mb-3 flex items-center justify-between gap-3"><h3 className="font-black">Vista previa del borrador</h3><div className="flex gap-2" aria-label="Tamaño de la vista previa"><button aria-label="Vista móvil" aria-pressed={viewport === 'mobile'} className="icon-action" onClick={() => setViewport('mobile')} type="button"><Smartphone aria-hidden="true"/></button><button aria-label="Vista de escritorio" aria-pressed={viewport === 'desktop'} className="icon-action" onClick={() => setViewport('desktop')} type="button"><Monitor aria-hidden="true"/></button></div></div><div className={`site-preview ${viewport === 'mobile' ? 'site-preview-mobile' : ''}`}><div className="site-preview-canvas"><HeroSection content={previewContent}/></div></div></div>
    </div>
  </section>
}
