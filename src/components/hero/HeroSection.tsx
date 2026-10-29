import {
  GithubLogo,
  InstagramLogo,
  LinkedinLogo,
  Pause,
  Play,
  ArrowDown,
} from '@phosphor-icons/react'
import { useRef, useState } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'motion/react'
import { socialLinks } from '../../data/portfolio'
import { Marquee } from '../common/Marquee'
import { useReducedMotion } from '../common/useReducedMotion'

export function HeroSection() {
  const [portraitFailed, setPortraitFailed] = useState(false)
  const [marqueePaused, setMarqueePaused] = useState(false)
  const reduceMotion = useReducedMotion()
  const posterRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: posterRef,
    offset: ['start start', 'end start'],
  })
  const progress = useSpring(scrollYProgress, { stiffness: 110, damping: 28 })
  const portraitY = useTransform(progress, [0, 1], [0, 110])
  const portraitRotation = useTransform(progress, [0, 1], [0, -6])
  const topTypeY = useTransform(progress, [0, 1], [0, -95])
  const bottomTypeY = useTransform(progress, [0, 1], [0, 65])
  return (
    <section
      ref={posterRef}
      className="hero-poster"
      aria-label="Tajri Anhaar portfolio introduction"
    >
      <div className="paper-grain" aria-hidden="true" />
      <div className="torn-edge torn-edge-top" aria-hidden="true" />
      <div className="torn-edge torn-edge-bottom" aria-hidden="true" />
      <div className="hero-corner hero-corner-left">
        <span className="corner-label">ROLE</span>
        <strong>
          FULL STACK
          <br />
          DEVELOPER
        </strong>
        <small>BASED IN JAKARTA, ID</small>
      </div>
      <div className="hero-corner hero-corner-right">
        <span className="corner-label">CONNECT</span>
        <div className="social-links">
          <a
            href={socialLinks.instagram}
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
          >
            <InstagramLogo weight="regular" />
          </a>
          <a
            href={socialLinks.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
          >
            <LinkedinLogo weight="regular" />
          </a>
          <a
            href={socialLinks.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
          >
            <GithubLogo weight="regular" />
          </a>
        </div>
      </div>
      <div className="hero-caption hero-caption-left">PORTFOLIO / 2026</div>
      {!reduceMotion && (
        <button
          type="button"
          className="hero-caption hero-caption-right hero-motion-toggle"
          aria-label={
            marqueePaused
              ? 'Play background animation'
              : 'Pause background animation'
          }
          aria-pressed={marqueePaused}
          onClick={() => setMarqueePaused((current) => !current)}
        >
          {marqueePaused ? <Play size={12} /> : <Pause size={12} />}
          {marqueePaused ? 'PLAY MOTION' : 'PAUSE MOTION'}
        </button>
      )}
      <div className="marquee-layer marquee-layer-top">
        <motion.div
          className="hero-type-drift"
          style={{ y: reduceMotion ? 0 : topTypeY }}
        >
          <Marquee paused={marqueePaused} />
        </motion.div>
      </div>
      <div className="marquee-layer marquee-layer-bottom">
        <motion.div
          className="hero-type-drift"
          style={{ y: reduceMotion ? 0 : bottomTypeY }}
        >
          <Marquee reverse paused={marqueePaused} />
        </motion.div>
      </div>
      <div className="portrait-wrap">
        <motion.div
          className="hero-portrait-depth"
          style={{
            y: reduceMotion ? 0 : portraitY,
            rotate: reduceMotion ? 0 : portraitRotation,
          }}
        >
          <div className="portrait-shadow" aria-hidden="true" />
          <motion.div
            className={`portrait ${portraitFailed ? 'portrait-missing' : ''}`}
            initial={reduceMotion ? false : { y: 28, rotate: -4 }}
            animate={{ y: 0, rotate: 0 }}
            transition={{ duration: 0.75 }}
          >
            {!portraitFailed && (
              <img
                src="/assets/tajri-portrait.jpg"
                alt="Close-up portrait of Tajri Mintahtihal Anhaar"
                onError={() => setPortraitFailed(true)}
              />
            )}
            {portraitFailed && (
              <>
                <strong>TA</strong>
                <span>
                  ADD
                  <br />
                  PORTRAIT
                </span>
              </>
            )}
          </motion.div>
          <motion.div
            className="portrait-tape"
            aria-hidden="true"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: reduceMotion ? 0 : 0.4, duration: 0.2 }}
          />
        </motion.div>
      </div>
      <h1 className="hero-name">
        <motion.span
          initial={reduceMotion ? false : { y: 10 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
        >
          TAJRI
        </motion.span>
        <motion.span
          initial={reduceMotion ? false : { y: 10 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.22, duration: 0.5 }}
        >
          ANHAAR
        </motion.span>
      </h1>
      <p className="hero-note">
        Kode yang bisa diuji,
        <br />
        dibaca, dan dilanjutkan.
      </p>
      <motion.a
        className="hero-scroll-cue"
        href="#about"
        aria-label="Explore about Tajri"
        whileHover={reduceMotion ? undefined : { y: 4 }}
        whileTap={reduceMotion ? undefined : { scale: 0.96 }}
      >
        <span>EXPLORE</span>
        <ArrowDown size={18} />
      </motion.a>
    </section>
  )
}
