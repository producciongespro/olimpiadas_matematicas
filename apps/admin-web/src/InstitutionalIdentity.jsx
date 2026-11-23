import { useEffect, useState } from 'react'

const KEY = 'institutional-identity'
const logos = [
  { key: 'olcomep', label: 'OLCOMEP', field: 'image', url: 'logo_url', uuid: 'media_uuid', fallback: '/logo-olcomep.png', recommended: '1000 × 1000 píxeles (cuadrado)' },
  { key: 'mep', label: 'MEP', field: 'mep_logo', url: 'mep_logo_url', uuid: 'mep_media_uuid', fallback: '/logotipo%20MEP.png', recommended: '2400 × 720 píxeles (horizontal)' },
]

export function InstitutionalIdentity({ api, onPublished }) {
  const [section, setSection] = useState(null)
  const [loading, setLoading] = useState(true)
  const [files, setFiles] = useState({})
  const [localPreviews, setLocalPreviews] = useState({})
  const [draftPreviews, setDraftPreviews] = useState({})
  const [pending, setPending] = useState(false)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    let active = true
    api.adminSiteSection(KEY).then((result) => { if (active) setSection(result) }).catch((error) => { if (active) setMessage({ error: true, text: error.message }) }).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [api])

  useEffect(() => {
    const urls = Object.fromEntries(logos.filter(({ key }) => files[key]).map(({ key }) => [key, URL.createObjectURL(files[key])]))
    setLocalPreviews(urls)
    return () => Object.values(urls).forEach((url) => URL.revokeObjectURL(url))
  }, [files])

  const draftUuids = logos.map(({ uuid }) => section?.draft?.content?.[uuid] || '').join('|')
  useEffect(() => {
    let active = true
    const urls = []
    setDraftPreviews({})
    for (const { key, uuid } of logos) {
      const value = section?.draft?.content?.[uuid]
      if (!value) continue
      api.adminMediaObjectUrl(value).then((url) => {
        if (!active) { URL.revokeObjectURL(url); return }
        urls.push(url)
        setDraftPreviews((current) => ({ ...current, [key]: url }))
      }).catch(() => {})
    }
    return () => { active = false; urls.forEach((url) => URL.revokeObjectURL(url)) }
  }, [api, draftUuids])

  const save = async () => {
    if (!Object.values(files).some(Boolean)) return
    setPending(true); setMessage(null)
    try {
      const form = new FormData()
      for (const { key, field } of logos) if (files[key]) form.set(field, files[key])
      const result = await api.saveSiteSectionDraft(KEY, form)
      setSection(result); setFiles({})
      setMessage({ error: false, text: 'Borrador guardado. Los logotipos públicos aún no han cambiado.' })
    } catch (error) { setMessage({ error: true, text: error.message }) }
    finally { setPending(false) }
  }

  const hasLocalFiles = Object.values(files).some(Boolean)
  const publish = async () => {
    if (!section?.draft || hasLocalFiles || !window.confirm('¿Publicar la identidad institucional en la vista pública y la administración?')) return
    setPending(true); setMessage(null)
    try {
      const result = await api.publishSiteSection(KEY)
      setSection(result)
      onPublished(result.published.content)
      setMessage({ error: false, text: 'Identidad institucional publicada en todas las vistas.' })
    } catch (error) { setMessage({ error: true, text: error.message }) }
    finally { setPending(false) }
  }

  if (loading) return <p className="empty my-7" role="status">Cargando identidad institucional…</p>
  return <section className="grid gap-5 py-5" aria-labelledby="identity-title">
    <div className="section-heading"><h2 id="identity-title">Logotipos institucionales</h2><p>Puede reemplazar uno o ambos. Los cambios serán visibles al publicar.</p></div>
    {message && <p className={message.error ? 'notice notice-error' : 'notice notice-success'} role={message.error ? 'alert' : 'status'}>{message.text}</p>}
    <div className="grid gap-5 lg:grid-cols-2">{logos.map(({ key, label, url, fallback, recommended }) => <div className="panel grid gap-4" key={key}>
      <h3 className="text-lg font-black">Logotipo {label}</h3>
      <div className="grid gap-3 sm:grid-cols-2"><div><p className="text-sm font-bold">Publicado</p><img alt={`Logotipo ${label} publicado`} className="mt-2 h-28 w-full object-contain" src={section?.published?.content?.[url] || fallback}/></div><div><p className="text-sm font-bold">{files[key] ? 'Vista previa local' : 'Borrador'}</p>{localPreviews[key] || draftPreviews[key] ? <img alt={`Logotipo ${label} en borrador`} className="mt-2 h-28 w-full object-contain" src={localPreviews[key] || draftPreviews[key]}/> : <p className="mt-2 text-sm text-slate-600">Sin reemplazo pendiente.</p>}</div></div>
      <label className="field"><span>Reemplazar logotipo {label}</span><input accept="image/jpeg,image/png,image/webp" className="control file-control" onChange={(event) => setFiles((current) => ({ ...current, [key]: event.target.files?.[0] || null }))} type="file"/><small>Resolución recomendada: {recommended}. JPEG, PNG o WebP, hasta 8 MB; mínimo 256 píxeles por lado.</small></label>
    </div>)}</div>
    <div className="flex flex-wrap gap-3"><button className="button" disabled={!section || !hasLocalFiles || pending} onClick={save} type="button">Guardar borrador</button><button className="button publish-button" disabled={!section?.draft || hasLocalFiles || pending} onClick={publish} type="button">Publicar identidad</button></div>
    {hasLocalFiles && section?.draft && <p className="text-sm text-slate-600">Guarde los archivos seleccionados antes de publicar.</p>}
  </section>
}
