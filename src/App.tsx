import { ContactSection } from './components/contact/ContactSection'
import { AboutSection } from './components/about/AboutSection'
import { EducationSection } from './components/education/EducationSection'
import { ExperienceSection } from './components/experience/ExperienceSection'
import { HeroSection } from './components/hero/HeroSection'
import { SelectedWorkSection } from './components/projects/SelectedWorkSection'
import { SkillsSection } from './components/skills/SkillsSection'

function App() {
  return <main className="hero-page"><HeroSection /><AboutSection /><EducationSection /><ExperienceSection /><SelectedWorkSection /><SkillsSection /><ContactSection /></main>
}

export default App
