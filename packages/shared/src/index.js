export const defaultHeroContent = Object.freeze({
  eyebrow: 'OLCOMEP · Costa Rica',
  title: 'Olimpiada de Matemática para Primaria',
  audience: 'Para estudiantes de 1.º a 6.º año',
  description: 'Imaginar, resolver y crecer mediante una competencia sana que impulsa el talento y la resolución de problemas en estudiantes de Educación Primaria de todo el país.',
  primary_label: 'Ver edición 2026',
  primary_href: '#edicion-vigente',
  secondary_label: 'Conocer OLCOMEP',
  secondary_href: '#olimpiadas',
  image_alt: 'Niñas y niños que representan a la comunidad estudiantil de OLCOMEP',
  image_url: '/assets/legacy/brand/ninos-olcomep.png',
  image_width: 751,
  image_height: 248,
})

export function mergeHeroContent(content) {
  return { ...defaultHeroContent, ...(content || {}) }
}

export const defaultOlcomepIntroductionContent = Object.freeze({
  eyebrow: 'Sobre la olimpiada',
  title: 'Una competencia que conecta al país',
  first_paragraph: 'OLCOMEP contribuye al mejoramiento de la calidad de la educación matemática en Costa Rica, estimulando y desarrollando las capacidades de resolución de problemas de niñas y niños.',
  second_paragraph: 'Participan estudiantes desde primer hasta sexto año diurno de la Educación General Básica, procedentes de distintas regiones educativas del país.',
})

export function mergeOlcomepIntroductionContent(content) {
  return { ...defaultOlcomepIntroductionContent, ...(content || {}) }
}

export const defaultCalendarContent = Object.freeze({
  eyebrow: 'XII edición · 2026',
  title: 'Calendario',
  description: 'Consulte las fechas oficiales de inscripción, preparación, aplicación de pruebas, publicación de resultados y premiación de OLCOMEP 2026.',
  notice: 'Las fechas y horas específicas de los talleres se comunicarán mediante los canales oficiales.',
  footer: 'Este calendario resume el cronograma oficial. Consulte el manual para conocer las observaciones y condiciones completas de cada etapa.',
  manual_label: 'Abrir manual 2026',
  manual_href: '/data/2026/manual-OLCOMEP-primaria-2026.pdf',
  schedule: [
    { date: '8 de abril al 6 de mayo', dateTime: '2026-04-08', endDateTime: '2026-05-06', title: 'Inscripción', description: 'Periodo oficial de inscripción mediante el formulario o instrumento habilitado para la edición 2026.' },
    { date: 'Mayo', dateTime: '2026-05', title: 'Actividades de inauguración', description: 'Las actividades de apertura se desarrollan durante todo el mes.' },
    { date: 'Mayo', dateTime: '2026-05', title: 'Talleres de preparación para la Primera Etapa', description: 'La fecha y hora específicas se comunican en el sitio web, redes oficiales y comunicados del MEP.' },
    { date: '16 al 18 de junio', dateTime: '2026-06-16', endDateTime: '2026-06-18', title: 'Pruebas de aplicación de la Primera Etapa', description: 'Día 1: quinto y sexto año. Día 2: tercero y cuarto año. Día 3: primero y segundo año. Modalidad presencial en los centros educativos participantes.' },
    { date: '5 de julio', dateTime: '2026-07-05', title: 'Resultados para la Segunda Etapa', description: 'Publicación de personas clasificadas mediante las asesorías regionales de Matemáticas y la página social oficial.' },
    { date: 'Julio', dateTime: '2026-07', title: 'Talleres de preparación para la Segunda Etapa', description: 'La programación específica se anuncia mediante los canales oficiales de OLCOMEP y el MEP.' },
    { date: '18 al 20 de agosto', dateTime: '2026-08-18', endDateTime: '2026-08-20', title: 'Pruebas de aplicación de la Segunda Etapa', description: 'Día 1: quinto y sexto año. Día 2: tercero y cuarto año. Día 3: primero y segundo año. Modalidad presencial en sedes de las Direcciones Regionales de Educación.' },
    { date: '7 de setiembre', dateTime: '2026-09-07', title: 'Resultados para la Final Nacional', description: 'Publicación de personas clasificadas mediante las asesorías regionales y la página social oficial.' },
    { date: 'Septiembre', dateTime: '2026-09', title: 'Talleres de preparación para la Etapa Final', description: 'La fecha y hora específicas se informan por los canales oficiales.' },
    { date: '8 de octubre', dateTime: '2026-10-08', title: 'Etapa Final', description: 'Aplicación presencial en una sede única de cada Dirección Regional de Educación.', highlighted: true },
    { date: '6 de noviembre', dateTime: '2026-11-06', title: 'Resultados de medallistas y personas galardonadas', description: 'Comunicación mediante las asesorías regionales de Matemáticas y la página social oficial.' },
    { date: '3 de diciembre', dateTime: '2026-12-03', title: 'Premiación Nacional', description: 'La información de participación se brinda directamente a los centros educativos.', highlighted: true },
  ],
})

