import { useEffect, useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useAnimationControls,
  useInView,
} from 'motion/react'
import { contactEmail } from '../../data/portfolio'
import type { ContactFormValues } from '../../types/portfolio'
import { AnimatedDialog } from '../common/AnimatedDialog'
import { useReducedMotion } from '../common/useReducedMotion'

function SignatureModal({
  open,
  onClose,
  onUse,
}: {
  open: boolean
  onClose: () => void
  onUse: (signature: string) => void
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawingRef = useRef(false)
  const clear = () =>
    canvasRef.current?.getContext('2d')?.clearRect(0, 0, 620, 210)
  const point = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = event.currentTarget
    const rect = canvas.getBoundingClientRect()
    return [
      (event.clientX - rect.left) * (canvas.width / rect.width),
      (event.clientY - rect.top) * (canvas.height / rect.height),
    ] as const
  }
  return (
    <AnimatedDialog
      open={open}
      onClose={onClose}
      className="signature-modal"
      backdropClassName="signature-modal-backdrop"
      label="Create signature"
    >
      <div className="signature-modal-head">
        <span>DRAW YOUR SIGNATURE</span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close signature dialog"
        >
          ×
        </button>
      </div>
      <p>Use your mouse, trackpad, or finger to sign below.</p>
      <canvas
        ref={canvasRef}
        width={620}
        height={210}
        className="signature-canvas"
        onPointerDown={(event) => {
          drawingRef.current = true
          const context = event.currentTarget.getContext('2d')
          if (!context) return
          context.beginPath()
          const [x, y] = point(event)
          context.moveTo(x, y)
        }}
        onPointerMove={(event) => {
          if (!drawingRef.current) return
          const context = event.currentTarget.getContext('2d')
          if (!context) return
          const [x, y] = point(event)
          context.lineTo(x, y)
          context.stroke()
        }}
        onPointerUp={() => {
          drawingRef.current = false
        }}
        onPointerCancel={() => {
          drawingRef.current = false
        }}
        onPointerLeave={() => {
          drawingRef.current = false
        }}
      />
      <div className="signature-modal-actions">
        <button type="button" onClick={clear}>
          CLEAR
        </button>
        <button
          type="button"
          onClick={() => {
            if (canvasRef.current)
              onUse(canvasRef.current.toDataURL('image/png'))
          }}
        >
          USE SIGNATURE
        </button>
      </div>
    </AnimatedDialog>
  )
}

