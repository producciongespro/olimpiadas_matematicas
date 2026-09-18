import { InteractionRequiredAuthError, InteractionStatus } from '@azure/msal-browser'
import { useIsAuthenticated, useMsal } from '@azure/msal-react'
import { LogIn } from 'lucide-react'
import { useCallback } from 'react'
import { useEffect, useState } from 'react'
import { createApiClient } from '@olcomep/api-client'
import { AdminApp } from '../App.jsx'
import { entraConfigurationError, loginRequest } from './msal.js'

function AccessScreen({ error, onLogin, pending }) {
  return <main className="access-screen"><section className="access-card" aria-labelledby="access-title"><img alt="" height="690" src="/logo-olcomep.png" width="690"/><p className="text-xs font-black uppercase tracking-[.16em] text-brand-primary">Administración OLCOMEP</p><h1 id="access-title">Acceso institucional</h1><p>Ingrese con su cuenta del Ministerio de Educación Pública. Solo las identidades con un rol administrativo asignado podrán gestionar contenido.</p>{error && <p className="notice notice-error" role="alert">{error}</p>}<button className="button mt-5 w-full" disabled={pending || Boolean(error)} onClick={onLogin} type="button"><LogIn aria-hidden="true"/>{pending ? 'Procesando acceso…' : 'Ingresar con cuenta MEP'}</button></section></main>
}

export function AuthGate({ initializationError = null }) {
  const { instance, accounts, inProgress } = useMsal()
  const authenticated = useIsAuthenticated()
  const account = instance.getActiveAccount() || accounts[0] || null
  const accountId = account?.homeAccountId || null
  const pending = inProgress !== InteractionStatus.None
  const [profile, setProfile] = useState(null)
  const [profileError, setProfileError] = useState(null)

  const login = async () => {
    if (!entraConfigurationError && !pending) await instance.loginRedirect(loginRequest)
  }
  const logout = async () => {
    if (account) await instance.logoutRedirect({ account, postLogoutRedirectUri: window.location.origin })
  }
  const getAccessToken = useCallback(async () => {
    const tokenAccount = instance.getActiveAccount() || (accountId ? instance.getAccountByHomeId(accountId) : null)
    if (!tokenAccount) throw new Error('No existe una sesión administrativa activa.')
    try {
      return (await instance.acquireTokenSilent({ ...loginRequest, prompt: undefined, account: tokenAccount })).accessToken
    } catch (error) {
      if (error instanceof InteractionRequiredAuthError) {
        await instance.acquireTokenRedirect({ ...loginRequest, prompt: undefined, account: tokenAccount })
      }
      throw error
    }
  }, [accountId, instance])

  useEffect(() => {
    if (!authenticated || !accountId || entraConfigurationError) return
    let active = true
    setProfileError(null)
    createApiClient({ getToken: getAccessToken }).adminProfile()
      .then((result) => { if (active) setProfile(result) })
      .catch((error) => { if (active) setProfileError(error.message) })
    return () => { active = false }
  }, [accountId, authenticated, getAccessToken])

  if (initializationError || entraConfigurationError) return <AccessScreen error={initializationError || entraConfigurationError} pending={false}/>
  if (!authenticated || !account) return <AccessScreen onLogin={login} pending={pending}/>
  if (profileError) return <main className="access-screen"><section className="access-card"><h1>Acceso no autorizado</h1><p>{profileError}</p><button className="button mt-5 w-full" onClick={logout} type="button">Cerrar sesión</button></section></main>
  if (!profile) return <AccessScreen pending={true}/>
  return <AdminApp account={account} getAccessToken={getAccessToken} onLogout={logout} profile={profile}/>
}
