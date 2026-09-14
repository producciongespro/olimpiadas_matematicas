export function HeroSection({ content }) {
  return (
    <section className="overflow-hidden bg-brand-primary text-white" aria-labelledby="titulo-principal">
      <div className="mx-auto grid max-w-content grid-cols-[minmax(0,1fr)] items-end gap-10 px-5 pb-0 pt-12 sm:px-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:pt-16">
        <div className="min-w-0 pb-12 lg:pb-16">
          <p className="eyebrow text-brand-highlight">{content.eyebrow}</p>
          <h1 id="titulo-principal" className="mt-4 max-w-3xl text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">{content.title}</h1>
          <p className="mt-5 inline-flex rounded-full border border-white/35 px-4 py-2 text-sm font-black uppercase tracking-[0.08em] text-white">{content.audience}</p>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/90">{content.description}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a className="button-primary" href={content.primary_href}>{content.primary_label}</a>
            <a className="button-secondary" href={content.secondary_href}>{content.secondary_label}</a>
          </div>
        </div>
        <img alt={content.image_alt} className="mx-auto min-w-0 max-w-full self-end" height={content.image_height} src={content.image_url} width={content.image_width} />
      </div>
    </section>
  )
}