export function ContactSection() {
  const reduceMotion = useReducedMotion()
  const boardRef = useRef<HTMLDivElement>(null)
  const letterControls = useAnimationControls()
  // Observe the stationary board at a low threshold, even on tall mobile letters.
  const inView = useInView(boardRef, { once: true, amount: 0.01 })
  const [hasInteracted, setHasInteracted] = useState(false)
  const settleImmediately = reduceMotion || hasInteracted
  const [form, setForm] = useState<ContactFormValues>({
    dear: 'Tajri',
    subject: '',
    senderName: '',
    from: '',
    via: 'Portfolio website',
    body: '',
  })
  const [status, setStatus] = useState('')
  const [signatureOpen, setSignatureOpen] = useState(false)
  const [signature, setSignature] = useState('')

  useEffect(() => {
    if (settleImmediately) {
      letterControls.stop()
      letterControls.set('settled')
    } else if (inView) {
      void letterControls.start('settled')
    }
    return () => letterControls.stop()
  }, [inView, letterControls, settleImmediately])

  const today = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date())
  const update = (field: keyof ContactFormValues, value: string) =>
    setForm((current) => ({ ...current, [field]: value }))
  const sendLetter = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (
      !form.subject.trim() ||
      !form.senderName.trim() ||
      !form.from.trim() ||
      !form.body.trim()
    ) {
      setStatus('Please complete your name, subject, email, and message.')
      return
    }
    if (!/^\S+@\S+\.\S+$/.test(form.from.trim())) {
      setStatus('Please enter a valid email address.')
      return
    }
    const message = `Dear ${form.dear.trim() || 'Tajri'},\n\nRE: ${form.subject.trim()}\nFrom: ${form.senderName.trim()} <${form.from.trim()}>\nVia: ${form.via.trim() || 'Portfolio website'}\n\n${form.body.trim()}\n\nSincerely,\n${form.senderName.trim()}${signature ? '\n[Digital signature added in the portfolio letter]' : ''}`
    window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent(form.subject.trim())}&body=${encodeURIComponent(message)}`
    setStatus('Your email app is opening with the letter prepared.')
  }
  return (
    <section className="contact-section" id="contact" tabIndex={-1}>
      <div className="contact-grain" aria-hidden="true" />
      <div className="contact-shell">
        <div className="contact-heading">
          <span>05 / CONTACT</span>
          <span className="contact-heading-line" />
          <span>WRITE A LETTER</span>
        </div>
        <div className="letter-board" ref={boardRef}>
          <div className="letter-pin letter-pin-left" />
          <div className="letter-pin letter-pin-right" />
          <motion.form
            className="letter-paper"
            onSubmit={sendLetter}
            onFocusCapture={() => {
              if (hasInteracted) return
              // Stop synchronously before typing or opening the signature canvas.
              letterControls.stop()
              letterControls.set('settled')
              setHasInteracted(true)
            }}
            initial={
              reduceMotion ? false : { y: 28, rotate: -0.8, opacity: 0.78 }
            }
            animate={settleImmediately ? 'settled' : letterControls}
            variants={{ settled: { y: 0, rotate: 0, opacity: 1 } }}
            transition={{
              duration: settleImmediately ? 0 : 0.66,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{ transformOrigin: '50% 0%' }}
          >
            <div className="letter-head">
              <div>
                <strong>TAJRI ANHAAR</strong>
                <span>FULL STACK DEVELOPER</span>
              </div>
              <div className="letter-address">
                Jakarta, Indonesia
                <br />
                {contactEmail}
              </div>
            </div>
            <motion.div
              className="letter-divider"
              initial={reduceMotion ? false : { scaleX: 0 }}
              animate={{ scaleX: settleImmediately || inView ? 1 : 0 }}
              transition={{
                duration: settleImmediately ? 0 : 0.48,
                delay: settleImmediately ? 0 : 0.14,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{ transformOrigin: 'left' }}
            />
            <div className="letter-date">{today}</div>
            <label>
              Dear{' '}
              <input
                aria-label="Recipient name"
                value={form.dear}
                onChange={(event) => update('dear', event.target.value)}
              />
              ,
            </label>
            <div className="letter-fields">
              <label>
                <span>RE:</span>
                <input
                  required
                  value={form.subject}
                  onChange={(event) => update('subject', event.target.value)}
                  placeholder="The subject of your letter"
                />
              </label>
              <label>
                <span>FROM NAME:</span>
                <input
                  required
                  value={form.senderName}
                  onChange={(event) => update('senderName', event.target.value)}
                  placeholder="Your name"
                />
              </label>
              <label>
                <span>EMAIL:</span>
                <input
                  required
                  type="email"
                  value={form.from}
                  onChange={(event) => update('from', event.target.value)}
                  placeholder="your@email.com"
                />
              </label>
              <label>
                <span>VIA:</span>
                <input
                  value={form.via}
                  onChange={(event) => update('via', event.target.value)}
                  placeholder="How did you find me?"
                />
              </label>
            </div>
            <label className="letter-body-label">
              <span>BODY:</span>
              <textarea
                required
                value={form.body}
                onChange={(event) => update('body', event.target.value)}
                placeholder="Write your message here..."
                rows={6}
              />
            </label>
            <div className="letter-closing">
              <p>Sincerely,</p>
              <button
                type="button"
                className={`signature-space ${signature ? 'has-signature' : ''}`}
                onClick={() => setSignatureOpen(true)}
                aria-label={
                  signature ? 'Edit your signature' : 'Add your signature'
                }
              >
                {signature ? (
                  <img
                    className="signature-image"
                    src={signature}
                    alt="Your handwritten signature"
                  />
                ) : (
                  <span>SIGN HERE</span>
                )}
              </button>
              <strong>{form.senderName || 'Your name'}</strong>
              <span>{form.from || 'your@email.com'}</span>
            </div>
            <div className="letter-footer">
              <span>PRIVATE CORRESPONDENCE / 2026</span>
              <motion.button
                type="submit"
                initial={false}
                animate="rest"
                whileHover={reduceMotion ? undefined : 'hover'}
                whileTap={reduceMotion ? undefined : 'press'}
                variants={{
                  rest: { y: 0, scale: 1 },
                  hover: { y: -1, scale: 1 },
                  press: { y: 0, scale: 0.98 },
                }}
                transition={{ duration: reduceMotion ? 0 : 0.14 }}
              >
                SEND LETTER{' '}
                <motion.b
                  variants={{
                    rest: { x: 0, y: 0 },
                    hover: { x: 1.5, y: -1.5 },
                    press: { x: 0.5, y: -0.5 },
                  }}
                  transition={{ duration: reduceMotion ? 0 : 0.14 }}
                >
                  ↗
                </motion.b>
              </motion.button>
            </div>
            <div role="status" aria-atomic="true">
              <AnimatePresence initial={false} mode="wait">
                {status && (
                  <motion.p
                    key={status}
                    className="letter-status"
                    initial={reduceMotion ? false : { opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={
                      reduceMotion
                        ? { opacity: 1, y: 0, transition: { duration: 0 } }
                        : {
                            opacity: 0,
                            y: -2,
                            transition: { duration: 0.12 },
                          }
                    }
                    transition={{ duration: reduceMotion ? 0 : 0.18 }}
                  >
                    {status}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.form>
        </div>
        <p className="contact-security">
          This form opens your own email application. No message is stored or
          sent through a public server.
        </p>
      </div>
      <SignatureModal
        open={signatureOpen}
        onClose={() => setSignatureOpen(false)}
        onUse={(value) => {
          setSignature(value)
          setSignatureOpen(false)
        }}
      />
    </section>
  )
}
