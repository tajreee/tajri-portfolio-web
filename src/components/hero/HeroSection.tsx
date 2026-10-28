import { GithubLogo, InstagramLogo, LinkedinLogo } from '@phosphor-icons/react'
import { useState } from 'react'
import { socialLinks } from '../../data/portfolio'
import { Marquee } from '../common/Marquee'

export function HeroSection() {
  const [portraitFailed, setPortraitFailed] = useState(false)
  return <section className="hero-poster" aria-label="Tajri Anhaar portfolio introduction">
    <div className="paper-grain" aria-hidden="true" /><div className="torn-edge torn-edge-top" aria-hidden="true" /><div className="torn-edge torn-edge-bottom" aria-hidden="true" />
    <div className="hero-corner hero-corner-left"><span className="corner-label">ROLE</span><strong>FULL STACK<br />DEVELOPER</strong><small>BASED IN JAKARTA, ID</small></div>
    <div className="hero-corner hero-corner-right"><span className="corner-label">CONNECT</span><div className="social-links"><a href={socialLinks.instagram} target="_blank" rel="noreferrer" aria-label="Instagram"><InstagramLogo weight="regular" /></a><a href={socialLinks.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><LinkedinLogo weight="regular" /></a><a href={socialLinks.github} target="_blank" rel="noreferrer" aria-label="GitHub"><GithubLogo weight="regular" /></a></div></div>
    <div className="hero-caption hero-caption-left">PORTFOLIO / 2026</div><div className="hero-caption hero-caption-right">SCROLL TO EXPLORE</div><div className="marquee-layer marquee-layer-top"><Marquee /></div><div className="marquee-layer marquee-layer-bottom"><Marquee reverse /></div>
    <div className="portrait-wrap"><div className="portrait-shadow" aria-hidden="true" /><div className={`portrait ${portraitFailed ? 'portrait-missing' : ''}`}>{!portraitFailed && <img src="/assets/tajri-portrait.jpg" alt="Close-up portrait of Tajri Mintahtihal Anhaar" onError={() => setPortraitFailed(true)} />}{portraitFailed && <><strong>TA</strong><span>ADD<br />PORTRAIT</span></>}</div><div className="portrait-tape" aria-hidden="true" /></div>
    <div className="hero-name"><span>TAJRI</span><span>ANHAAR</span></div><p className="hero-note">Kode yang bisa diuji,<br />dibaca, dan dilanjutkan.</p>
  </section>
}
