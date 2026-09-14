import React from 'react'
import ReactDOM from 'react-dom/client'
import { MsalProvider } from '@azure/msal-react'
import './styles/index.css'
import { AuthGate } from './auth/AuthGate.jsx'
import { msalInstance } from './auth/msal.js'

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
  } catch {
    initializationError = 'No fue posible inicializar el acceso con Microsoft. Revise la configuración e inténtelo nuevamente.'
  }

  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode><MsalProvider instance={msalInstance}><AuthGate initializationError={initializationError}/></MsalProvider></React.StrictMode>,
  )
}

renderApplication()
