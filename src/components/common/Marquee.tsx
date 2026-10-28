import { heroPhrases } from '../../data/portfolio'

interface MarqueeProps {
  reverse?: boolean
}

export function Marquee({ reverse = false }: MarqueeProps) {
  const items = [...heroPhrases, ...heroPhrases]
  return <div className={`marquee ${reverse ? 'marquee-reverse' : ''}`} aria-hidden="true"><div className="marquee-track">{items.map((phrase, index) => <span key={`${phrase}-${index}`}>{phrase}<i>✳</i></span>)}</div></div>
}
