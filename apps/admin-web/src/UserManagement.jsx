import { Save, UserPlus } from 'lucide-react'
import { useEffect, useState } from 'react'

const labels = { master: 'Master', admin: 'Administrador', editor: 'Editor', active: 'Activo', inactive: 'Inactivo' }

export function UserManagement({ api, busy, profile, run }) {
  const [users, setUsers] = useState([])
  const [changes, setChanges] = useState({})
  const load = async () => { const result = await run(() => api.adminUsers()); if (result) setUsers(result) }
  useEffect(() => { load() }, [api])

  const create = async (event) => {
    event.preventDefault(); const form = event.currentTarget; const data = Object.fromEntries(new FormData(form))
    const result = await run(() => api.createAdminUser(data), 'Autorización administrativa creada.')
    if (result) { form.reset(); await load() }
  }
  const update = async (user) => {
    const data = changes[user.id] || { role: user.role, status: user.status }
    const result = await run(() => api.updateAdminUser(user.id, data), 'Autorización actualizada.')
    if (result) { setChanges((current) => { const next = { ...current }; delete next[user.id]; return next }); await load() }
  }
  const setValue = (user, field, value) => setChanges((current) => ({ ...current, [user.id]: { role: user.role, status: user.status, ...current[user.id], [field]: value } }))

  return <section className="user-management py-7" aria-labelledby="users-title">
    <div className="section-heading"><div><h2 id="users-title">Usuarios administrativos</h2><p>{profile.role === 'master' ? 'Gestione Masters, Administradores y Editores.' : 'Gestione las autorizaciones del equipo Editor.'}</p></div></div>
    <form className="panel mt-6 grid gap-4 md:grid-cols-3" onSubmit={create}>
      <label className="field"><span>Correo institucional</span><input className="control" name="email" placeholder="persona@mep.go.cr" required type="email"/></label>
      <label className="field"><span>Nombre de referencia</span><input className="control" maxLength="180" name="display_name"/></label>
      <label className="field"><span>Rol</span><select className="control" name="role">{profile.assignable_roles.map((role) => <option key={role} value={role}>{labels[role]}</option>)}</select></label>
      <button className="button md:col-span-3 md:justify-self-start" disabled={busy} type="submit"><UserPlus aria-hidden="true"/>Crear autorización</button>
    </form>
    <div className="mt-6 grid gap-3">{users.length === 0 ? <p className="empty">No existen usuarios administrables para este rol.</p> : users.map((user) => {
      const draft = changes[user.id] || user; const own = user.id === profile.id
      const roles = profile.role === 'master' ? profile.assignable_roles : ['editor']
      return <article className="user-row" key={user.id}><div><strong>{user.display_name || user.email}</strong><span>{user.email}</span>{own && <small>Sesión actual</small>}</div><label className="field"><span>Rol</span><select className="control" disabled={own || busy} onChange={(event) => setValue(user, 'role', event.target.value)} value={draft.role}>{roles.map((role) => <option key={role} value={role}>{labels[role]}</option>)}</select></label><label className="field"><span>Estado</span><select className="control" disabled={own || busy} onChange={(event) => setValue(user, 'status', event.target.value)} value={draft.status}><option value="active">{labels.active}</option><option value="inactive">{labels.inactive}</option></select></label><button className="text-action self-end" disabled={own || busy || !changes[user.id]} onClick={() => update(user)} type="button"><Save aria-hidden="true"/>Guardar</button></article>
    })}</div>
  </section>
}
