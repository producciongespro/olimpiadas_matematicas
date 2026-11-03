import { ChevronDown } from 'lucide-react'

export function GeneralInformationSection({ content }) {
  return <section id="preguntas-frecuentes" className="scroll-mt-28 border-b border-line py-16 sm:py-20" aria-labelledby="titulo-preguntas-frecuentes">
    <div className="mx-auto max-w-content px-5 sm:px-8">
      <div className="grid gap-8 lg:grid-cols-[0.65fr_1.35fr] lg:gap-16"><div>
        <p className="eyebrow text-brand-primary">{content.faq_eyebrow}</p>
        <h2 id="titulo-preguntas-frecuentes" className="section-title mt-3">{content.faq_title}</h2>
      </div><div className="divide-y divide-line border-y border-line">{content.faqs.map(({ answer, key, question }) => <details className="group py-5" key={key}><summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 font-black text-slate-900 marker:hidden">{question}<ChevronDown aria-hidden="true" className="shrink-0 text-brand-primary transition-transform group-open:rotate-180 motion-reduce:transition-none" size={21}/></summary><p className="max-w-3xl pb-2 pr-10 leading-7 text-slate-700">{answer}</p></details>)}{content.faqs.length === 0 && <p className="py-6 text-slate-600">No hay preguntas frecuentes publicadas.</p>}</div></div>
    </div>
  </section>
}
