import { createApiClient } from '@olcomep/api-client'
import { ArrowDown, ArrowUp, ImagePlus, LogOut, Save, Trash2 } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { ContentEditor } from './ContentEditor.jsx'
import { UserManagement } from './UserManagement.jsx'

const statusLabel = { draft: 'Borrador', published: 'Publicado', archived: 'Archivado' }

function Notice({ notice }) {
  if (!notice) return null
  return <p className={`notice ${notice.type === 'error' ? 'notice-error' : 'notice-success'}`} role={notice.type === 'error' ? 'alert' : 'status'}>{notice.text}</p>
}

function Field({ label, children }) { return <label className="field"><span>{label}</span>{children}</label> }

export function AdminApp({ account, getAccessToken, onLogout, profile }) {
  const [section, setSection] = useState('carousel')
  const [slides, setSlides] = useState([])
  const [events, setEvents] = useState([])
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [notice, setNotice] = useState(null)
  const [confirmation, setConfirmation] = useState(null)
  const [busy, setBusy] = useState(false)
  const api = useMemo(() => createApiClient({ getToken: getAccessToken }), [getAccessToken])

  const run = useCallback(async (action, success) => {
    setBusy(true); setNotice(null)
    try { const result = await action(); if (success) setNotice({ type: 'success', text: success }); return result }
    catch (error) { setNotice({ type: 'error', text: error.message }); return null }
    finally { setBusy(false) }
  }, [])

  const load = useCallback(async () => {
    const result = await run(() => Promise.all([api.adminCarousel(), api.adminEvents()]))
    if (result) { setSlides(result[0]); setEvents(result[1]) }
  }, [api, run])

  useEffect(() => { load() }, [load])

  const confirmAction = async () => {
    const action = confirmation?.action
    setConfirmation(null)
    if (action) await action()
  }

  const createSlide = async (event) => {
    event.preventDefault(); const form = new FormData(event.currentTarget)
    const result = await run(() => api.createSlide(form), 'Diapositiva guardada.')
    if (result) { event.currentTarget.reset(); await load() }
  }

  const createEvent = async (event) => {
    event.preventDefault(); const data = Object.fromEntries(new FormData(event.currentTarget))
    const result = await run(() => api.createEvent(data), 'Evento creado como borrador.')
    if (result) { event.currentTarget.reset(); await load(); await selectEvent(result.id) }
  }

  const selectEvent = async (id) => {
    const result = await run(() => api.adminEvent(id)); if (result) setSelectedEvent(result)
  }

  const updateEvent = async (event) => {
    event.preventDefault(); const data = Object.fromEntries(new FormData(event.currentTarget))
    const result = await run(() => api.updateEvent(selectedEvent.id, data), 'Evento actualizado.')
    if (result) { setSelectedEvent(result); await load() }
  }

  const uploadPhoto = async (event) => {
    event.preventDefault(); const result = await run(() => api.addEventImage(selectedEvent.id, new FormData(event.currentTarget)), 'Fotografía agregada.')
    if (result) { setSelectedEvent(result); event.currentTarget.reset(); await load() }
  }

  const move = async (collection, index, direction, save) => {
    const target = index + direction; if (target < 0 || target >= collection.length) return
    const reordered = [...collection]; [reordered[index], reordered[target]] = [reordered[target], reordered[index]]
    const result = await run(() => save(reordered.map((item) => item.id)), 'Orden actualizado.')
    if (result) Array.isArray(result) ? setSlides(result) : setSelectedEvent(result)
  }

  return <div className="min-h-screen bg-slate-50 text-slate-900">
    <header className="border-b border-slate-200 bg-brand-primary text-white">
      <div className="mx-auto flex max-w-content flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <div className="flex items-center gap-4">
          <img alt="" className="h-16 w-auto rounded-sm bg-white" height="690" src="/logo-olcomep.png" width="690" />
          <div><p className="text-xs font-black uppercase tracking-[.16em] text-brand-highlight">OLCOMEP</p><h1 className="mt-1 text-2xl font-black">Administración de medios</h1></div>
        </div>
        <span className="text-sm font-bold">Contenido institucional</span>
      </div>
    </header>
    <main className="mx-auto max-w-content px-5 py-8 sm:px-8">
      <section className="session-bar" aria-label="Sesión administrativa"><div><strong>{profile.display_name || account.name || 'Cuenta MEP'}</strong><span>{profile.email} · {profile.role}</span></div><div className="flex flex-wrap gap-2"><button className="text-action" disabled={busy} onClick={load} type="button">Actualizar contenido</button><button className="text-action" onClick={onLogout} type="button"><LogOut aria-hidden="true"/>Cerrar sesión</button></div></section>
      <Notice notice={notice}/>
      {confirmation && <div className="dialog-backdrop" role="presentation"><section aria-describedby="confirm-description" aria-labelledby="confirm-title" aria-modal="true" className="dialog" role="dialog"><h2 id="confirm-title">Confirmar acción</h2><p id="confirm-description">{confirmation.text}</p><div className="mt-5 flex justify-end gap-2"><button className="text-action" onClick={() => setConfirmation(null)} type="button">Cancelar</button><button className="button danger-button" onClick={confirmAction} type="button">Confirmar</button></div></section></div>}
      <nav className="mt-8 flex flex-wrap gap-2 border-b border-slate-300" aria-label="Módulos administrativos"><button aria-current={section === 'content' ? 'page' : undefined} className="tab" onClick={() => setSection('content')} type="button">Contenido del sitio</button><button aria-current={section === 'carousel' ? 'page' : undefined} className="tab" onClick={() => setSection('carousel')} type="button">Carrusel principal</button><button aria-current={section === 'events' ? 'page' : undefined} className="tab" onClick={() => setSection('events')} type="button">Eventos y fotografías</button>{profile.can_manage_users && <button aria-current={section === 'users' ? 'page' : undefined} className="tab" onClick={() => setSection('users')} type="button">Usuarios</button>}</nav>
      {section === 'content' && <ContentEditor api={api} busy={busy} run={run} setConfirmation={setConfirmation}/>}
      {section === 'users' && <UserManagement api={api} busy={busy} profile={profile} run={run}/>}
      {section === 'carousel' ? <section className="py-7" aria-labelledby="carousel-title"><div className="section-heading"><div><h2 id="carousel-title">Carrusel principal</h2><p>Hasta 15 imágenes publicadas, mostradas debajo del encabezado.</p></div></div><form className="panel mt-6 grid gap-4 md:grid-cols-2" onSubmit={createSlide}><Field label="Imagen JPEG, PNG o WebP"><input accept="image/jpeg,image/png,image/webp" className="control file-control" name="image" required type="file"/></Field><Field label="Texto alternativo"><input className="control" maxLength="255" name="alt_text" required/></Field><Field label="Título opcional"><input className="control" maxLength="180" name="title"/></Field><Field label="Estado"><select className="control" name="status"><option value="draft">Borrador</option><option value="published">Publicado</option></select></Field><button className="button md:col-span-2 md:justify-self-start" disabled={busy} type="submit"><ImagePlus aria-hidden="true"/>Agregar diapositiva</button></form><div className="mt-6 grid gap-4">{slides.length === 0 ? <p className="empty">No hay diapositivas registradas.</p> : slides.map((slide, index) => <article className="media-row" key={slide.id}><img alt="" src={slide.media_url}/><div className="min-w-0"><h3>{slide.title || 'Sin título'}</h3><p>{slide.alt_text}</p><span className={`status status-${slide.status}`}>{statusLabel[slide.status]}</span></div><div className="row-actions"><button aria-label="Subir en el orden" className="icon-action" disabled={index === 0 || busy} onClick={() => move(slides, index, -1, api.reorderSlides)} type="button"><ArrowUp/></button><button aria-label="Bajar en el orden" className="icon-action" disabled={index === slides.length - 1 || busy} onClick={() => move(slides, index, 1, api.reorderSlides)} type="button"><ArrowDown/></button><button className="text-action" disabled={busy} onClick={async () => { await run(() => api.updateSlide(slide.id, { status: slide.status === 'published' ? 'draft' : 'published' }), 'Estado actualizado.'); await load() }} type="button">{slide.status === 'published' ? 'Ocultar' : 'Publicar'}</button><button aria-label="Archivar diapositiva" className="icon-action danger" disabled={busy} onClick={async () => { await run(() => api.archiveSlide(slide.id), 'Diapositiva archivada.'); await load() }} type="button"><Trash2/></button></div></article>)}</div></section> :
      <section className="py-7" aria-labelledby="events-title"><div className="section-heading"><div><h2 id="events-title">Eventos y fotografías</h2><p>Cree el evento, cargue sus fotografías y publíquelo cuando esté listo.</p></div></div><form className="panel mt-6 grid gap-4 md:grid-cols-2" onSubmit={createEvent}><Field label="Nombre del evento"><input className="control" name="name" required/></Field><Field label="Fecha"><input className="control" name="event_date" type="date"/></Field><Field label="Descripción"><textarea className="control min-h-24" name="description"/></Field><button className="button self-end justify-self-start" disabled={busy} type="submit"><Save aria-hidden="true"/>Crear evento</button></form><div className="mt-6 grid gap-6 lg:grid-cols-[19rem_1fr]"><div className="panel h-fit"><h3 className="font-black">Eventos registrados</h3><div className="mt-3 grid gap-2">{events.length === 0 ? <p className="text-sm text-slate-600">No hay eventos.</p> : events.map((item) => <button className={`event-choice ${selectedEvent?.id === item.id ? 'event-choice-active' : ''}`} key={item.id} onClick={() => selectEvent(item.id)} type="button"><strong>{item.name}</strong><span>{statusLabel[item.status]}</span></button>)}</div></div>{selectedEvent ? <div className="grid gap-6"><form className="panel grid gap-4 md:grid-cols-2" onSubmit={updateEvent}><Field label="Nombre"><input className="control" defaultValue={selectedEvent.name} name="name" required/></Field><Field label="Fecha"><input className="control" defaultValue={selectedEvent.event_date || ''} name="event_date" type="date"/></Field><Field label="Descripción"><textarea className="control min-h-24" defaultValue={selectedEvent.description || ''} name="description"/></Field><Field label="Estado"><select className="control" defaultValue={selectedEvent.status} name="status"><option value="draft">Borrador</option><option value="published">Publicado</option><option value="archived">Archivado</option></select></Field><button className="button md:col-span-2 md:justify-self-start" disabled={busy} type="submit"><Save aria-hidden="true"/>Guardar evento</button></form><form className="panel grid gap-4 md:grid-cols-2" onSubmit={uploadPhoto}><Field label="Fotografía"><input accept="image/jpeg,image/png,image/webp" className="control file-control" name="image" required type="file"/></Field><Field label="Texto alternativo"><input className="control" name="alt_text" required/></Field><Field label="Pie de foto opcional"><input className="control" name="caption"/></Field><label className="flex min-h-11 items-center gap-2 font-bold"><input name="is_cover" type="checkbox" value="1"/>Usar como portada</label><button className="button md:col-span-2 md:justify-self-start" disabled={busy} type="submit"><ImagePlus aria-hidden="true"/>Cargar fotografía</button></form><div className="grid gap-3">{selectedEvent.images.map((image, index) => <article className="media-row" key={image.id}><img alt="" src={image.media_url}/><div className="min-w-0"><h3>{image.alt_text}</h3><p>{image.caption || 'Sin pie de foto'}</p>{Boolean(Number(image.is_cover)) && <span className="status status-published">Portada</span>}</div><div className="row-actions"><button aria-label="Subir fotografía" className="icon-action" disabled={index === 0 || busy} onClick={() => move(selectedEvent.images, index, -1, (ids) => api.reorderEventImages(selectedEvent.id, ids))} type="button"><ArrowUp/></button><button aria-label="Bajar fotografía" className="icon-action" disabled={index === selectedEvent.images.length - 1 || busy} onClick={() => move(selectedEvent.images, index, 1, (ids) => api.reorderEventImages(selectedEvent.id, ids))} type="button"><ArrowDown/></button><button className="text-action" disabled={busy || Boolean(Number(image.is_cover))} onClick={async () => { const result = await run(() => api.updateEventImage(image.id, { is_cover: true }), 'Portada actualizada.'); if (result) setSelectedEvent(result) }} type="button">Portada</button><button aria-label="Eliminar fotografía" className="icon-action danger" disabled={busy} onClick={async () => { const result = await run(() => api.deleteEventImage(image.id), 'Fotografía retirada.'); if (result) setSelectedEvent(result) }} type="button"><Trash2/></button></div></article>)}</div></div> : <p className="empty">Seleccione un evento para administrarlo.</p>}</div></section>}
    </main>
  </div>
}
