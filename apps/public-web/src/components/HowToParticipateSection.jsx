import { ArrowRight } from 'lucide-react'

export function HowToParticipateSection({ currentEdition, loading }) {
  return <section id="como-participar" aria-labelledby="titulo-como-participar" aria-busy={loading} className="scroll-mt-28 border-b border-line py-16 sm:py-20">
    <div className="mx-auto grid max-w-content gap-8 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
      <div>
        <p className="eyebrow text-brand-primary">Información para participar</p>
        <h2 id="titulo-como-participar" className="section-title mt-3">Cómo participar</h2>
        <p className="mt-5 max-w-xl text-lg leading-8 text-slate-700">OLCOMEP está dirigida a estudiantes de primero a sexto año de Educación Primaria. Consulte el estado de inscripción y los documentos oficiales de la edición vigente.</p>
      </div>
      <div className="self-center border-l-4 border-brand-highlight bg-brand-soft px-6 py-7 sm:px-8">
        {loading ? <p role="status" className="leading-7 text-slate-700">Cargando información de inscripción…</p> : <>
          {currentEdition?.registration_title && <h3 className="text-xl font-black text-brand-primary">{currentEdition.registration_title}</h3>}
          {currentEdition?.registration_description && <p className="mt-3 leading-7 text-slate-700">{currentEdition.registration_description}</p>}
        </>}
        <a className="mt-6 inline-flex min-h-11 items-center gap-2 font-bold text-brand-primary underline decoration-2 underline-offset-4" href="#edicion-vigente">Ver documentos y detalles de la edición <ArrowRight aria-hidden="true" size={18}/></a>
      </div>
    </div>
  </section>
}
