import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react'
import { projects } from '../../data/projects'
import type { Project } from '../../types/portfolio'
import { AnimatedDialog } from '../common/AnimatedDialog'
import { useReducedMotion } from '../common/useReducedMotion'
import { InkHeading } from '../common/InkHeading'

function HangingMotion({
  children,
  index,
  sway,
  arrived,
}: {
  children: ReactNode
  index: number
  sway: MotionValue<number>
  arrived: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: '0px 100px' })
  const reduceMotion = useReducedMotion()
  const angle = index % 2 ? 7 : -7
  const ready = reduceMotion || arrived

  return (
    <motion.div
      ref={ref}
      className="sheet-sway"
      style={{ rotate: !reduceMotion && inView ? sway : 0 }}
    >
      <motion.div
        className="sheet-arrival"
        initial={false}
        animate={
          ready
            ? { rotate: 0, y: 0, opacity: 1 }
            : { rotate: angle, y: -14, opacity: 0.65 }
        }
        transition={{
          duration: reduceMotion || !inView ? 0 : 0.75,
          delay: reduceMotion || !inView ? 0 : (index % 3) * 0.06,
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

function ProjectImage({ project }: { project: Project }) {
  const [failed, setFailed] = useState(false)
  return (
    <div className={`project-image ${failed ? 'project-image-missing' : ''}`}>
      {!failed && (
        <img
          src={project.image}
          alt={`Preview ${project.title}`}
          loading="lazy"
          decoding="async"
          draggable={false}
          onError={() => setFailed(true)}
        />
      )}
      {failed && (
        <>
          <span>{project.number}</span>
          <strong>{project.title}</strong>
          <small>PROJECT IMAGE</small>
        </>
      )}
    </div>
  )
}

function StackStrip({ stack }: Pick<Project, 'stack'>) {
  return (
    <div className="stack-strip">
      {stack.map((technology) => (
        <span className="stack-item" key={technology.name}>
          {technology.icon ? (
            <img
              src={technology.icon}
              alt=""
              onError={(event) => {
                event.currentTarget.style.display = 'none'
              }}
            />
          ) : (
            <i>{technology.name.slice(0, 2).toUpperCase()}</i>
          )}
          <b>{technology.name}</b>
        </span>
      ))}
    </div>
  )
}

export function SelectedWorkSection() {
  const centerIndex = projects.length * 3
  const [activeIndex, setActiveIndex] = useState(centerIndex)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [transitionEnabled, setTransitionEnabled] = useState(true)
  const [slideStep, setSlideStep] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)
  const galleryRef = useRef<HTMLDivElement>(null)
  const gestureRef = useRef<{
    pointerId: number
    startX: number
    startY: number
    offset: number
    dragging: boolean
  } | null>(null)
  const draggedRef = useRef(false)
  const reduceMotion = useReducedMotion()
  const galleryInView = useInView(galleryRef, { once: true, amount: 0.08 })
  const { scrollYProgress } = useScroll({
    target: galleryRef,
    offset: ['start end', 'end start'],
  })
  const scrollAngle = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [1.5, 0, 0, -1.5],
  )
  const dragAngle = useMotionValue(0)
  const springDragAngle = useSpring(dragAngle, { stiffness: 120, damping: 22 })
  const sway = useTransform(() => scrollAngle.get() + springDragAngle.get())
  const resetGesture = useCallback(() => {
    const gesture = gestureRef.current
    if (!gesture) return
    gestureRef.current = null
    draggedRef.current = true
    if (gesture.dragging) {
      setIsDragging(false)
      dragAngle.set(0)
    }
    const gallery = galleryRef.current
    if (gallery?.hasPointerCapture(gesture.pointerId))
      gallery.releasePointerCapture(gesture.pointerId)
  }, [dragAngle])
  const repeatedProjects = Array.from({ length: 7 }, () => projects).flat()
  const move = (direction: number) => {
    if (!reduceMotion)
      animate(dragAngle, [-direction * 5, 0], { duration: 0.65 })
    setActiveIndex((index) => index + direction)
  }
  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (
      !event.isPrimary ||
      event.button !== 0 ||
      gestureRef.current ||
      (event.target instanceof Element &&
        event.target.closest(
          'a, button, input, select, textarea, [role="button"], [contenteditable="true"]',
        ))
    )
      return
    draggedRef.current = false
    gestureRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      offset: 0,
      dragging: false,
    }
  }
  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const gesture = gestureRef.current
    if (!gesture || event.pointerId !== gesture.pointerId) return
    const offset = event.clientX - gesture.startX
    if (!gesture.dragging) {
      const verticalOffset = event.clientY - gesture.startY
      if (Math.max(Math.abs(offset), Math.abs(verticalOffset)) < 8) return
      draggedRef.current = true
      if (Math.abs(offset) <= Math.abs(verticalOffset) * 1.2) {
        gestureRef.current = null
        return
      }
      gesture.dragging = true
      dragAngle.stop()
      // Disable easing before the first transform write, without waiting for React.
      trackRef.current?.classList.add('track-no-transition')
      setIsDragging(true)
      event.currentTarget.setPointerCapture(event.pointerId)
    }
    gesture.offset = offset
    if (trackRef.current)
      trackRef.current.style.transform = `translateX(${offset - activeIndex * slideStep}px)`
    if (!reduceMotion) dragAngle.set(Math.max(-7, Math.min(7, -offset / 45)))
  }
  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const gesture = gestureRef.current
    if (!gesture || event.pointerId !== gesture.pointerId) return
    if (!gesture.dragging) {
      gestureRef.current = null
      return
    }
    if (Math.abs(gesture.offset) > 30 && slideStep > 0) {
      const steps = Math.max(
        1,
        Math.min(
          projects.length + 1,
          Math.round(Math.abs(gesture.offset) / slideStep),
        ),
      )
      setActiveIndex((index) => index + (gesture.offset < 0 ? steps : -steps))
    }
    resetGesture()
  }
  const handlePointerCancel = (event: React.PointerEvent<HTMLDivElement>) => {
    if (gestureRef.current?.pointerId === event.pointerId) resetGesture()
  }
  const normalizeLoop = () => {
    const lowerLoopBoundary = projects.length * 2
    const upperLoopBoundary = projects.length * 4
    if (activeIndex < lowerLoopBoundary || activeIndex >= upperLoopBoundary) {
      const normalizedIndex =
        centerIndex +
        (((activeIndex % projects.length) + projects.length) % projects.length)
      setTransitionEnabled(false)
      setActiveIndex(normalizedIndex)
      window.requestAnimationFrame(() =>
        window.requestAnimationFrame(() => setTransitionEnabled(true)),
      )
    }
  }

  useLayoutEffect(() => {
    // Restore the snap target after React restores the CSS transition, even on a short drag.
    if (trackRef.current)
      trackRef.current.style.transform = `translateX(${(gestureRef.current?.offset ?? 0) - activeIndex * slideStep}px)`
  }, [activeIndex, isDragging, slideStep])

  useEffect(() => {
    const measure = () => {
      resetGesture()
      const firstSheet = trackRef.current
        ?.firstElementChild as HTMLElement | null
      if (!firstSheet) return
      const styles = window.getComputedStyle(trackRef.current!)
      setSlideStep(
        firstSheet.getBoundingClientRect().width +
          parseFloat(styles.columnGap || styles.gap || '0'),
      )
    }
    measure()
    const observer = new ResizeObserver(measure)
    if (trackRef.current) observer.observe(trackRef.current)
    return () => {
      observer.disconnect()
    }
  }, [resetGesture])

  return (
    <section className="work-section" id="work" tabIndex={-1}>
      <div className="work-grain" aria-hidden="true" />
      <div className="work-shell">
        <div className="work-heading">
          <span>03 / SELECTED WORK</span>
          <span className="work-heading-line" />
          <span>CLICK A SHEET TO OPEN</span>
        </div>
        <div className="work-intro">
          <InkHeading first="Projects that held" second="under pressure." />
          <p>
            Potongan dari tiga proyek magang: masalah nyata, keputusan teknis,
            dan pekerjaan yang berhasil sampai ke rilis.
          </p>
        </div>
        <div
          ref={galleryRef}
          className="hanging-track-window"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          onLostPointerCapture={(event) => {
            if (event.target === event.currentTarget) handlePointerCancel(event)
          }}
          onPointerLeave={(event) => {
            if (!gestureRef.current?.dragging) handlePointerCancel(event)
          }}
        >
          <motion.div
            className="clothesline"
            aria-hidden="true"
            initial={false}
            animate={{ scaleX: reduceMotion || galleryInView ? 1 : 0.15 }}
            transition={{ duration: reduceMotion ? 0 : 0.85 }}
          >
            <span className="clothesline-knot clothesline-knot-left" />
            <span className="clothesline-knot clothesline-knot-right" />
          </motion.div>
          <div
            ref={trackRef}
            className={`hanging-track ${transitionEnabled && !isDragging ? '' : 'track-no-transition'}`}
            onTransitionEnd={(event) => {
              if (
                event.target === event.currentTarget &&
                event.propertyName === 'transform'
              )
                normalizeLoop()
            }}
          >
            {repeatedProjects.map((project, index) => (
              <article
                className={`hanging-sheet sheet-${project.id}`}
                key={`${project.id}-${index}`}
                onClick={() =>
                  !draggedRef.current && setSelectedProject(project)
                }
                aria-hidden={
                  index < activeIndex || index >= activeIndex + projects.length
                }
              >
                <div className="sheet-string" />
                <div className="sheet-hook">●</div>
                <HangingMotion
                  index={index}
                  sway={sway}
                  arrived={galleryInView}
                >
                  <div className="sheet-paper">
                    <div className="sheet-top">
                      <span>{project.number} / CASE FILE</span>
                      <span>{project.type}</span>
                    </div>
                    <ProjectImage project={project} />
                    <h3>{project.title}</h3>
                    <p>{project.summary}</p>
                    <div className="sheet-meta">
                      <span>
                        <b>TIMELINE</b>
                        {project.timeline}
                      </span>
                      <span>
                        <b>ROLE</b>
                        {project.role}
                      </span>
                    </div>
                    <div className="sheet-footer">
                      <button
                        className="sheet-open-button"
                        aria-label={`Open ${project.title} project detail`}
                        tabIndex={
                          index >= activeIndex &&
                          index < activeIndex + projects.length
                            ? 0
                            : -1
                        }
                        onPointerDown={(event) => event.stopPropagation()}
                        onClick={(event) => {
                          event.stopPropagation()
                          setSelectedProject(project)
                        }}
                      >
                        OPEN DETAIL <span>↗</span>
                      </button>
                      <span>TA / 26</span>
                    </div>
                  </div>
                </HangingMotion>
              </article>
            ))}
          </div>
        </div>
        <div className="work-controls">
          <motion.button
            whileTap={reduceMotion ? undefined : { scale: 0.9 }}
            onClick={() => move(-1)}
            aria-label="Previous project"
          >
            ←
          </motion.button>
          <span>DRAG / SWIPE / CLICK</span>
          <motion.button
            whileTap={reduceMotion ? undefined : { scale: 0.9 }}
            onClick={() => move(1)}
            aria-label="Next project"
          >
            →
          </motion.button>
        </div>
      </div>
      <AnimatedDialog
        open={selectedProject !== null}
        onClose={() => setSelectedProject(null)}
        className="project-modal project-modal-landscape"
        backdropClassName="project-modal-backdrop"
        labelledBy="project-modal-title"
      >
        {selectedProject && (
          <>
            <button
              className="modal-close"
              onClick={() => setSelectedProject(null)}
              aria-label="Close project detail"
            >
              ×
            </button>
            <div className="modal-top">
              <span>{selectedProject.number} / CASE FILE</span>
              <span>{selectedProject.type}</span>
            </div>
            <div className="modal-layout">
              <div className="modal-heading">
                <h2 id="project-modal-title">{selectedProject.title}</h2>
                <p className="modal-summary">{selectedProject.summary}</p>
                <div className="modal-facts">
                  <span>
                    <b>TIMELINE</b>
                    {selectedProject.timeline}
                  </span>
                  <span>
                    <b>ROLE</b>
                    {selectedProject.role}
                  </span>
                </div>
              </div>
              <div className="modal-detail-column">
                <p className="modal-detail">{selectedProject.detail}</p>
                <div>
                  <span className="stack-label">STACK / SUPPORTING MARKS</span>
                  <StackStrip stack={selectedProject.stack} />
                </div>
              </div>
            </div>
          </>
        )}
      </AnimatedDialog>
    </section>
  )
}