export function mergeCalendarContent(content) {
  return { ...defaultCalendarContent, ...(content || {}), schedule: content?.schedule || defaultCalendarContent.schedule }
}

export const defaultPartnersContent = Object.freeze({
  eyebrow: 'Alianza interinstitucional',
  title: 'Colaboradores y patrocinadores',
  description: 'OLCOMEP articula la experiencia pedagógica del Ministerio de Educación Pública con el aporte de las universidades públicas y el respaldo de organizaciones que apoyan la edición vigente.',
  collaborators_title: 'Universidades públicas colaboradoras',
  collaborators_note: 'Comisión Central OLCOMEP',
  sponsors_title: 'Patrocinadores',
  collaborators: [
    { key: 'ucr', name: 'Universidad de Costa Rica', logo_url: '/logo-ucr.png', logo_width: 500, logo_height: 500 },
    { key: 'uned', name: 'Universidad Estatal a Distancia', logo_url: '/logo-uned.png', logo_width: 521, logo_height: 500 },
    { key: 'una', name: 'Universidad Nacional', logo_url: '/logo-una.png', logo_width: 500, logo_height: 500 },
    { key: 'tec', name: 'Tecnológico de Costa Rica', logo_url: '/logo-tec.png', logo_width: 521, logo_height: 500 },
    { key: 'utn', name: 'Universidad Técnica Nacional', logo_url: '/logo-utn.png', logo_width: 521, logo_height: 500 },
  ],
  sponsors: [{ key: 'centro-cultural-costarricense-norteamericano', name: 'Centro Cultural Costarricense Norteamericano', description: 'Organización patrocinadora de OLCOMEP 2026. Su reconocimiento se presenta de forma textual mientras no se disponga de un logotipo oficial autorizado para publicación.' }],
})

export function mergePartnersContent(content) {
  return { ...defaultPartnersContent, ...(content || {}), collaborators: content?.collaborators || defaultPartnersContent.collaborators, sponsors: content?.sponsors || defaultPartnersContent.sponsors }
}

export const defaultAboutContent = Object.freeze({
  eyebrow: 'Nuestra historia',
  title: 'Acerca de nosotros',
  introduction: [
    'OLCOMEP surgió del trabajo desarrollado en las aulas y del liderazgo de las regiones educativas, que reconocieron el talento y entusiasmo de la niñez costarricense por la matemática.',
    'Desde 2015, el Ministerio de Educación Pública conduce esta iniciativa nacional para estudiantes de primero a sexto año, articulando la experiencia de sus asesorías con el aporte de la educación superior pública.',
  ],
  milestones: [
    { key: 'inicios-regionales', period: 'Primera década de 2000', title: 'Experiencias nacidas en las regiones', description: 'Las asesorías regionales de Matemáticas impulsaron olimpiadas locales. Entre las experiencias pioneras se encuentra la desarrollada en la Dirección Regional de Educación de Puriscal.' },
    { key: 'proyeccion-nacional', period: '2014', title: 'Proyección nacional', description: 'La Asesoría Nacional de Matemáticas de la Dirección de Desarrollo Curricular del MEP acogió las iniciativas regionales para proyectarlas a escala nacional.' },
    { key: 'nacimiento-oficial', period: '2015', title: 'Nacimiento oficial de OLCOMEP', description: 'La olimpiada inició oficialmente para estudiantes de I y II Ciclos, con una estructura piloto gestionada por las asesorías del MEP y centrada en la resolución de problemas en contextos reales.' },
    { key: 'apertura-digital', period: '2020', title: 'Resiliencia y apertura digital', description: 'Durante la pandemia se virtualizaron etapas formativas y eliminatorias, ampliando el uso de tecnologías de la información dentro del proceso olímpico.' },
    { key: 'crecimiento-territorial', period: '2022–2024', title: 'Crecimiento y alcance territorial', description: 'La participación aumentó un 120 %, al pasar de 7 000 a más de 18 000 estudiantes inscritos. Las 27 Direcciones Regionales de Educación se incorporaron activamente al proceso.' },
    { key: 'alianza-actual', period: 'Actualidad', title: 'Alianza interinstitucional', description: 'UCR, UNED, UNA, TEC y UTN aportan respaldo técnico, científico y metodológico junto con la experiencia pedagógica de las asesorías del MEP en la Comisión Central.' },
  ],
  closing_title: 'Una visión integral y humanista',
  closing_paragraphs: [
    'OLCOMEP trasciende la competencia académica: promueve habilidades vinculadas con el enfoque STEAM, la equidad de género, el pensamiento crítico y la superación personal en un entorno sano e inclusivo.',
    'Mediante etapas de participación, materiales didácticos de acceso universal y acompañamiento a docentes y familias, busca que cada niña y niño encuentre en la matemática una oportunidad para desarrollar creatividad, lógica y confianza en sus capacidades.',
  ],
})

