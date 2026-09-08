import { Menu, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const navigation = [
  { href: '#olimpiadas', label: 'Conoce OLCOMEP' },
  { href: '#edicion-vigente', label: 'Edición 2026' },
  { href: '#cuadernillos', label: 'Practica por nivel' },
  { href: '#interactivos', label: 'Interactivos' },
  { href: '#galeria', label: 'Galería' },
  { href: '#contacto', label: 'Contacto' },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const menuButtonRef = useRef(null)

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === 'Escape' && open) {
        setOpen(false)
        menuButtonRef.current?.focus()
      }
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [open])

  return (
    <header className="sticky top-0 z-50 border-b border-white/15 bg-brand-primary text-white shadow-header">
      <div className="mx-auto flex min-h-20 max-w-content items-center justify-between gap-6 px-5 sm:px-8">
        <a className="flex shrink-0 items-center gap-3 rounded-sm" href="#contenido-principal" aria-label="OLCOMEP, inicio">
          <img alt="" className="header-logo w-auto" height="79" src="/logotipo%20MEP.png" width="288" />
          <span className="hidden border-l border-white/35 pl-3 text-sm font-bold uppercase leading-tight tracking-[0.14em] sm:block">Matemática<br />para Primaria</span>
        </a>

        <button
          aria-controls="navegacion-principal"
          aria-expanded={open}
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-white/40 hover:bg-white/10 xl:hidden"
          onClick={() => setOpen((value) => !value)}
          ref={menuButtonRef}
          type="button"
        >
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          <span className="sr-only">{open ? 'Cerrar menú' : 'Abrir menú'}</span>
        </button>

        <nav
          aria-label="Navegación principal"
          className={`${open ? 'flex' : 'hidden'} absolute left-0 right-0 top-full flex-col border-t border-white/20 bg-brand-primary px-5 py-4 shadow-lg xl:static xl:flex xl:flex-row xl:items-center xl:border-0 xl:p-0 xl:shadow-none`}
          id="navegacion-principal"
        >
          {navigation.map((item) => (
            <a className="rounded-md px-4 py-3 text-sm font-bold uppercase tracking-[0.08em] text-white/90 hover:bg-white/10 hover:text-white" href={item.href} key={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}
