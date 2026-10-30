import { useId, useRef, useState, type CSSProperties } from 'react'
import { Pause, Play } from '@phosphor-icons/react'
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useInView,
  useIsPresent,
} from 'motion/react'
import { skillGroups } from '../../data/skills'
import type { Skill } from '../../types/portfolio'
import { useReducedMotion } from '../common/useReducedMotion'
import { usePageVisible } from '../common/usePageVisible'
import { InkHeading } from '../common/InkHeading'
import './skills-paper.css'

const skillPapers = skillGroups
  .flatMap((group) =>
    group.skills.map((skill) => ({ skill, category: group.name })),
  )
  .map((paper, index) => ({ ...paper, index }))

function SkillMark({ icon, name }: { icon: string; name: string }) {
  const [failed, setFailed] = useState(false)
  return failed ? (
    <span className="press-skill-fallback">
      {name.slice(0, 2).toUpperCase()}
    </span>
  ) : (
    <img
      src={`https://cdn.simpleicons.org/${icon}/253b30`}
      alt=""
      width={42}
      height={42}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
    />
  )
}

function SkillPaper({
  skill,
  category,
  index,
  paused,
}: {
  skill: Skill
  category: string
  index: number
  paused: boolean
}) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { amount: 0.05, margin: '48px 0px' })
  const present = useIsPresent()
  const [held, setHeld] = useState(false)
  const contextId = useId()
  const paperStyle = {
    '--paper-angle': `${[-7, 4, -3, 7, -5, 3, 6][index % 7]}deg`,
    '--paper-shift-x': `${[-8, 5, -3, 8, 0, -5][index % 6]}px`,
    '--paper-shift-y': `${[10, -4, 22, 2, 18, 8, 0, 16][index % 8]}px`,
    '--paper-duration': `${4.8 + (index % 5) * 0.6}s`,
    '--paper-delay': `${-(index % 7) * 0.85}s`,
    '--paper-travel': `${8 + (index % 4)}px`,
  } as CSSProperties

  return (
    <figure
      ref={ref}
      className="press-skill-inspect"
      data-motion-paused={paused || !inView || !present}
      data-held={held}
      inert={!present}
      aria-hidden={!present}
      data-paper-tone={index % 4}
      style={paperStyle}
    >
      <div className="press-skill-drift">
        <button
          type="button"
          className="press-skill-piece"
          aria-label={`Hold ${skill.name} paper`}
          aria-pressed={held}
          aria-describedby={contextId}
          onClick={() => setHeld((current) => !current)}
        >
          <span className="press-skill-face">
            <span className="press-skill-logo">
              <SkillMark icon={skill.icon} name={skill.name} />
            </span>
            <span className="press-skill-name">{skill.name}</span>
            {held && (
              <Pause
                className="press-skill-held-mark"
                size={12}
                aria-hidden="true"
              />
            )}
          </span>
        </button>
      </div>
      <figcaption className="press-skill-context" id={contextId}>
        <span className="press-skill-category">{category}</span>{' '}
        <span>{skill.used}</span>
      </figcaption>
    </figure>
  )
}

export function SkillsSection() {
  const [activeCategory, setActiveCategory] = useState('ALL')
  const reduceMotion = useReducedMotion()
  const pageVisible = usePageVisible()
  const [paused, setPaused] = useState(false)
  const visiblePapers =
    activeCategory === 'ALL'
      ? skillPapers
      : skillPapers.filter((paper) => paper.category === activeCategory)

  return (
    <section className="skills-section" id="skills" tabIndex={-1}>
      <div className="skills-grain" aria-hidden="true" />
      <div className="skills-shell">
        <div className="skills-heading">
          <span>06 / SKILLS</span>
          <span className="skills-heading-line" />
          <span>TOOLS WITH A PLACE TO GO</span>
        </div>
        <div className="skills-intro">
          <InkHeading first="A working vocabulary" second="for real systems." />
          <p>
            Bukan daftar teknologi yang berdiri sendiri. Setiap skill di sini
            terhubung ke proyek, keputusan, atau kebiasaan kerja yang pernah
            saya gunakan.
          </p>
        </div>
        <LayoutGroup id="skill-categories">
          <div
            className="skill-filters"
            role="group"
            aria-label="Filter skills by category"
          >
            {['ALL', ...skillGroups.map((group) => group.name)].map(
              (category) => (
                <button
                  className={activeCategory === category ? 'is-active' : ''}
                  key={category}
                  aria-pressed={activeCategory === category}
                  aria-controls="skill-results"
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                  {activeCategory === category && (
                    <motion.span
                      className="skill-filter-marker"
                      layoutId="active-skill-filter"
                      transition={{ duration: reduceMotion ? 0 : 0.24 }}
                    />
                  )}
                </button>
              ),
            )}
          </div>
          <div className="press-skill-toolbar">
            <p>
              {reduceMotion ? (
                'Motion reduced. The papers stay still.'
              ) : (
                <>
                  <span className="press-skill-hover-hint">
                    Hover to pause.{' '}
                  </span>
                  Tap or press Enter to hold a paper.
                </>
              )}
            </p>
            {!reduceMotion && (
              <button
                type="button"
                className="press-skill-motion-toggle"
                aria-label={
                  paused
                    ? 'Resume motion for floating skills'
                    : 'Pause motion for floating skills'
                }
                data-paused={paused}
                onClick={() => setPaused((current) => !current)}
              >
                {paused ? (
                  <Play size={13} aria-hidden="true" />
                ) : (
                  <Pause size={13} aria-hidden="true" />
                )}
                {paused ? 'Resume motion' : 'Pause motion'}
              </button>
            )}
          </div>
          <ul
            className="press-skill-field"
            id="skill-results"
            aria-label="Floating skill papers"
            role="list"
          >
            <AnimatePresence initial={false} mode="popLayout">
              {visiblePapers.map((paper) => (
                <motion.li
                  className="press-skill-slot"
                  key={paper.skill.name}
                  layout={reduceMotion ? false : 'position'}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{
                    opacity: 0,
                    transition: { duration: reduceMotion ? 0 : 0.12 },
                  }}
                  transition={{ duration: reduceMotion ? 0 : 0.24 }}
                >
                  <SkillPaper
                    {...paper}
                    paused={paused || reduceMotion || !pageVisible}
                  />
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
          <p className="visually-hidden" role="status">
            {visiblePapers.length} skills shown
            {activeCategory === 'ALL'
              ? ' across all categories'
              : ` in ${activeCategory.toLowerCase()}`}
            .
          </p>
        </LayoutGroup>
      </div>
    </section>
  )
}
