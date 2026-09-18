export function OlcomepIntroductionSection({ content }) {
  return (
    <section id="olimpiadas" className="scroll-mt-28 border-t border-line py-16 sm:py-20" aria-labelledby="sobre-olcomep">
      <div className="mx-auto grid max-w-content gap-10 px-5 sm:px-8 lg:grid-cols-[0.7fr_1.3fr]">
        <div>
          <img alt="" className="mb-7 h-auto w-36 sm:w-44 lg:w-48" height="690" loading="lazy" src="/logo-olcomep.png" width="690" />
          <p className="eyebrow text-brand-primary">{content.eyebrow}</p>
          <h2 id="sobre-olcomep" className="section-title mt-3">{content.title}</h2>
        </div>
        <div className="max-w-3xl text-lg leading-8 text-slate-700">
          <p>{content.first_paragraph}</p>
          <p className="mt-5">{content.second_paragraph}</p>
        </div>
      </div>
    </section>
  )
}
