import { useEffect, useState } from 'react'

const portraitStyles = [
  { label: 'THE BUILDER', note: 'BACKEND / FRONTEND', image: '/assets/about-portrait-builder.jpg' },
  { label: 'THE EXPLAINER', note: 'TEACHING / COLLABORATION', image: '/assets/about-portrait-explainer.jpg' },
  { label: 'THE OBSERVER', note: 'SYSTEMS / DETAILS', image: '/assets/about-portrait-observer.jpg' },
]

function PortraitFrame({ image, label }: { image: string; label: string }) {
  const [failed, setFailed] = useState(false)
  return <div className={`about-portrait-frame ${failed ? 'about-portrait-missing' : ''}`}>
    {!failed && <img src={image} alt={`${label} portrait of Tajri Mintahtihal Anhaar`} onError={() => setFailed(true)} />}
    {failed && <><strong>TA</strong><span>ADD<br />PORTRAIT</span></>}
  </div>
}

export function AboutSection() {
  const [activeStyle, setActiveStyle] = useState(0)
  const style = portraitStyles[activeStyle]

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveStyle(current => (current + 1) % portraitStyles.length)
    }, 3000)

    return () => window.clearInterval(interval)
  }, [])

  return <section className="about-section" id="about">
    <div className="about-grain" aria-hidden="true" />
    <div className="about-shell">
      <div className="about-heading"><span>02 / ABOUT ME</span><span className="about-heading-line" /><span>THREE WAYS TO READ THE PERSON</span></div>
      <div className="about-layout">
        <div className="about-portrait-column">
          <div className="about-portrait-board">
            <div className="about-pin about-pin-left" /><div className="about-pin about-pin-right" />
            <PortraitFrame image={style.image} label={style.label} />
            <div className="about-portrait-caption"><span>{style.label}</span><span>{style.note}</span></div>
          </div>
          <div className="portrait-switcher" role="tablist" aria-label="Portrait styles">{portraitStyles.map((portrait, index) => <button key={portrait.label} className={activeStyle === index ? 'is-active' : ''} onClick={() => setActiveStyle(index)} role="tab" aria-selected={activeStyle === index}><span>0{index + 1}</span>{portrait.label}</button>)}</div>
        </div>
        <article className="about-content-paper">
          <div className="about-content-top"><span>PROFILE NOTE / {String(activeStyle + 1).padStart(2, '0')}</span><span>TAJRI ANHAAR</span></div>
          <h2>Engineer by training.<br /><em>Builder by habit.</em></h2>
          <div className="about-content-body"><p>Saya menulis kode di dua sisi: backend untuk membangun endpoint REST, skema basis data, dan aturan akses; frontend untuk memastikan data sampai ke pengguna dengan kontrak yang jelas.</p><p>Bagi saya, fitur belum selesai ketika hanya berhasil di mesin sendiri. Saya menyiapkan migrasi, data uji, dokumentasi API, dan jalur rilis agar pekerjaan dapat dibaca dan dilanjutkan oleh orang berikutnya.</p></div>
          <div className="about-principle-line"><span>HOW I WORK</span><strong>Pahami alurnya dulu, baru menulis kode.</strong></div>
          <div className="about-facts"><div><strong>3.77</strong><span>GPA / CUM LAUDE</span></div><div><strong>5</strong><span>MONTHS INDUSTRY EXPERIENCE</span></div><div><strong>40+</strong><span>REST ENDPOINTS</span></div></div>
          <div className="about-content-footer"><span>THE PERSON BEHIND THE SYSTEM</span><span>↘</span></div>
        </article>
      </div>
    </div>
  </section>
}
