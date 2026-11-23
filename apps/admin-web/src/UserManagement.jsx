import { Save, UserPlus } from 'lucide-react'
import { useEffect, useState } from 'react'

const labels = { master: 'Master', admin: 'Administrador', editor: 'Editor', active: 'Activo', inactive: 'Inactivo' }

export function UserRoleDescriptions({ role }) {
  return <div className="mt-3 grid gap-1 text-sm text-slate-700" aria-label="Funciones de los roles">
    {role === 'master' && <p><strong>Master:</strong> edita contenido y gestiona masters, administradores y editores.</p>}
    <p><strong>Administrador:</strong> edita contenido y gestiona editores.</p>
    <p><strong>Editor:</strong> edita contenido.</p>
  </div>
}

export function UserManagement({ api, busy, profile, run }) {
  const [users, setUsers] = useState([])
  const [changes, setChanges] = useState({})
  const [editingId, setEditingId] = useState(null)
  const load = async () => { const result = await run(() => api.adminUsers()); if (result) setUsers(result) }
  useEffect(() => { load() }, [api])

  const create = async (event) => {
    event.preventDefault(); const form = event.currentTarget; const data = Object.fromEntries(new FormData(form))
    data.email = `${String(data.email).trim()}@mep.go.cr`
    const result = await run(() => api.createAdminUser(data), 'Autorización administrativa creada.')
    if (result) { form.reset(); await load() }
  }
  const update = async (user) => {
    const data = changes[user.id] || { role: user.role, status: user.status }
    if (data.email && data.email !== user.email && user.last_login_at && !window.confirm('Cambiar el correo desvinculará la identidad anterior de Microsoft. La cuenta corregida deberá iniciar sesión de nuevo. ¿Desea continuar?')) return
    const result = await run(() => api.updateAdminUser(user.id, data), 'Autorización actualizada.')
    if (result) { setEditingId(null); setChanges((current) => { const next = { ...current }; delete next[user.id]; return next }); await load() }
  }
  const setValue = (user, field, value) => setChanges((current) => ({ ...current, [user.id]: { role: user.role, status: user.status, ...current[user.id], [field]: value } }))
  const startEditing = (user) => { setEditingId(user.id); setChanges((current) => ({ ...current, [user.id]: { ...current[user.id], display_name: user.display_name || '', email: user.email } })) }
  const cancelEditing = (user) => { setEditingId(null); setChanges((current) => { const next = { ...current }; delete next[user.id]; return next }) }

  return <section className="user-management py-7" aria-labelledby="users-title">
    <div className="section-heading"><div><h2 id="users-title">Usuarios administrativos</h2><p>{profile.role === 'master' ? 'Gestione masters, administradores y editores.' : 'Gestione editores.'}</p><UserRoleDescriptions role={profile.role}/></div></div>
    <form className="panel mt-6 grid gap-4 md:grid-cols-3" onSubmit={create}>
      <label className="field"><span>Correo institucional</span><span className="control flex items-center !p-0 focus-within:border-brand-primary"><input autoCapitalize="none" autoComplete="off" aria-describedby="email-help" className="min-w-0 flex-1 px-3 py-2 outline-none" name="email" pattern="[A-Za-z0-9._%+-]+" placeholder="nombre.apellido.apellido" required title="Escriba solo la parte anterior a @mep.go.cr" type="text"/><span className="pr-3 text-sm font-semibold text-slate-600">@mep.go.cr</span></span></label>
      <label className="field"><span>Nombre de referencia</span><input className="control" maxLength="180" name="display_name"/></label>
      <label className="field"><span>Rol</span><select className="control" name="role">{profile.assignable_roles.map((role) => <option key={role} value={role}>{labels[role]}</option>)}</select></label>
      <small className="text-slate-600 md:col-span-3" id="email-help">Escriba solo la parte anterior a @mep.go.cr.</small>
      <button className="button md:col-span-3 md:justify-self-start" disabled={busy} type="submit"><UserPlus aria-hidden="true"/>Crear autorización</button>
    </form>
    <div className="mt-6 grid gap-3">{users.length === 0 ? <p className="empty">No existen usuarios administrables para este rol.</p> : users.map((user) => {
      const draft = changes[user.id] || user; const own = user.id === profile.id
      const roles = profile.role === 'master' ? profile.assignable_roles : ['editor']
      return <article className="user-row" key={user.id}><div><strong>{user.display_name || user.email}</strong><span>{user.email}</span>{own && <small>Sesión actual</small>}</div><label className="field"><span>Rol</span><select className="control" disabled={own || busy} onChange={(event) => setValue(user, 'role', event.target.value)} value={draft.role}>{roles.map((role) => <option key={role} value={role}>{labels[role]}</option>)}</select></label><label className="field"><span>Estado</span><select className="control" disabled={own || busy} onChange={(event) => setValue(user, 'status', event.target.value)} value={draft.status}><option value="active">{labels.active}</option><option value="inactive">{labels.inactive}</option></select></label><div className="flex flex-wrap gap-2 self-end">{!own && (editingId === user.id ? <button className="text-action" disabled={busy} onClick={() => cancelEditing(user)} type="button">Cancelar</button> : <button className="text-action" disabled={busy} onClick={() => startEditing(user)} type="button">Editar datos</button>)}<button className="text-action" disabled={own || busy || !changes[user.id]} onClick={() => update(user)} type="button"><Save aria-hidden="true"/>Guardar</button></div>{editingId === user.id && <div className="grid gap-3 border-t border-slate-200 pt-4 md:col-span-4 md:grid-cols-2"><label className="field"><span>Nombre de referencia</span><input className="control" maxLength="180" onChange={(event) => setValue(user, 'display_name', event.target.value)} value={draft.display_name ?? ''}/></label><label className="field"><span>Correo institucional</span><span className="control flex items-center !p-0 focus-within:border-brand-primary"><input autoCapitalize="none" className="min-w-0 flex-1 px-3 py-2 outline-none" onChange={(event) => setValue(user, 'email', `${event.target.value}@mep.go.cr`)} pattern="[A-Za-z0-9._%+-]+" type="text" value={String(draft.email || '').replace(/@mep\.go\.cr$/, '')}/><span className="pr-3 text-sm font-semibold text-slate-600">@mep.go.cr</span></span></label><p className="text-sm text-slate-600 md:col-span-2">Al cambiar el correo, la cuenta deberá iniciar sesión de nuevo para vincularse.</p></div>}</article>
    })}</div>
  </section>
}
