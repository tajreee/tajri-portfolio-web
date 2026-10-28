import {
  GithubLogo,
  InstagramLogo,
  LinkedinLogo,
  Pause,
  Play,
} from '@phosphor-icons/react'
import { useState } from 'react'
import { motion } from 'motion/react'
import { socialLinks } from '../../data/portfolio'
import { Marquee } from '../common/Marquee'
import { useReducedMotion } from '../common/useReducedMotion'

export function HeroSection() {
  const [portraitFailed, setPortraitFailed] = useState(false)
  const [marqueePaused, setMarqueePaused] = useState(false)
  const reduceMotion = useReducedMotion()
  return (
    <section
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
        <Marquee paused={marqueePaused} />
      </div>
      <div className="marquee-layer marquee-layer-bottom">
        <Marquee reverse paused={marqueePaused} />
      </div>
      <div className="portrait-wrap">
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
    </section>
  )
}
