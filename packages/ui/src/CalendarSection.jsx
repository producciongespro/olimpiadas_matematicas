import { CalendarDays, Download, ExternalLink } from 'lucide-react'

function ScheduleDate({ date, dateTime, endDateTime }) {
  if (!endDateTime) return <time dateTime={dateTime}>{date}</time>
  const [startLabel, endLabel] = date.split(' al ')
  return <><time dateTime={dateTime}>{startLabel}</time>{' al '}<time dateTime={endDateTime}>{endLabel}</time></>
}

export function CalendarSection({ content }) {
  const downloadHref = content.manual_href.includes('?') ? `${content.manual_href}&download=1` : `${content.manual_href}?download=1`
  return (
    <section id="calendario" className="scroll-mt-28 border-b border-line bg-slate-50 py-16 sm:py-20" aria-labelledby="titulo-calendario">
      <div className="mx-auto max-w-content px-5 sm:px-8">
        <div className="grid gap-8 border-b border-line pb-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
          <div><p className="eyebrow text-brand-primary">{content.eyebrow}</p><h2 id="titulo-calendario" className="section-title mt-3">{content.title}</h2></div>
          <div><p className="max-w-3xl text-lg leading-8 text-slate-700">{content.description}</p><p className="mt-3 leading-7 text-slate-600">{content.notice}</p></div>
        </div>
        <ol className="relative mt-10 grid gap-0 lg:grid-cols-2 lg:gap-x-12" aria-label={`Cronograma ${content.eyebrow}`}>
          {content.schedule.map(({ date, dateTime, description, endDateTime, highlighted, title }, index) => (
            <li className={`relative grid grid-cols-[4rem_1fr] gap-4 border-t border-line py-6 sm:grid-cols-[7.5rem_1fr] ${highlighted ? 'bg-brand-highlight/10' : ''}`} key={`${dateTime}-${title}-${index}`}>
              <span className="pl-3 text-xs font-black tabular-nums text-brand-primary/60 sm:pl-4">{String(index + 1).padStart(2, '0')}</span>
              <div className="pr-3 sm:pr-5"><p className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.06em] text-brand-primary"><CalendarDays aria-hidden="true" size={18}/><ScheduleDate date={date} dateTime={dateTime} endDateTime={endDateTime}/></p><h3 className="mt-2 text-xl font-black leading-tight text-slate-900">{title}</h3><p className="mt-2 leading-7 text-slate-600">{description}</p></div>
            </li>
          ))}
        </ol>
        {content.schedule.length === 0 && <p className="mt-10 border-y border-line py-8 text-center text-slate-600">No hay actividades publicadas en este momento.</p>}
        <div className="mt-10 flex flex-col gap-4 border-l-4 border-brand-highlight bg-white px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-3xl leading-7 text-slate-700">{content.footer}</p>
          <div className="flex shrink-0 flex-wrap gap-2 self-start"><a className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-brand-primary px-5 py-3 font-bold text-white hover:bg-brand-primary/90" href={content.manual_href} rel="noopener noreferrer" target="_blank">{content.manual_label} <ExternalLink aria-hidden="true" size={18}/></a><a className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-brand-primary px-5 py-3 font-bold text-brand-primary hover:bg-brand-soft" download={content.manual_name || true} href={downloadHref}>Descargar PDF <Download aria-hidden="true" size={18}/></a></div>
        </div>
      </div>
    </section>
  )
}
