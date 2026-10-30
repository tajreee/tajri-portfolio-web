import { useEffect, useRef, useState } from 'react'
import { Pause, Play } from '@phosphor-icons/react'
import { AnimatePresence, motion, useInView } from 'motion/react'
import { usePageVisible } from '../common/usePageVisible'
import { useReducedMotion } from '../common/useReducedMotion'
import { InkHeading } from '../common/InkHeading'

const portraitStyles = [
  {
    label: 'THE BUILDER',
    note: 'BACKEND / FRONTEND',
    image: '/assets/tajri-potrait-builder.png',
    position: '50% 0%',
  },
  {
    label: 'THE EXPLAINER',
    note: 'TEACHING / COLLABORATION',
    image: '/assets/tajri-potrait-explainer.png',
    position: '51% 0%',
  },
  {
    label: 'THE OBSERVER',
    note: 'SYSTEMS / DETAILS',
    image: '/assets/tajri-potrait-observer.png',
    position: '53% 0%',
  },
]

function PortraitFrame({
  image,
  label,
  position,
}: {
  image: string
  label: string
  position: string
}) {
  const [failed, setFailed] = useState(false)
  return (
    <div
      className={`about-portrait-frame ${failed ? 'about-portrait-missing' : ''}`}
    >
      {!failed && (
        <img
          src={image}
          className="about-portrait-image"
          alt={`${label} portrait of Tajri Mintahtihal Anhaar`}
          width={1024}
          height={1536}
          loading="lazy"
          decoding="async"
          style={{ objectPosition: position, transformOrigin: position }}
          onError={() => setFailed(true)}
        />
      )}
      {failed && (
        <>
          <strong>TA</strong>
          <span>
            ADD
            <br />
            PORTRAIT
          </span>
        </>
      )}
    </div>
  )
}

