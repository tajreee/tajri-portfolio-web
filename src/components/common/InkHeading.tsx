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
  const inView = useInView(ref, {
    once: true,
    amount: 0.1,
    margin: '120px 0px',
  })
  const reduceMotion = useReducedMotion()
  const revealed = inView || reduceMotion

  return (
    <h2 ref={ref} aria-label={`${first} ${second}`}>
      <span className="ink-line" aria-hidden="true">
        <motion.span
          initial={false}
          animate={{ opacity: revealed ? 1 : 0.88 }}
          transition={{ duration: reduceMotion ? 0 : 0.28 }}
        >
          {first}
        </motion.span>
      </span>
      <span className="ink-line" aria-hidden="true">
        <motion.em
          initial={false}
          animate={{ opacity: revealed ? 1 : 0.88 }}
          transition={{
            duration: reduceMotion ? 0 : 0.28,
            delay: revealed && !reduceMotion ? 0.04 : 0,
          }}
        >
          {second}
        </motion.em>
      </span>
    </h2>
  )
}
