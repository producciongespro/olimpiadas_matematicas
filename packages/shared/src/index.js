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
