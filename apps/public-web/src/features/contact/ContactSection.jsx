import { ExternalLink, Mail, MessageSquareHeart, Phone, Youtube } from 'lucide-react'

const externalResources = [
  { description: 'Videos y materiales audiovisuales relacionados con las Olimpiadas Matemáticas.', href: 'https://www.youtube.com/channel/UCb1Mihv34LjcEzjicn76Omw', icon: Youtube, label: 'Canal de OLCOMEP en YouTube' },
  { description: 'Comparta su valoración sobre este recurso educativo del MEP.', href: 'https://recursos.mep.go.cr/0_calificame/app/index.html?id_app=15', icon: MessageSquareHeart, label: 'Califique este recurso' },
]

export function ContactSection() {
  return (
    <section id="contacto" className="scroll-mt-28 py-16 sm:py-20" aria-labelledby="titulo-contacto">
      <div className="mx-auto max-w-content px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <p className="eyebrow text-brand-primary">Estamos para orientarle</p>
            <h2 id="titulo-contacto" className="section-title mt-3">Contacto</h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-700">Para consultas sobre OLCOMEP, comuníquese con la Asesoría de Matemáticas de Primero y Segundo Ciclos.</p>
            <address className="mt-8 not-italic">
              <p className="font-black text-slate-900">Yeri Charpentier Díaz</p>
              <p className="mt-1 text-slate-600">Asesora de matemáticas de Primero y Segundo Ciclos</p>
              <ul className="mt-5 space-y-3">
                <li><a className="inline-flex min-h-11 items-center gap-3 font-bold text-brand-primary underline decoration-2 underline-offset-4 hover:text-brand-accent" href="tel:+50622217685"><Phone aria-hidden="true" size={20} /> 2221-7685</a></li>
                <li><a className="inline-flex min-h-11 items-center gap-3 break-all font-bold text-brand-primary underline decoration-2 underline-offset-4 hover:text-brand-accent" href="mailto:primero.segundo.ciclos@mep.go.cr"><Mail aria-hidden="true" size={20} /> primero.segundo.ciclos@mep.go.cr</a></li>
              </ul>
            </address>
          </div>

          <div>
            <h3 className="text-2xl font-black text-slate-900">Otros recursos</h3>
            <ul className="mt-5 divide-y divide-line border-y border-line">
              {externalResources.map(({ description, href, icon: Icon, label }) => (
                <li key={href}>
                  <a className="group grid min-h-28 grid-cols-[auto_1fr_auto] items-center gap-4 py-5" href={href} rel="noopener noreferrer" target="_blank">
                    <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-soft text-brand-primary"><Icon aria-hidden="true" /></span>
                    <span><span className="block font-black text-slate-900 group-hover:text-brand-primary">{label}</span><span className="mt-1 block text-sm leading-6 text-slate-600">{description}</span></span>
                    <ExternalLink aria-hidden="true" className="text-brand-primary" size={20} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <section className="mt-16 border-t border-line pt-10" aria-labelledby="titulo-creditos">
          <p className="eyebrow text-brand-primary">Créditos del sitio original</p>
          <h3 id="titulo-creditos" className="mt-3 text-2xl font-black text-slate-900">Equipo de desarrollo</h3>
          <div className="mt-7 grid gap-8 md:grid-cols-3">
            <div><h4 className="font-black text-slate-900">Asesoría curricular</h4><p className="mt-2 leading-7 text-slate-600">Yeri Charpentier Díaz</p></div>
            <div><h4 className="font-black text-slate-900">Recursos tecnológicos — GESPRO</h4><p className="mt-2 leading-7 text-slate-600">Patricia Hernández Conejo<br />Óscar Pérez Ramírez<br />Luis Chacón Campos</p></div>
            <div><h4 className="font-black text-slate-900">Diseño gráfico</h4><p className="mt-2 leading-7 text-slate-600">Mariana Molina Rojas</p></div>
          </div>
        </section>
      </div>
    </section>
  )
}
