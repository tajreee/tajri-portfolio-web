import { useRef } from 'react'
import { motion, useInView } from 'motion/react'
import { useReducedMotion } from './useReducedMotion'

export function InkHeading({
  first,
  second,
}: {
  first: string
  second: string
}) {
  const ref = useRef<HTMLHeadingElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.25 })
  const reduceMotion = useReducedMotion()
  const revealed = inView || reduceMotion

  return (
    <h2 ref={ref} aria-label={`${first} ${second}`}>
      <span className="ink-line" aria-hidden="true">
        <motion.span
          initial={false}
          animate={{ y: revealed ? '0%' : '105%' }}
          transition={{ duration: reduceMotion ? 0 : 0.65 }}
        >
          {first}
        </motion.span>
      </span>
      <span className="ink-line" aria-hidden="true">
        <motion.em
          initial={false}
          animate={{ y: revealed ? '0%' : '105%' }}
          transition={{
            duration: reduceMotion ? 0 : 0.65,
            delay: revealed && !reduceMotion ? 0.09 : 0,
          }}
        >
          {second}
        </motion.em>
      </span>
    </h2>
  )
}
