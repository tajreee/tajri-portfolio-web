import { useEffect, useRef, useState } from 'react'
import { ArrowDownRight, ArrowUpRight, List, X } from '@phosphor-icons/react'
import { LayoutGroup, motion } from 'motion/react'
import { sectionLinks } from '../../data/portfolio'
import { useReducedMotion } from '../common/useReducedMotion'

export function SiteHeader() {
  const [activeSection, setActiveSection] = useState('home')
  const [menuOpen, setMenuOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  const brandRef = useRef<HTMLAnchorElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const indexRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const sections = ['home', ...sectionLinks.map((link) => link.id)]
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null)
    let observer: IntersectionObserver | undefined

    const observe = () => {
      observer?.disconnect()
      const top = Math.min(
        innerHeight - 2,
        Math.ceil(headerRef.current!.getBoundingClientRect().height) + 20,
      )
      // A narrow reading line handles tall sections without scroll-frame state updates.
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) setActiveSection(entry.target.id)
          }
        },
        { rootMargin: `-${top}px 0px -${innerHeight - top - 2}px 0px` },
      )
      sections.forEach((section) => observer!.observe(section))
      const current = [...sections]
        .reverse()
        .find((section) => section.getBoundingClientRect().top <= top)
      setActiveSection(current?.id || 'home')
    }

    const initialTarget = sections.find(
      (section) => `#${section.id}` === location.hash,
    )
    if (initialTarget)
      initialTarget.scrollIntoView({ behavior: 'instant', block: 'start' })
    observe()
    window.addEventListener('resize', observe)
    return () => {
      observer?.disconnect()
      window.removeEventListener('resize', observe)
    }
  }, [])

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1041px)')
    const closeOnDesktop = () => {
      if (!desktop.matches) return
      if (
        indexRef.current?.contains(document.activeElement) ||
        toggleRef.current === document.activeElement
      ) {
        brandRef.current?.focus({ preventScroll: true })
      }
      setMenuOpen(false)
    }
    desktop.addEventListener('change', closeOnDesktop)
    return () => desktop.removeEventListener('change', closeOnDesktop)
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const dismiss = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !headerRef.current?.contains(event.target)
      )
        setMenuOpen(false)
    }
    const dismissWithEscape = (event: KeyboardEvent) => {
      if (
        event.key !== 'Escape' ||
        event.defaultPrevented ||
        document.querySelector('dialog[open]')
      )
        return
      event.preventDefault()
      setMenuOpen(false)
      toggleRef.current?.focus()
    }
    document.addEventListener('pointerdown', dismiss)
    document.addEventListener('keydown', dismissWithEscape)
    return () => {
      document.removeEventListener('pointerdown', dismiss)
      document.removeEventListener('keydown', dismissWithEscape)
    }
  }, [menuOpen])

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <header
        ref={headerRef}
        className="site-header"
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget))
            setMenuOpen(false)
        }}
      >
        <div className="site-header-inner">
          <a
            ref={brandRef}
            className="site-brand"
            href="#home"
            aria-label="Tajri Anhaar, back to home"
            aria-current={activeSection === 'home' ? 'location' : undefined}
            onClick={() => setMenuOpen(false)}
          >
            <span className="site-brand-mark" aria-hidden="true">
              TA<span>.</span>
            </span>
            <span className="site-brand-copy">
              <strong>TAJRI ANHAAR</strong>
              <small>FULL STACK DEVELOPER</small>
            </span>
          </a>
          <LayoutGroup id="primary-navigation">
            <nav className="site-desktop-nav" aria-label="Primary navigation">
              {sectionLinks.map((link) => (
                <a
                  key={link.id}
                  className={`site-nav-link ${link.id === 'contact' ? 'site-nav-contact' : ''}`}
                  href={`#${link.id}`}
                  aria-current={
                    activeSection === link.id ? 'location' : undefined
                  }
                >
                  {link.label}
                  {link.id === 'contact' && (
                    <ArrowUpRight size={16} aria-hidden="true" />
                  )}
                  {activeSection === link.id && (
                    <motion.span
                      className="site-nav-marker"
                      layoutId="current-section"
                      transition={{ duration: reduceMotion ? 0 : 0.24 }}
                    />
                  )}
                </a>
              ))}
            </nav>
          </LayoutGroup>
          <button
            ref={toggleRef}
            className="site-menu-toggle"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? 'Close' : 'Menu'}
            {menuOpen ? (
              <X size={20} aria-hidden="true" />
            ) : (
              <List size={20} aria-hidden="true" />
            )}
          </button>
        </div>
        <motion.div
          ref={indexRef}
          id="mobile-navigation"
          className="site-mobile-index"
          inert={!menuOpen}
          aria-hidden={!menuOpen}
          initial={false}
          animate={menuOpen ? 'open' : 'closed'}
          variants={{
            open: { opacity: 1, y: 0, visibility: 'visible' },
            closed: {
              opacity: 0,
              y: reduceMotion ? 0 : -8,
              transitionEnd: { visibility: 'hidden' },
            },
          }}
          transition={{ duration: reduceMotion ? 0 : 0.2 }}
          style={{ pointerEvents: menuOpen ? 'auto' : 'none' }}
        >
          <div className="site-index-caption">
            <span>Page Index</span>
            <span>TA / PORTFOLIO</span>
          </div>
          <nav aria-label="Primary navigation">
            {sectionLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                aria-current={
                  activeSection === link.id ? 'location' : undefined
                }
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
                <ArrowDownRight size={18} aria-hidden="true" />
              </a>
            ))}
          </nav>
        </motion.div>
      </header>
    </>
  )
}
