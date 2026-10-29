import { motion, MotionConfig, useScroll, useSpring } from 'motion/react'
import { useReducedMotion } from './components/common/useReducedMotion'
import { ContactSection } from './components/contact/ContactSection'
import { AboutSection } from './components/about/AboutSection'
import { EducationSection } from './components/education/EducationSection'
import { ExperienceSection } from './components/experience/ExperienceSection'
import { HeroSection } from './components/hero/HeroSection'
import { SelectedWorkSection } from './components/projects/SelectedWorkSection'
import { SkillsSection } from './components/skills/SkillsSection'

function App() {
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const readingProgress = useSpring(scrollYProgress, {
    stiffness: 150,
    damping: 30,
  })
  return (
    <MotionConfig
      reducedMotion={reduceMotion ? 'always' : 'never'}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      {!reduceMotion && (
        <motion.div
          className="reading-progress"
          aria-hidden="true"
          style={{ scaleX: readingProgress }}
        />
      )}
      <main className="hero-page">
        <HeroSection />
        <AboutSection />
        <EducationSection />
        <ExperienceSection />
        <SelectedWorkSection />
        <SkillsSection />
        <ContactSection />
      </main>
    </MotionConfig>
  )
}

export default App
