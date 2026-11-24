import './calificame.css'

export function CalificameButton({ href, preview = false }) {
  if (!/^https?:\/\//i.test(href || '')) return null

  return <a className="calificame-button" href={href} target="_blank" rel="noopener noreferrer" aria-label="Califique este recurso en una nueva pestaña" tabIndex={preview ? -1 : undefined}>
    <span className="calificame-star calificame-star-one" aria-hidden="true">★</span>
    <span className="calificame-star calificame-star-two" aria-hidden="true">★</span>
    <span className="calificame-star calificame-star-three" aria-hidden="true">★</span>
    <span className="calificame-banner" aria-hidden="true"><span className="calificame-title">¡Califícame!</span><span className="calificame-chat"><i/><i/><i/></span><span className="calificame-like"><i/></span></span>
  </a>
}
