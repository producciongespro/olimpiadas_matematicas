import { ChevronDown, Menu, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const informationDestinations = [
  { key: 'reglamento', label: 'Reglamento' },
  { key: 'participar', label: 'Cómo participar', href: '#edicion-vigente' },
  { key: 'calendario', label: 'Calendario', href: '#calendario' },
  { key: 'preguntas', label: 'Preguntas frecuentes', href: '#preguntas-frecuentes' },
]

export function SiteHeader({ content, currentEdition, preview = false }) {
  const [open, setOpen] = useState(false)
  const [informationOpen, setInformationOpen] = useState(false)
  const headerRef = useRef(null)
  const menuButtonRef = useRef(null)
  const informationButtonRef = useRef(null)
  const editionYear = Number(currentEdition?.edition_year)
  const editionLabel = Number.isInteger(editionYear) && editionYear >= 2000 && editionYear <= 2100
    ? `Edición ${editionYear}`
    : 'Edición vigente'
  const regulation = currentEdition?.resources?.find((resource) => /^reglamento(?:-|$)/i.test(resource.key || '') || /reglamento/i.test(resource.title || ''))

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key !== 'Escape') return
      if (informationOpen) {
        setInformationOpen(false)
        informationButtonRef.current?.focus()
      } else if (open) {
        setOpen(false)
        menuButtonRef.current?.focus()
      }
    }
    const closeOutside = (event) => {
      if (!headerRef.current?.contains(event.target)) {
        setInformationOpen(false)
        setOpen(false)
      }
    }
    window.addEventListener('keydown', closeOnEscape)
    window.addEventListener('pointerdown', closeOutside)
    return () => {
      window.removeEventListener('keydown', closeOnEscape)
      window.removeEventListener('pointerdown', closeOutside)
    }
  }, [informationOpen, open])

  const closeNavigation = () => {
    setInformationOpen(false)
    setOpen(false)
  }

  return <header ref={headerRef} className={`${preview ? '' : 'sticky top-0 z-50'} border-b border-white/15 bg-brand-primary text-white shadow-header`}>
    <div className="mx-auto flex min-h-20 max-w-[1500px] items-center justify-between gap-6 px-5 sm:px-8">
      <a className="flex shrink-0 items-center gap-2 rounded-sm sm:gap-3" href="#contenido-principal" aria-label={content.home_label} tabIndex={preview ? -1 : undefined} onClick={closeNavigation}>
        <img alt="" className="header-logo w-auto" height="79" src="/logotipo%20MEP.png" width="288" />
        <img alt="" className="header-olcomep-logo w-auto" height="690" src="/logo-olcomep.png" width="690" />
        <span className="hidden max-w-40 border-l border-white/35 pl-3 text-sm font-bold uppercase leading-tight tracking-[0.14em] sm:block">{content.slogan}</span>
      </a>

      <button aria-controls="navegacion-principal" aria-expanded={open} className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-white/40 hover:bg-white/10 2xl:hidden" disabled={preview} onClick={() => { setOpen((value) => !value); setInformationOpen(false) }} ref={menuButtonRef} type="button">
        {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        <span className="sr-only">{open ? 'Cerrar menú' : 'Abrir menú'}</span>
      </button>

      <nav aria-label="Navegación principal" className={`${open ? 'flex' : 'hidden'} absolute left-0 right-0 top-full max-h-[calc(100vh-5rem)] flex-col overflow-y-auto border-t border-white/20 bg-brand-primary px-5 py-4 shadow-lg 2xl:static 2xl:flex 2xl:max-h-none 2xl:flex-row 2xl:items-center 2xl:overflow-visible 2xl:border-0 2xl:p-0 2xl:shadow-none`} id="navegacion-principal">
        {content.links.filter((item) => item.key !== 'calendario' && item.href !== '#calendario').map((item) => item.key === 'informacion' ? <div className="relative" key={item.key}>
          <button aria-controls="submenu-informacion" aria-expanded={informationOpen} className="flex min-h-11 w-full items-center justify-between gap-2 rounded-md px-4 py-3 text-left text-sm font-bold uppercase tracking-[0.08em] text-white/90 hover:bg-white/10 hover:text-white 2xl:w-auto" disabled={preview} onClick={() => setInformationOpen((value) => !value)} ref={informationButtonRef} type="button">
            {item.label}<ChevronDown aria-hidden="true" className={`shrink-0 transition-transform motion-reduce:transition-none ${informationOpen ? 'rotate-180' : ''}`} size={17}/>
          </button>
          <nav aria-label="Submenú de Información" className={`${informationOpen ? 'flex' : 'hidden'} ml-4 flex-col border-l border-white/25 pl-3 2xl:absolute 2xl:left-0 2xl:top-full 2xl:z-50 2xl:ml-0 2xl:min-w-64 2xl:rounded-b-lg 2xl:border 2xl:border-white/20 2xl:bg-brand-primary 2xl:p-2 2xl:shadow-lg`} id="submenu-informacion">
            {informationDestinations.map((destination) => {
              const href = destination.key === 'reglamento' ? regulation?.href : destination.href
              return href ? <a className="flex min-h-11 items-center rounded-md px-4 py-2 text-sm font-bold text-white/90 hover:bg-white/10 hover:text-white" href={href} key={destination.key} onClick={closeNavigation} tabIndex={preview ? -1 : undefined} {...(destination.key === 'reglamento' ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{destination.label}</a> : <span className="flex min-h-11 items-center px-4 py-2 text-sm text-white/60" key={destination.key}>Reglamento no disponible</span>
            })}
          </nav>
        </div> : <a className="flex min-h-11 items-center rounded-md px-4 py-3 text-sm font-bold uppercase tracking-[0.08em] text-white/90 hover:bg-white/10 hover:text-white" href={item.href} key={item.key} onClick={closeNavigation} tabIndex={preview ? -1 : undefined} {...(/^https?:\/\//i.test(item.href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{item.key === 'edicion' ? editionLabel : item.label}</a>)}
        {content.links.length === 0 && <span className="px-4 py-3 text-sm">No hay enlaces de navegación publicados.</span>}
      </nav>
    </div>
  </header>
}
