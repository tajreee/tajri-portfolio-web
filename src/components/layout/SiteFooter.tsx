import { ArrowUp, ArrowUpRight } from '@phosphor-icons/react'
import { contactEmail, sectionLinks, socialLinks } from '../../data/portfolio'

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-shell">
        <div className="site-footer-grid">
          <div className="site-footer-identity">
            <h2 className="site-footer-name">
              Tajri Anhaar<span aria-hidden="true">.</span>
            </h2>
            <p className="site-footer-note">
              Kode yang bisa diuji, dibaca, dan dilanjutkan.
            </p>
            <p className="site-footer-role">Full Stack Developer</p>
          </div>
          <nav
            className="site-footer-navigation"
            aria-label="Footer navigation"
          >
            <h3>Explore</h3>
            <div className="site-footer-links">
              {sectionLinks.map((link) => (
                <a key={link.id} href={`#${link.id}`}>
                  {link.label}
                </a>
              ))}
            </div>
          </nav>
          <div className="site-footer-contact">
            <h3>Contact</h3>
            <a className="site-footer-email" href={`mailto:${contactEmail}`}>
              {contactEmail}
              <ArrowUpRight size={18} aria-hidden="true" />
            </a>
            <a
              className="site-footer-social"
              href={socialLinks.linkedin}
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
              <ArrowUpRight size={18} aria-hidden="true" />
            </a>
            <p className="site-footer-location">Jakarta, Indonesia</p>
          </div>
        </div>
        <div className="site-footer-bottom">
          <small>&copy; {new Date().getFullYear()} Tajri Anhaar</small>
          <a className="site-back-to-top" href="#home">
            Back to top
            <ArrowUp size={18} aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  )
}
