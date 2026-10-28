import { useState } from 'react'
import { skillGroups } from '../../data/skills'

function SkillMark({ icon, name }: { icon: string; name: string }) {
  const [failed, setFailed] = useState(false)
  return failed ? <span className="skill-fallback-mark">{name.slice(0, 2).toUpperCase()}</span> : <img src={`https://cdn.simpleicons.org/${icon}/55564f`} alt="" onError={() => setFailed(true)} />
}

export function SkillsSection() {
  const [activeCategory, setActiveCategory] = useState('ALL')
  const visibleGroups = activeCategory === 'ALL' ? skillGroups : skillGroups.filter(group => group.name === activeCategory)

  return <section className="skills-section" id="skills">
    <div className="skills-grain" aria-hidden="true" />
    <div className="skills-shell">
      <div className="skills-heading"><span>06 / SKILLS</span><span className="skills-heading-line" /><span>TOOLS WITH A PLACE TO GO</span></div>
      <div className="skills-intro"><h2>A working vocabulary<br /><em>for real systems.</em></h2><p>Bukan daftar teknologi yang berdiri sendiri. Setiap skill di sini terhubung ke proyek, keputusan, atau kebiasaan kerja yang pernah saya gunakan.</p></div>
      <div className="skill-filters"><button className={activeCategory === 'ALL' ? 'is-active' : ''} onClick={() => setActiveCategory('ALL')}>ALL</button>{skillGroups.map(group => <button className={activeCategory === group.name ? 'is-active' : ''} key={group.name} onClick={() => setActiveCategory(group.name)}>{group.name}</button>)}</div>
      <div className="skill-groups">{visibleGroups.map((group, groupIndex) => <div className="skill-group" key={group.name}><div className="skill-group-label"><span>0{groupIndex + 1}</span><strong>{group.name}</strong></div><div className="skill-grid">{group.skills.map((skill, index) => <article className="skill-card" key={skill.name}><div className="skill-card-top"><span>{String(index + 1).padStart(2, '0')}</span><span>ACTIVE</span></div><div className="skill-icon"><SkillMark icon={skill.icon} name={skill.name} /></div><h3>{skill.name}</h3><p>{skill.used}</p><span className="skill-card-arrow">↗</span></article>)}</div></div>)}</div>
    </div>
  </section>
}
