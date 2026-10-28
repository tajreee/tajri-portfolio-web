import { useRef } from 'react'
import { useInView } from 'motion/react'
import { heroPhrases } from '../../data/portfolio'
import { usePageVisible } from './usePageVisible'
import { useReducedMotion } from './useReducedMotion'

interface MarqueeProps {
  reverse?: boolean
  paused?: boolean
}

export function Marquee({ reverse = false, paused = false }: MarqueeProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref)
  const visible = usePageVisible()
  const reduceMotion = useReducedMotion()
  const items = [...heroPhrases, ...heroPhrases]
  return (
    <div
      ref={ref}
      className={`marquee ${reverse ? 'marquee-reverse' : ''}`}
      aria-hidden="true"
    >
      <div
        className="marquee-track"
        style={{
          animationPlayState:
            !inView || !visible || reduceMotion || paused
              ? 'paused'
              : 'running',
        }}
      >
        {items.map((phrase, index) => (
          <span key={`${phrase}-${index}`}>
            {phrase}
            <i>✳</i>
          </span>
        ))}
      </div>
    </div>
  )
}
