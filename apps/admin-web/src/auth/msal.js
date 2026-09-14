import { PublicClientApplication } from '@azure/msal-browser'

const clientId = import.meta.env.VITE_ENTRA_CLIENT_ID?.trim() || ''
const tenantId = import.meta.env.VITE_ENTRA_TENANT_ID?.trim() || ''
const apiScope = import.meta.env.VITE_ENTRA_API_SCOPE?.trim() || ''

export const entraConfigurationError = !clientId || !tenantId || !apiScope
  ? 'Falta configurar VITE_ENTRA_CLIENT_ID, VITE_ENTRA_TENANT_ID o VITE_ENTRA_API_SCOPE.'
  : null

export const loginRequest = { scopes: apiScope ? [apiScope] : [], prompt: 'select_account' }

export const msalInstance = new PublicClientApplication({
  auth: {
    clientId: clientId || '00000000-0000-0000-0000-000000000000',
    authority: `https://login.microsoftonline.com/${tenantId || 'organizations'}`,
    redirectUri: import.meta.env.VITE_ENTRA_REDIRECT_URI || window.location.origin,
    postLogoutRedirectUri: window.location.origin,
    navigateToLoginRequestUrl: false,
  },
  cache: { cacheLocation: 'sessionStorage', storeAuthStateInCookie: false },
})
