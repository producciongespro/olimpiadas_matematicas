import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles/index.css'

function AdminApp() {
  return (
    <main className="mx-auto max-w-content px-6 py-12">
      <p className="text-sm font-bold uppercase tracking-widest text-brand-primary">OLCOMEP</p>
      <h1 className="mt-3 text-3xl font-bold text-slate-900">Administración</h1>
      <p className="mt-4 max-w-2xl text-slate-600">Base preparada para implementar los módulos administrativos después de definir sus requisitos.</p>
    </main>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode><AdminApp /></React.StrictMode>,
)
