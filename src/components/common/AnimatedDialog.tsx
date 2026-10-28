import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import { useReducedMotion } from './useReducedMotion'

interface AnimatedDialogProps {
  open: boolean
  onClose: () => void
  className: string
  backdropClassName: string
  label?: string
  labelledBy?: string
  children: ReactNode
}

function DialogSurface({
  onClose,
  className,
  backdropClassName,
  label,
  labelledBy,
  children,
}: Omit<AnimatedDialogProps, 'open'>) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const dialog = dialogRef.current!
    const trigger =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null
    const previousOverflow = document.body.style.overflow
    dialog.showModal()
    document.body.style.overflow = 'hidden'

    return () => {
      dialog.close()
      document.body.style.overflow = previousOverflow
      if (trigger?.isConnected) trigger.focus({ preventScroll: true })
    }
  }, [])

  return (
    <motion.dialog
      ref={dialogRef}
      className="motion-dialog"
      aria-label={label}
      aria-labelledby={labelledBy}
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: reduceMotion ? 0 : 0.16 } }}
      transition={{ duration: reduceMotion ? 0 : 0.2 }}
    >
      <div
        className={backdropClassName}
        onClick={(event) => {
          if (event.target === event.currentTarget) onClose()
        }}
      >
        <motion.div
          className={className}
          initial={reduceMotion ? false : { y: 18, rotate: -0.6 }}
          animate={{ y: 0, rotate: 0 }}
          exit={reduceMotion ? {} : { y: 8, transition: { duration: 0.16 } }}
        >
          {children}
        </motion.div>
      </div>
    </motion.dialog>
  )
}

export function AnimatedDialog({ open, ...props }: AnimatedDialogProps) {
  return createPortal(
    <AnimatePresence>{open && <DialogSurface {...props} />}</AnimatePresence>,
    document.body,
  )
}
