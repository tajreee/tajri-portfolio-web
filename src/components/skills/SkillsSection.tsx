import { useState } from 'react'
import { AnimatePresence, LayoutGroup, motion } from 'motion/react'
import { skillGroups } from '../../data/skills'
import { useReducedMotion } from '../common/useReducedMotion'
import { InkHeading } from '../common/InkHeading'

function SkillMark({ icon, name }: { icon: string; name: string }) {
  const [failed, setFailed] = useState(false)
  return failed ? (
    <span className="skill-fallback-mark">
      {name.slice(0, 2).toUpperCase()}
    </span>
  ) : (
    <img
      src={`https://cdn.simpleicons.org/${icon}/55564f`}
      alt=""
      onError={() => setFailed(true)}
    />
  )
}

export function SkillsSection() {
  const [activeCategory, setActiveCategory] = useState('ALL')
  const reduceMotion = useReducedMotion()
  const visibleGroups =
    activeCategory === 'ALL'
      ? skillGroups
      : skillGroups.filter((group) => group.name === activeCategory)

  return (
    <section className="skills-section" id="skills">
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
          <div className="skill-groups" id="skill-results">
            <AnimatePresence initial={!reduceMotion} mode="popLayout">
              {visibleGroups.map((group) => (
                <motion.div
                  className="skill-group"
                  key={group.name}
                  layout={reduceMotion ? false : 'position'}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{
                    opacity: 0,
                    transition: { duration: reduceMotion ? 0 : 0.12 },
                  }}
                  transition={{ duration: reduceMotion ? 0 : 0.24 }}
                >
                  <div className="skill-group-label">
                    <span>0{skillGroups.indexOf(group) + 1}</span>
                    <strong>{group.name}</strong>
                  </div>
                  <div className="skill-grid">
                    {group.skills.map((skill, index) => (
                      <motion.article
                        className="skill-card"
                        key={skill.name}
                        initial={
                          reduceMotion
                            ? false
                            : {
                                y: 22,
                                rotate: index % 2 ? 2 : -2,
                                opacity: 0.65,
                              }
                        }
                        animate={
                          reduceMotion
                            ? { y: 0, rotate: 0, opacity: 1 }
                            : undefined
                        }
                        whileInView={{ y: 0, rotate: 0, opacity: 1 }}
                        viewport={{ once: true, amount: 0.15 }}
                        whileHover={
                          reduceMotion
                            ? undefined
                            : {
                                y: -9,
                                rotate: -1.5,
                                transition: { duration: 0.2, delay: 0 },
                              }
                        }
                        transition={{
                          duration: reduceMotion ? 0 : 0.45,
                          delay: reduceMotion ? 0 : index * 0.035,
                        }}
                      >
                        <div className="skill-card-top">
                          <span>{String(index + 1).padStart(2, '0')}</span>
                          <span>ACTIVE</span>
                        </div>
                        <div className="skill-icon">
                          <SkillMark icon={skill.icon} name={skill.name} />
                        </div>
                        <h3>{skill.name}</h3>
                        <p>{skill.used}</p>
                        <span className="skill-card-arrow">↗</span>
                      </motion.article>
                    ))}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <p className="visually-hidden" role="status">
            {visibleGroups.reduce(
              (total, group) => total + group.skills.length,
              0,
            )}{' '}
            skills shown
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
