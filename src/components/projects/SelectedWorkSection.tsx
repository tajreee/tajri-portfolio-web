import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { projects } from '../../data/projects'
import type { Project } from '../../types/portfolio'
import { AnimatedDialog } from '../common/AnimatedDialog'
import { useReducedMotion } from '../common/useReducedMotion'

function ProjectImage({ project }: { project: Project }) {
  const [failed, setFailed] = useState(false)
  return (
    <div className={`project-image ${failed ? 'project-image-missing' : ''}`}>
      {!failed && (
        <img
          src={project.image}
          alt={`Preview ${project.title}`}
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
  const [dragStart, setDragStart] = useState<number | null>(null)
  const [dragOffset, setDragOffset] = useState(0)
  const [transitionEnabled, setTransitionEnabled] = useState(true)
  const [slideStep, setSlideStep] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)
  const draggedRef = useRef(false)
  const reduceMotion = useReducedMotion()
  const repeatedProjects = Array.from({ length: 7 }, () => projects).flat()
  const move = (direction: number) =>
    setActiveIndex((index) => index + direction)
  const handlePointerDown = (event: React.PointerEvent) => {
    if (event.button !== 0) return
    draggedRef.current = false
    setDragStart(event.clientX)
    event.currentTarget.setPointerCapture(event.pointerId)
  }
  const handlePointerMove = (event: React.PointerEvent) => {
    if (dragStart !== null) {
      const offset = event.clientX - dragStart
      if (Math.abs(offset) > 6) draggedRef.current = true
      setDragOffset(offset)
    }
  }
  const handlePointerUp = () => {
    if (Math.abs(dragOffset) > 30 && slideStep > 0) {
      const steps = Math.max(
        1,
        Math.min(
          projects.length + 1,
          Math.round(Math.abs(dragOffset) / slideStep),
        ),
      )
      setActiveIndex((index) => index + (dragOffset < 0 ? steps : -steps))
    }
    setDragStart(null)
    setDragOffset(0)
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

  useEffect(() => {
    const measure = () => {
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
    window.addEventListener('resize', measure)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  return (
    <section className="work-section" id="work">
      <div className="work-grain" aria-hidden="true" />
      <div className="work-shell">
        <div className="work-heading">
          <span>03 / SELECTED WORK</span>
          <span className="work-heading-line" />
          <span>CLICK A SHEET TO OPEN</span>
        </div>
        <div className="work-intro">
          <h2>
            Projects that held
            <br />
            <em>under pressure.</em>
          </h2>
          <p>
            Potongan dari tiga proyek magang: masalah nyata, keputusan teknis,
            dan pekerjaan yang berhasil sampai ke rilis.
          </p>
        </div>
        <div
          className="hanging-track-window"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={() => {
            setDragStart(null)
            setDragOffset(0)
            draggedRef.current = true
          }}
        >
          <div className="clothesline" aria-hidden="true">
            <span className="clothesline-knot clothesline-knot-left" />
            <span className="clothesline-knot clothesline-knot-right" />
          </div>
          <div
            ref={trackRef}
            className={`hanging-track ${transitionEnabled && dragStart === null ? '' : 'track-no-transition'}`}
            style={{
              transform: `translateX(${dragOffset - activeIndex * slideStep}px)`,
            }}
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
