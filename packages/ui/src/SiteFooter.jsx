import { ExternalLink } from 'lucide-react'

export function SiteFooter({ content, preview = false }) {
  return (
    <footer className="bg-slate-950 py-10 text-white">
      <div className="mx-auto grid max-w-content gap-8 px-5 sm:px-8 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <div className="inline-flex max-w-full items-center gap-3" aria-hidden="true">
            <img alt="" className="h-11 w-auto sm:h-14" height="79" src="/logotipo%20MEP.png" width="288" />
            <span className="h-12 w-px bg-white/25 sm:h-16" />
            <img alt="" className="h-16 w-auto rounded-sm sm:h-20" height="690" src="/logo-olcomep.png" width="690" />
          </div>
          <p className="mt-4 font-black">{content.program_name}</p>
          <p className="mt-1 text-sm text-slate-300">{content.organization}</p>
        </div>
        <nav className="flex flex-col items-start gap-3 text-sm font-bold md:items-end" aria-label="Enlaces institucionales">
          {content.links.map((item) => <a className="inline-flex items-center gap-2 text-slate-200 underline underline-offset-4 hover:text-white" href={item.href} key={item.key} tabIndex={preview ? -1 : undefined} {...(/^https?:\/\//i.test(item.href) ? { rel: 'noopener noreferrer', target: '_blank' } : {})}>{item.label}{/^https?:\/\//i.test(item.href) && <ExternalLink aria-hidden="true" size={16}/>}</a>)}
          {content.links.length === 0 && <span className="text-sm text-slate-300">No hay enlaces institucionales publicados.</span>}
          <a className="text-slate-200 underline underline-offset-4 hover:text-white" href="#contenido-principal" tabIndex={preview ? -1 : undefined}>Volver al inicio</a>
        </nav>
      </div>
      <div className="mx-auto mt-10 max-w-content border-t border-white/20 px-5 pt-8 sm:px-8"><h2 className="text-xl font-black">Créditos</h2>{content.credits.length ? <div className="mt-5 grid gap-6 md:grid-cols-3">{content.credits.map((group) => <section key={group.key}><h3 className="font-black">{group.title}</h3>{group.names.map((name, index) => <p className="mt-1 text-sm text-slate-300" key={`${group.key}-${index}`}>{name}</p>)}</section>)}</div> : <p className="mt-3 text-sm text-slate-300">No hay créditos publicados.</p>}</div>
    </footer>
  )
}