export function mergeAboutContent(content) {
  return { ...defaultAboutContent, ...(content || {}), introduction: content?.introduction || defaultAboutContent.introduction, milestones: content?.milestones || defaultAboutContent.milestones, closing_paragraphs: content?.closing_paragraphs || defaultAboutContent.closing_paragraphs }
}

export const defaultGeneralInformationContent = Object.freeze({
  eyebrow: 'Orientación para participar', title: 'Información general', description: 'Encuentre los documentos, fechas y recorridos principales para conocer y participar en OLCOMEP.',
  faq_eyebrow: 'Respuestas rápidas', faq_title: 'Preguntas frecuentes',
  routes: [
    { key: 'reglamento', title: 'Reglamento', description: 'Normas, condiciones y disposiciones oficiales para la edición OLCOMEP 2026.', href: '/data/2026/reglamento-OLCOMEP-2026.pdf', label: 'Abrir reglamento 2026 en PDF', icon: 'file', external: true },
    { key: 'participar', title: 'Cómo participar', description: 'Participación dirigida a estudiantes de primero a sexto año de Educación Primaria mediante el proceso oficial de inscripción.', href: '#edicion-vigente', label: 'Consultar cómo participar en la edición vigente', icon: 'users' },
    { key: 'calendario', title: 'Calendario', description: 'El periodo de inscripción publicado para 2026 estuvo habilitado del 8 de abril al 6 de mayo.', href: '#calendario', label: 'Consultar el calendario oficial de OLCOMEP 2026', icon: 'calendar' },
    { key: 'preguntas', title: 'Preguntas frecuentes', description: 'Respuestas rápidas sobre población participante, inscripción, preparación y consultas regionales.', href: '#preguntas-frecuentes', label: 'Ir a preguntas frecuentes de OLCOMEP', icon: 'help' },
  ],
  faqs: [
    { key: 'participantes', question: '¿Quiénes pueden participar?', answer: 'Estudiantes de primero a sexto año diurno de la Educación General Básica de Costa Rica, de acuerdo con las condiciones establecidas para cada edición.' },
    { key: 'inscripcion', question: '¿Cómo se realiza la inscripción?', answer: 'La inscripción continúa mediante el formulario oficial externo. El periodo correspondiente a 2026 estuvo habilitado del 8 de abril al 6 de mayo y actualmente se encuentra cerrado.' },
    { key: 'preparacion', question: '¿Dónde se encuentran los materiales de preparación?', answer: 'La sección Práctica por nivel reúne cuadernillos para estudiantes y docentes, recursos históricos y actividades interactivas disponibles.' },
    { key: 'consulta-regional', question: '¿Dónde puedo hacer una consulta regional?', answer: 'La sección Coordinaciones regionales permite buscar la Dirección Regional de Educación correspondiente y consultar sus correos institucionales publicados.' },
  ],
})

export function mergeGeneralInformationContent(content) {
  return { ...defaultGeneralInformationContent, ...(content || {}), routes: content?.routes || defaultGeneralInformationContent.routes, faqs: content?.faqs || defaultGeneralInformationContent.faqs }
}

export const defaultRegionalCoordinationsContent = Object.freeze({
  eyebrow: 'Presencia en todo el país', title: 'Coordinaciones regionales',
  description: 'Las asesorías regionales de Matemáticas dieron origen a las primeras experiencias olímpicas y continúan siendo parte esencial del alcance territorial de OLCOMEP.',
  summary_title: 'Direcciones Regionales de Educación', summary_description: 'Las 27 regiones educativas del país participan activamente en el proceso, incluidas comunidades fronterizas, insulares, de montaña y de difícil acceso.',
  directory_title: 'Directorio regional', search_label: 'Buscar por región o persona', regions: regionalCoordinations,
})

