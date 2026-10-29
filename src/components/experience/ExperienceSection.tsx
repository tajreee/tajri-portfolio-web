import { useRef, useState } from 'react'
import { motion, useInView, useScroll, useSpring } from 'motion/react'
import { InkHeading } from '../common/InkHeading'
import { useReducedMotion } from '../common/useReducedMotion'

const experiences = [
  {
    year: '2025',
    period: 'AUG — DEC 2025',
    duration: '20 WEEKS',
    role: 'FULL STACK DEVELOPER INTERN',
    company: 'PT Indi Teknokreasi Internasional',
    companyShort: 'INDI Technology',
    location: 'Jakarta, Indonesia',
    hours: '770',
    score: '96.3 / 100',
    logo: '/assets/logo-inditech.png',
    bullets: [
      'Mengembangkan 40+ endpoint REST dengan Go dan Django, menyusun skema PostgreSQL, serta merilis dua layanan ke production.',
      'Memimpin backend minigame loyalitas energi selama satu bulan: 10+ endpoint Go, integrasi tiga API partner, dan leaderboard harian serta mingguan.',
      'Membangun 25+ endpoint REST untuk sistem penilaian kinerja dengan 11 peran pengguna, aturan akses berlapis, dan penguncian data setelah finalisasi.',
      'Menulis dokumentasi Swagger/OpenAPI, menyiapkan monitoring Prometheus dan Grafana, serta menjalankan UAT dan end-to-end testing hingga MVP.',
    ],
  },
]

export function ExperienceSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const experience = experiences[activeIndex]
  const timelineRef = useRef<HTMLDivElement>(null)
  const recordRef = useRef<HTMLDivElement>(null)
  const stampRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const recordInView = useInView(recordRef, {
    once: true,
    amount: 0.2,
    margin: '0px 0px -12% 0px',
  })
  const stampInView = useInView(stampRef, {
    once: true,
    amount: 0.35,
    margin: '0px 0px -8% 0px',
  })
  const stampLanded = reduceMotion || stampInView
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start 75%', 'end 75%'],
  })
  const axisProgress = useSpring(scrollYProgress, {
    stiffness: 160,
    damping: 30,
    mass: 0.35,
  })

  return (
    <section className="experience-section" id="experience">
      <div className="experience-grain" aria-hidden="true" />
      <div className="experience-shell">
        <div className="experience-heading">
          <span>04 / PROFESSIONAL EXPERIENCE</span>
          <span className="experience-heading-line" />
          <span>WORK LOG / {String(activeIndex + 1).padStart(2, '0')}</span>
        </div>
        <div className="experience-intro">
          <InkHeading first="Inside the" second="release cycle." />
          <p>
            Pengalaman profesional tempat saya belajar bahwa engineering bukan
            hanya tentang menulis fitur, tetapi juga merawat alur sampai rilis.
          </p>
        </div>
        <div className="experience-timeline" ref={timelineRef}>
          <div className="experience-axis">
            <motion.span
              className="experience-axis-line"
              style={{ scaleY: reduceMotion ? 1 : axisProgress }}
            />
            <span className="experience-axis-dot" />
            <span className="experience-axis-end">NOW</span>
          </div>
          <div className="experience-entry">
            <div className="experience-date">
              <strong>{experience.year}</strong>
              <span>{experience.period}</span>
            </div>
            <motion.div
              className="record-arrival"
              initial={false}
              animate={{ x: reduceMotion || recordInView ? 0 : 32 }}
              transition={{
                duration: reduceMotion ? 0 : 0.7,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <article className="experience-paper">
                <div className="experience-paper-top" ref={recordRef}>
                  <span>{experience.duration} / INTERNSHIP</span>
                  <span>{experience.location}</span>
                </div>
                <div className="experience-paper-main">
                  <div className="experience-company-mark">
                    <img
                      src={experience.logo}
                      alt={`${experience.companyShort} logo`}
                      onError={(event) => {
                        event.currentTarget.style.display = 'none'
                      }}
                    />
                    <span>INDI</span>
                  </div>
                  <div className="experience-title">
                    <span className="experience-kicker">{experience.role}</span>
                    <h3>{experience.company}</h3>
                    <p>
                      {experience.companyShort} · Software engineering
                      internship
                    </p>
                  </div>
                  <motion.div
                    className="experience-stamp"
                    ref={stampRef}
                    initial={false}
                    animate={{
                      y: stampLanded ? 0 : -18,
                      scale: stampLanded ? 1 : 1.15,
                      rotate: stampLanded ? 0 : 5,
                      opacity: stampLanded ? 1 : 0.6,
                    }}
                    transition={{
                      duration: reduceMotion ? 0 : 0.5,
                      ease: [0.55, 0, 1, 0.45],
                    }}
                  >
                    <strong>{experience.score}</strong>
                    <span>
                      INTERNSHIP
                      <br />
                      EVALUATION
                    </span>
                  </motion.div>
                </div>
                <div className="experience-metrics">
                  <div>
                    <span>LOGGED HOURS</span>
                    <strong>{experience.hours}</strong>
                  </div>
                  <div>
                    <span>REST ENDPOINTS</span>
                    <strong>40+</strong>
                  </div>
                  <div>
                    <span>CLIENT PROJECTS</span>
                    <strong>03</strong>
                  </div>
                  <div>
                    <span>RELEASED SERVICES</span>
                    <strong>02</strong>
                  </div>
                </div>
                <div className="experience-contributions">
                  <span className="experience-kicker">WHAT I WORKED ON</span>
                  <ul>
                    {experience.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                </div>
                <div className="experience-paper-footer">
                  <span>
                    FROM WORK LOGS / INTERNSHIP RECORD / TECHNICAL NOTES
                  </span>
                  <span>04</span>
                </div>
              </article>
            </motion.div>
          </div>
        </div>
        <div
          className="experience-tabs"
          role="group"
          aria-label="Professional experiences"
        >
          {experiences.map((item, index) => (
            <button
              key={item.company}
              type="button"
              className={activeIndex === index ? 'is-active' : ''}
              onClick={() => setActiveIndex(index)}
              aria-pressed={activeIndex === index}
            >
              <span>0{index + 1}</span>
              {item.companyShort}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
