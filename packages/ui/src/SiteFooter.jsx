import { ExternalLink } from 'lucide-react'

export function SiteFooter({ content, logoUrl = '/logo-olcomep.png', mepLogoUrl = '/logotipo%20MEP.png', preview = false }) {
  return (
    <footer className="bg-slate-950 py-10 text-white">
      <div className="mx-auto grid max-w-content gap-6 px-5 sm:px-8 lg:grid-cols-2 lg:items-start xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,1.1fr)_minmax(0,.7fr)] xl:gap-8">
        <div>
          <div className="inline-flex max-w-full items-center gap-3" aria-hidden="true">
            <img alt="" className="h-11 w-auto sm:h-14" height="79" src={mepLogoUrl} width="288" />
            <span className="h-12 w-px bg-white/25 sm:h-16" />
            <img alt="" className="h-16 w-auto rounded-sm sm:h-20" height="690" src={logoUrl} width="690" />
          </div>
          <p className="mt-4 font-black">{content.program_name}</p>
          <p className="mt-1 text-sm text-slate-300">{content.organization}</p>
        </div>
        <nav className="flex flex-col items-start gap-3 text-sm font-bold lg:order-3 lg:col-start-2 xl:col-start-auto xl:items-end xl:text-right" aria-label="Enlaces institucionales">
          {content.links.map((item) => <a className="inline-flex items-center gap-2 text-slate-200 underline underline-offset-4 hover:text-white" href={item.href} key={item.key} tabIndex={preview ? -1 : undefined} {...(/^https?:\/\//i.test(item.href) ? { rel: 'noopener noreferrer', target: '_blank' } : {})}>{item.label}{/^https?:\/\//i.test(item.href) && <ExternalLink aria-hidden="true" size={16}/>}</a>)}
          {content.links.length === 0 && <span className="text-sm text-slate-300">No hay enlaces institucionales publicados.</span>}
          <a className="text-slate-200 underline underline-offset-4 hover:text-white" href="#contenido-principal" tabIndex={preview ? -1 : undefined}>Volver al inicio</a>
        </nav>
        <div aria-label="Créditos" className="lg:order-2 lg:col-start-2 xl:col-span-2 xl:col-start-auto" role="group">{content.credits.length ? <><div className="grid gap-4 xl:hidden">{content.credits.map((group) => <section key={group.key}><h3 className="font-black">{group.title}</h3>{group.names.map((name, index) => <p className="mt-1 text-sm text-slate-300" key={`${group.key}-${index}`}>{name}</p>)}</section>)}</div><div className="hidden grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] gap-6 xl:grid">{[0, 1].map((column) => <div className="grid content-start gap-4" key={column}>{content.credits.filter((_, index) => index % 2 === column).map((group) => <section key={group.key}><h3 className="font-black">{group.title}</h3>{group.names.map((name, index) => <p className="mt-1 text-sm text-slate-300" key={`${group.key}-${index}`}>{name}</p>)}</section>)}</div>)}</div></> : <p className="text-sm text-slate-300">No hay créditos publicados.</p>}</div>
      </div>
    </footer>
  )
}
