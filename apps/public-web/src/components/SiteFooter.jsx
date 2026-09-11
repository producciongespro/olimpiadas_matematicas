import { ExternalLink } from 'lucide-react'

export function SiteFooter() {
  return (
    <footer className="bg-slate-950 py-10 text-white">
      <div className="mx-auto grid max-w-content gap-8 px-5 sm:px-8 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <div className="inline-flex max-w-full items-center gap-3" aria-hidden="true">
            <img alt="" className="h-11 w-auto sm:h-14" height="79" src="/logotipo%20MEP.png" width="288" />
            <span className="h-12 w-px bg-white/25 sm:h-16" />
            <img alt="" className="h-16 w-auto rounded-sm sm:h-20" height="690" src="/logo-olcomep.png" width="690" />
          </div>
          <p className="mt-4 font-black">Olimpiadas Matemáticas OLCOMEP</p>
          <p className="mt-1 text-sm text-slate-300">Ministerio de Educación Pública de Costa Rica</p>
        </div>
        <nav className="flex flex-col items-start gap-3 text-sm font-bold md:items-end" aria-label="Enlaces institucionales">
          <a className="inline-flex items-center gap-2 text-slate-200 underline underline-offset-4 hover:text-white" href="https://www.mep.go.cr/" rel="noopener noreferrer" target="_blank">Sitio oficial del MEP <ExternalLink aria-hidden="true" size={16} /></a>
          <a className="inline-flex items-center gap-2 text-slate-200 underline underline-offset-4 hover:text-white" href="https://recursos.mep.go.cr/creditos_gespro/" rel="noopener noreferrer" target="_blank">Conozca GESPRO <ExternalLink aria-hidden="true" size={16} /></a>
          <a className="text-slate-200 underline underline-offset-4 hover:text-white" href="#contenido-principal">Volver al inicio</a>
        </nav>
      </div>
    </footer>
  )
}