export function mergeRegionalCoordinationsContent(content) {
  const regions = content?.regions || defaultRegionalCoordinationsContent.regions
  return {
    ...defaultRegionalCoordinationsContent,
    ...(content || {}),
    regions: regions.map((region, regionIndex) => ({
      ...region,
      contacts: region.contacts.map((contact, contactIndex) => ({
        key: contact.key || `regional-${regionIndex + 1}-contact-${contactIndex + 1}`,
        ...contact,
      })),
    })),
  }
}

export const defaultCurrentEditionContent = Object.freeze({
  eyebrow: 'Información actual',
  title: 'Edición OLCOMEP 2026',
  description: 'Consulte los documentos oficiales y materiales disponibles para estudiantes, familias y personal docente.',
  registration_title: 'Inscripción 2026 cerrada',
  registration_description: 'El periodo de inscripción estuvo habilitado del 8 de abril al 6 de mayo de 2026.',
  registration_label: 'Consultar formulario histórico',
  registration_href: 'https://forms.gle/QStuNgoiQCtoDMfD9',
  resources: [
    { key: 'manual-2026', title: 'Manual OLCOMEP Primaria 2026', description: 'Orientaciones oficiales para participar en la edición vigente.', format: 'PDF', href: '/data/2026/manual-OLCOMEP-primaria-2026.pdf', icon: 'file' },
    { key: 'reglamento-2026', title: 'Reglamento OLCOMEP 2026', description: 'Normas, condiciones y disposiciones de la Olimpiada 2026.', format: 'PDF', href: '/data/2026/reglamento-OLCOMEP-2026.pdf', icon: 'file' },
    { key: 'temarios-2025', title: 'Temarios disponibles', description: 'Colección disponible en el sitio anterior, publicada en 2025.', format: 'ZIP · edición 2025', href: '/data/2025/temarios.zip', icon: 'archive' },
    { key: 'protocolo-2024', title: 'Protocolo de aplicación', description: 'Protocolo disponible actualmente como referencia para la organización.', format: 'PDF · edición 2024', href: '/data/2024/protocolo-2024.pdf', icon: 'file' },
  ],
  bulk_eyebrow: 'Inscripción masiva',
  bulk_title: 'Plantilla para centros educativos',
  bulk_description: 'Descargue el archivo oficial de inscripción masiva correspondiente a OLCOMEP 2026.',
  bulk_label: 'Descargar plantilla XLSX',
  bulk_href: '/data/2026/Inscripcion-masiva-OLCOMEP-2026.xlsx',
  promotion_label: 'Ver video de promoción',
  promotion_href: 'https://www.youtube.com/watch?v=3kaI2PLOzG0',
  image_alt: 'Anuncio del patrocinio del Centro Cultural Costarricense Norteamericano a OLCOMEP',
  image_url: '/assets/legacy/current-edition/centro-cultural.jpg',
  image_width: 370,
  image_height: 300,
})

export function mergeCurrentEditionContent(content) {
  return { ...defaultCurrentEditionContent, ...(content || {}), resources: content?.resources || defaultCurrentEditionContent.resources }
}

export const defaultContactContent = Object.freeze({
  eyebrow: 'Estamos para orientarle', title: 'Contacto', description: 'Para consultas sobre OLCOMEP, comuníquese con la Asesoría de Matemáticas de Primero y Segundo Ciclos.',
  contact_name: 'Yeri Charpentier Díaz', contact_role: 'Asesora de matemáticas de Primero y Segundo Ciclos',
  phones: ['2221-7685'], emails: ['primero.segundo.ciclos@mep.go.cr'],
  resources: [
    { key: 'youtube', title: 'Canal de OLCOMEP en YouTube', description: 'Videos y materiales audiovisuales relacionados con las Olimpiadas Matemáticas.', href: 'https://www.youtube.com/channel/UCb1Mihv34LjcEzjicn76Omw' },
    { key: 'calificame', title: 'Califique este recurso', description: 'Comparta su valoración sobre este recurso educativo del MEP.', href: 'https://recursos.mep.go.cr/0_calificame/app/index.html?id_app=15' },
  ],
})

export function mergeContactContent(content) {
  return { ...defaultContactContent, ...(content || {}), phones: content?.phones || defaultContactContent.phones, emails: content?.emails || defaultContactContent.emails, resources: content?.resources || defaultContactContent.resources }
}
import { regionalCoordinations } from './regionalCoordinations.js'
export { regionalCoordinations } from './regionalCoordinations.js'
