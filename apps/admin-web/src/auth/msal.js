import { PublicClientApplication } from '@azure/msal-browser'

const clientId = import.meta.env.VITE_ENTRA_CLIENT_ID?.trim() || ''
const tenantId = import.meta.env.VITE_ENTRA_TENANT_ID?.trim() || ''
const apiScope = import.meta.env.VITE_ENTRA_API_SCOPE?.trim() || ''

const guidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const apiScopePattern = /^api:\/\/([0-9a-f-]{36})\/([a-z0-9._-]+)$/i
const scopeMatch = apiScope.match(apiScopePattern)
const hasValidConfiguration = guidPattern.test(clientId)
  && guidPattern.test(tenantId)
  && scopeMatch
  && guidPattern.test(scopeMatch[1])

export const entraConfigurationError = !hasValidConfiguration
  ? 'Falta configurar identificadores válidos para la SPA, el tenant y el scope de la API de Microsoft Entra ID.'
  : null

export const loginRequest = { scopes: hasValidConfiguration ? [apiScope] : [], prompt: 'select_account' }

export const msalInstance = new PublicClientApplication({
  auth: {
    clientId: hasValidConfiguration ? clientId : '00000000-0000-0000-0000-000000000000',
    authority: `https://login.microsoftonline.com/${hasValidConfiguration ? tenantId : 'organizations'}`,
    redirectUri: import.meta.env.VITE_ENTRA_REDIRECT_URI || window.location.origin,
    postLogoutRedirectUri: window.location.origin,
    navigateToLoginRequestUrl: false,
  },
  cache: { cacheLocation: 'sessionStorage', storeAuthStateInCookie: false },
})