export function AboutSection() {
  const [activeStyle, setActiveStyle] = useState(0)
  const [paused, setPaused] = useState(false)
  const [direction, setDirection] = useState(1)
  const sectionRef = useRef<HTMLElement>(null)
  const inView = useInView(sectionRef, { amount: 0.15 })
  const pageVisible = usePageVisible()
  const reduceMotion = useReducedMotion()
  const playing = !paused && inView && pageVisible && !reduceMotion
  const style = portraitStyles[activeStyle]

  useEffect(() => {
    if (!playing) return
    const interval = window.setInterval(() => {
      setDirection(1)
      setActiveStyle((current) => (current + 1) % portraitStyles.length)
    }, 3000)

    return () => window.clearInterval(interval)
  }, [playing])

  const selectPortrait = (index: number) => {
    setDirection(index >= activeStyle ? 1 : -1)
    setActiveStyle(index)
    setPaused(true)
  }

  const handleTabKey = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    let next = index
    if (event.key === 'ArrowRight') next = (index + 1) % portraitStyles.length
    else if (event.key === 'ArrowLeft')
      next = (index + portraitStyles.length - 1) % portraitStyles.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = portraitStyles.length - 1
    else return
    event.preventDefault()
    selectPortrait(next)
    event.currentTarget.parentElement
      ?.querySelectorAll<HTMLButtonElement>('[role="tab"]')
      [next]?.focus()
  }

  return (
    <section
      ref={sectionRef}
      className="about-section"
      id="about"
      tabIndex={-1}
    >
      <div className="about-grain" aria-hidden="true" />
      <div className="about-shell">
        <div className="about-heading">
          <span>02 / ABOUT ME</span>
          <span className="about-heading-line" />
          <span>THREE WAYS TO READ THE PERSON</span>
        </div>
        <div className="about-layout">
          <div
            className="about-portrait-column"
            onMouseEnter={() => setPaused(true)}
            onFocusCapture={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget))
                setPaused(true)
            }}
          >
            <div className="about-portrait-board">
              <div className="about-pin about-pin-left" />
              <div className="about-pin about-pin-right" />
              <div
                className="about-portrait-stage"
                id="portrait-panel"
                role="tabpanel"
                aria-labelledby={`portrait-tab-${activeStyle}`}
                tabIndex={0}
              >
                <AnimatePresence initial={false} custom={direction}>
                  <motion.div
                    className="about-portrait-slide"
                    key={style.image}
                    custom={direction}
                    variants={{
                      enter: (way: number) => ({
                        opacity: 0,
                        x: reduceMotion ? 0 : way * 18,
                        rotate: reduceMotion ? 0 : way * 1.2,
                      }),
                      read: { opacity: 1, x: 0, rotate: 0 },
                      leave: (way: number) => ({
                        opacity: 0,
                        x: reduceMotion ? 0 : way * -18,
                        rotate: reduceMotion ? 0 : way * -1.2,
                      }),
                    }}
                    initial="enter"
                    animate="read"
                    exit="leave"
                    transition={{ duration: reduceMotion ? 0 : 0.32 }}
                  >
                    <PortraitFrame
                      image={style.image}
                      label={style.label}
                      position={style.position}
                    />
                    <div className="about-portrait-caption">
                      <span>{style.label}</span>
                      <span>{style.note}</span>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
            <div
              className="portrait-switcher"
              role="tablist"
              aria-label="Portrait styles"
            >
              {portraitStyles.map((portrait, index) => (
                <button
                  key={portrait.label}
                  id={`portrait-tab-${index}`}
                  className={activeStyle === index ? 'is-active' : ''}
                  onClick={() => selectPortrait(index)}
                  onKeyDown={(event) => handleTabKey(event, index)}
                  role="tab"
                  aria-selected={activeStyle === index}
                  aria-controls="portrait-panel"
                  tabIndex={activeStyle === index ? 0 : -1}
                >
                  <span>0{index + 1}</span>
                  {portrait.label}
                </button>
              ))}
            </div>
            {!reduceMotion && (
              <button
                className="portrait-playback"
                type="button"
                aria-label={
                  paused
                    ? 'Play portrait slideshow'
                    : 'Pause portrait slideshow'
                }
                aria-pressed={paused}
                onClick={() => setPaused((current) => !current)}
              >
                {paused ? <Play size={12} /> : <Pause size={12} />}
                {paused ? 'PLAY PORTRAITS' : 'PAUSE PORTRAITS'}
              </button>
            )}
          </div>
          <article className="about-content-paper">
            <div className="about-content-top">
              <span>
                PROFILE NOTE / {String(activeStyle + 1).padStart(2, '0')}
              </span>
              <span>TAJRI ANHAAR</span>
            </div>
            <InkHeading
              first="Engineer by training."
              second="Builder by habit."
            />
            <div className="about-content-body">
              <p>
                Saya menulis kode di dua sisi: backend untuk membangun endpoint
                REST, skema basis data, dan aturan akses; frontend untuk
                memastikan data sampai ke pengguna dengan kontrak yang jelas.
              </p>
              <p>
                Bagi saya, fitur belum selesai ketika hanya berhasil di mesin
                sendiri. Saya menyiapkan migrasi, data uji, dokumentasi API, dan
                jalur rilis agar pekerjaan dapat dibaca dan dilanjutkan oleh
                orang berikutnya.
              </p>
            </div>
            <div className="about-principle-line">
              <span>HOW I WORK</span>
              <strong>Pahami alurnya dulu, baru menulis kode.</strong>
            </div>
            <motion.div
              className="about-facts"
              initial={reduceMotion ? false : 'ready'}
              animate={reduceMotion ? 'read' : undefined}
              whileInView="read"
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: reduceMotion ? 0 : 0.4 }}
              variants={{
                ready: {},
                read: {
                  transition: { staggerChildren: reduceMotion ? 0 : 0.08 },
                },
              }}
            >
              <motion.div
                variants={{
                  ready: { y: 16, opacity: 0.5 },
                  read: { y: 0, opacity: 1 },
                }}
              >
                <strong>3.77</strong>
                <span>GPA / CUM LAUDE</span>
              </motion.div>
              <motion.div
                variants={{
                  ready: { y: 16, opacity: 0.5 },
                  read: { y: 0, opacity: 1 },
                }}
              >
                <strong>5</strong>
                <span>MONTHS INDUSTRY EXPERIENCE</span>
              </motion.div>
              <motion.div
                variants={{
                  ready: { y: 16, opacity: 0.5 },
                  read: { y: 0, opacity: 1 },
                }}
              >
                <strong>40+</strong>
                <span>REST ENDPOINTS</span>
              </motion.div>
            </motion.div>
            <div className="about-content-footer">
              <span>THE PERSON BEHIND THE SYSTEM</span>
              <span>↘</span>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
