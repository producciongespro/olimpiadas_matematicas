import React from 'react'
import ReactDOM from 'react-dom/client'
import { MsalProvider } from '@azure/msal-react'
import './styles/index.css'
import { AuthGate } from './auth/AuthGate.jsx'
import { msalInstance } from './auth/msal.js'

function describeInitializationError(error) {
  const code = error?.errorCode || error?.code || error?.name || 'unknown_error'
  console.error('No fue posible inicializar Microsoft Entra ID.', {
    code,
    name: error?.name || 'Error',
  })
  return `No fue posible inicializar el acceso con Microsoft. Código: ${code}.`
}

async function renderApplication() {
  let initializationError = null
  try {
    await msalInstance.initialize()
    const redirectResult = await msalInstance.handleRedirectPromise()
    if (redirectResult?.account) msalInstance.setActiveAccount(redirectResult.account)
    if (!msalInstance.getActiveAccount()) {
      const accounts = msalInstance.getAllAccounts()
      if (accounts.length > 0) msalInstance.setActiveAccount(accounts[0])
    }
  } catch (error) {
    initializationError = describeInitializationError(error)
  }

  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode><MsalProvider instance={msalInstance}><AuthGate initializationError={initializationError}/></MsalProvider></React.StrictMode>,
  )
}

renderApplication()
