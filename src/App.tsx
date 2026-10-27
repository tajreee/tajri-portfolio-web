import { GithubLogo, InstagramLogo, LinkedinLogo } from '@phosphor-icons/react'
import { useEffect, useRef, useState } from 'react'

const phrases = ['FULL STACK DEVELOPER', 'TAJRI ANHAAR', 'CODE / SYSTEMS / STORIES']

const projects = [
  {
    id: 'ekatalog', number: '01', title: 'E-Katalog UMKM', type: 'FULL STACK', timeline: 'PEKAN 02—06', role: 'FULL STACK', image: '/assets/project-ekatalog.jpg',
    summary: 'Katalog digital untuk UMKM pesisir dengan image handling dan analitik pengunjung per kota.',
    detail: 'Saya membangun 8+ endpoint REST untuk kategori produk, produk, dan toko UMKM. Model abstrak dengan kompresi gambar dipakai lintas modul agar aturannya konsisten. Saya menambahkan single input dengan batas lima file, pagination per app ketika data bertambah, mengganti dimensi analytics dari country menjadi city, dan menulis dokumentasi API untuk Autentikasi, Document, Event, FAQ, serta Katalog.',
    stack: [{ name: 'Django', icon: 'https://cdn.simpleicons.org/django/55564f' }, { name: 'DRF', icon: 'https://cdn.simpleicons.org/djangorestframework/55564f' }, { name: 'PostgreSQL', icon: 'https://cdn.simpleicons.org/postgresql/55564f' }, { name: 'Google Analytics', icon: 'https://cdn.simpleicons.org/googleanalytics/55564f' }],
  },
  {
    id: 'minigame', number: '02', title: 'Minigame Energi', type: 'LEAD BACKEND', timeline: '01 BULAN', role: 'LEAD BACKEND', image: '/assets/project-minigame-energi.jpg',
    summary: 'Backend permainan loyalitas dengan transaksi aman, leaderboard, dan release flow yang terkendali.',
    detail: 'Saya memimpin backend selama satu bulan dengan 10+ endpoint Go dan Clean Architecture. Pembuatan profil user dibungkus database transaction dan unique constraint untuk mencegah duplikasi. Ambang poin dipindah ke kolom database dan seeder agar dapat berubah tanpa deploy ulang. Saya juga menangani tie-breaker berdasarkan waktu pencapaian, response Game Mode, sinkronisasi timezone, serta graceful shutdown saat rilis.',
    stack: [{ name: 'Golang', icon: 'https://cdn.simpleicons.org/go/55564f' }, { name: 'PostgreSQL', icon: 'https://cdn.simpleicons.org/postgresql/55564f' }, { name: 'JWT', icon: 'https://cdn.simpleicons.org/jsonwebtokens/55564f' }, { name: 'Clean Architecture', icon: '' }],
  },
  {
    id: 'merit', number: '03', title: 'Penilaian Merit', type: 'BACKEND', timeline: '20 PEKAN', role: 'BACKEND DEVELOPER', image: '/assets/project-penilaian-merit.jpg',
    summary: 'Sistem penilaian kinerja dengan 11 peran, data terkunci, dan output dashboard serta PDF yang konsisten.',
    detail: 'Saya menangani 25+ endpoint untuk 11 peran pengguna, termasuk status Hold khusus verifikator. Saya membuat rute finalisasi dan menonaktifkan menu edit ketika periode dikunci. Satu fungsi pembulatan float64 dipakai dashboard dan PDF agar tidak berselisih. Saya juga menggunakan preload skor dan inner join untuk mengurangi query berulang, serta membuat seeder untuk 5 Aspect, 15+ Sub Aspect, 40+ Indicator, dan 80+ Queue Indicator. Untuk PDF, engine diganti ke chromedp agar gambar dan layout kompleks konsisten.',
    stack: [{ name: 'Golang', icon: 'https://cdn.simpleicons.org/go/55564f' }, { name: 'PostgreSQL', icon: 'https://cdn.simpleicons.org/postgresql/55564f' }, { name: 'JSONB', icon: 'https://cdn.simpleicons.org/postgresql/55564f' }, { name: 'chromedp', icon: '' }],
  },
]

const skillGroups = [
  { name: 'LANGUAGES', skills: [{ name: 'Go', icon: 'go', used: 'Minigame Energi · Penilaian Merit' }, { name: 'Python', icon: 'python', used: 'E-Katalog UMKM' }, { name: 'PHP', icon: 'php', used: 'INDI CRM' }, { name: 'TypeScript', icon: 'typescript', used: 'AstroJS · web' }, { name: 'SQL', icon: 'postgresql', used: 'Tiga proyek magang' }] },
  { name: 'FRAMEWORKS', skills: [{ name: 'Django', icon: 'django', used: 'E-Katalog UMKM' }, { name: 'Laravel', icon: 'laravel', used: 'E-Ticketing' }, { name: 'Astro', icon: 'astro', used: 'Portfolio web' }, { name: 'Spring Boot', icon: 'springboot', used: 'Proyek kampus' }, { name: 'Next.js', icon: 'nextdotjs', used: 'Proyek kampus' }] },
  { name: 'DATA & API', skills: [{ name: 'PostgreSQL', icon: 'postgresql', used: 'Tiga proyek magang' }, { name: 'MySQL', icon: 'mysql', used: 'Proyek kampus' }, { name: 'Redis', icon: 'redis', used: 'Cache' }, { name: 'REST API', icon: 'fastapi', used: 'Tiga proyek magang' }, { name: 'OpenAPI', icon: 'swagger', used: 'Dokumentasi Merit' }] },
  { name: 'PRACTICE & TOOLS', skills: [{ name: 'Docker', icon: 'docker', used: 'Rilis layanan' }, { name: 'Git', icon: 'git', used: 'Harian' }, { name: 'Prometheus', icon: 'prometheus', used: 'Monitoring Merit' }, { name: 'Grafana', icon: 'grafana', used: 'Monitoring Merit' }, { name: 'Figma', icon: 'figma', used: 'Design system' }] },
]

function Marquee({ reverse = false }: { reverse?: boolean }) {
  const items = [...phrases, ...phrases]
  return (
    <div className={`marquee ${reverse ? 'marquee-reverse' : ''}`} aria-hidden="true">
      <div className="marquee-track">
        {items.map((phrase, index) => (
          <span key={`${phrase}-${index}`}>
            {phrase}
            <i>✳</i>
          </span>
        ))}
      </div>
    </div>
  )
}

function ProjectImage({ project }: { project: typeof projects[number] }) {
  const [failed, setFailed] = useState(false)
  return <div className={`project-image ${failed ? 'project-image-missing' : ''}`}>
    {!failed && <img src={project.image} alt={`Preview ${project.title}`} onError={() => setFailed(true)} />}
    {failed && <><span>{project.number}</span><strong>{project.title}</strong><small>PROJECT IMAGE</small></>}
  </div>
}

function StackStrip({ stack }: { stack: typeof projects[number]['stack'] }) {
  return <div className="stack-strip">{stack.map(technology => <span className="stack-item" key={technology.name}>{technology.icon ? <img src={technology.icon} alt="" onError={event => { event.currentTarget.style.display = 'none' }} /> : <i>{technology.name.slice(0, 2).toUpperCase()}</i>}<b>{technology.name}</b></span>)}</div>
}

function SelectedWork() {
  const centerIndex = projects.length * 3
  const [activeIndex, setActiveIndex] = useState(centerIndex)
  const [selectedProject, setSelectedProject] = useState<typeof projects[number] | null>(null)
  const [dragStart, setDragStart] = useState<number | null>(null)
  const [dragOffset, setDragOffset] = useState(0)
  const [transitionEnabled, setTransitionEnabled] = useState(true)
  const [slideStep, setSlideStep] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)
  const repeatedProjects = Array.from({ length: 7 }, () => projects).flat()
  const move = (direction: number) => setActiveIndex(index => index + direction)
  const handlePointerDown = (event: React.PointerEvent) => { setDragStart(event.clientX); event.currentTarget.setPointerCapture(event.pointerId) }
  const handlePointerMove = (event: React.PointerEvent) => { if (dragStart !== null) setDragOffset(event.clientX - dragStart) }
  const handlePointerUp = () => {
    if (Math.abs(dragOffset) > 30 && slideStep > 0) {
      const steps = Math.max(1, Math.min(projects.length + 1, Math.round(Math.abs(dragOffset) / slideStep)))
      setActiveIndex(index => index + (dragOffset < 0 ? steps : -steps))
    }
    setDragStart(null)
    setDragOffset(0)
  }
  const normalizeLoop = () => {
    const lowerLoopBoundary = projects.length * 2
    const upperLoopBoundary = projects.length * 4
    if (activeIndex < lowerLoopBoundary || activeIndex >= upperLoopBoundary) {
      const normalizedIndex = activeIndex < lowerLoopBoundary ? activeIndex + projects.length : activeIndex - projects.length
      setTransitionEnabled(false)
      setActiveIndex(normalizedIndex)
      window.requestAnimationFrame(() => window.requestAnimationFrame(() => setTransitionEnabled(true)))
    }
  }
  useEffect(() => {
    const measure = () => {
      const firstSheet = trackRef.current?.firstElementChild as HTMLElement | null
      if (!firstSheet) return
      const styles = window.getComputedStyle(trackRef.current!)
      setSlideStep(firstSheet.getBoundingClientRect().width + parseFloat(styles.columnGap || styles.gap || '0'))
    }
    measure()
    const observer = new ResizeObserver(measure)
    if (trackRef.current) observer.observe(trackRef.current)
    window.addEventListener('resize', measure)
    return () => { observer.disconnect(); window.removeEventListener('resize', measure) }
  }, [])
  return <section className="work-section" id="work">
    <div className="work-grain" aria-hidden="true" />
    <div className="work-shell">
      <div className="work-heading"><span>03 / SELECTED WORK</span><span className="work-heading-line" /><span>CLICK A SHEET TO OPEN</span></div>
      <div className="work-intro"><h2>Projects that held<br /><em>under pressure.</em></h2><p>Potongan dari tiga proyek magang: masalah nyata, keputusan teknis, dan pekerjaan yang berhasil sampai ke rilis.</p></div>
      <div className="hanging-track-window" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerCancel={handlePointerUp}>
        <div className="clothesline" aria-hidden="true"><span className="clothesline-knot clothesline-knot-left" /><span className="clothesline-knot clothesline-knot-right" /></div>
        <div ref={trackRef} className={`hanging-track ${transitionEnabled ? '' : 'track-no-transition'}`} style={{ transform: `translateX(${dragOffset - activeIndex * slideStep}px)` }} onTransitionEnd={normalizeLoop}>
          {repeatedProjects.map((project, index) => <article className={`hanging-sheet sheet-${project.id}`} key={`${project.id}-${index}`} onClick={() => dragOffset === 0 && setSelectedProject(project)}>
            <div className="sheet-string" /><div className="sheet-hook">●</div>
            <div className="sheet-paper"><div className="sheet-top"><span>{project.number} / CASE FILE</span><span>{project.type}</span></div><ProjectImage project={project} /><h3>{project.title}</h3><p>{project.summary}</p><div className="sheet-meta"><span><b>TIMELINE</b>{project.timeline}</span><span><b>ROLE</b>{project.role}</span></div><div className="sheet-footer"><button className="sheet-open-button" onPointerDown={event => event.stopPropagation()} onClick={event => { event.stopPropagation(); setSelectedProject(project) }}>OPEN DETAIL <span>↗</span></button><span>TA / 26</span></div></div>
          </article>)}
        </div>
      </div>
      <div className="work-controls"><button onClick={() => move(-1)} aria-label="Previous project">←</button><span>DRAG / SWIPE / CLICK</span><button onClick={() => move(1)} aria-label="Next project">→</button></div>
    </div>
    {selectedProject && <div className="project-modal-backdrop" role="presentation" onClick={() => setSelectedProject(null)}><article className="project-modal project-modal-landscape" role="dialog" aria-modal="true" aria-labelledby="project-modal-title" onClick={event => event.stopPropagation()}><button className="modal-close" onClick={() => setSelectedProject(null)} aria-label="Close project detail">×</button><div className="modal-top"><span>{selectedProject.number} / CASE FILE</span><span>{selectedProject.type}</span></div><div className="modal-layout"><div className="modal-heading"><h2 id="project-modal-title">{selectedProject.title}</h2><p className="modal-summary">{selectedProject.summary}</p><div className="modal-facts"><span><b>TIMELINE</b>{selectedProject.timeline}</span><span><b>ROLE</b>{selectedProject.role}</span></div></div><div className="modal-detail-column"><p className="modal-detail">{selectedProject.detail}</p><div><span className="stack-label">STACK / SUPPORTING MARKS</span><StackStrip stack={selectedProject.stack} /></div></div></div></article></div>}
  </section>
}

function SkillMark({ icon, name }: { icon: string; name: string }) {
  const [failed, setFailed] = useState(false)
  return failed ? <span className="skill-fallback-mark">{name.slice(0, 2).toUpperCase()}</span> : <img src={`https://cdn.simpleicons.org/${icon}/55564f`} alt="" onError={() => setFailed(true)} />
}

function SkillsSection() {
  const [activeCategory, setActiveCategory] = useState('ALL')
  const visibleGroups = activeCategory === 'ALL' ? skillGroups : skillGroups.filter(group => group.name === activeCategory)
  return <section className="skills-section" id="skills">
    <div className="skills-grain" aria-hidden="true" />
    <div className="skills-shell">
      <div className="skills-heading"><span>04 / SKILLS</span><span className="skills-heading-line" /><span>TOOLS WITH A PLACE TO GO</span></div>
      <div className="skills-intro"><h2>A working vocabulary<br /><em>for real systems.</em></h2><p>Bukan daftar teknologi yang berdiri sendiri. Setiap skill di sini terhubung ke proyek, keputusan, atau kebiasaan kerja yang pernah saya gunakan.</p></div>
      <div className="skill-filters"><button className={activeCategory === 'ALL' ? 'is-active' : ''} onClick={() => setActiveCategory('ALL')}>ALL</button>{skillGroups.map(group => <button className={activeCategory === group.name ? 'is-active' : ''} key={group.name} onClick={() => setActiveCategory(group.name)}>{group.name}</button>)}</div>
      <div className="skill-groups">{visibleGroups.map((group, groupIndex) => <div className="skill-group" key={group.name}><div className="skill-group-label"><span>0{groupIndex + 1}</span><strong>{group.name}</strong></div><div className="skill-grid">{group.skills.map((skill, index) => <article className="skill-card" key={skill.name} style={{ '--skill-delay': `${index * 45}ms` } as React.CSSProperties}><div className="skill-card-top"><span>{String(index + 1).padStart(2, '0')}</span><span>ACTIVE</span></div><div className="skill-icon"><SkillMark icon={skill.icon} name={skill.name} /></div><h3>{skill.name}</h3><p>{skill.used}</p><span className="skill-card-arrow">↗</span></article>)}</div></div>)}</div>
    </div>
  </section>
}

function ContactSection() {
  const [form, setForm] = useState({ dear: 'Tajri', subject: '', senderName: '', from: '', via: 'Portfolio website', body: '' })
  const [status, setStatus] = useState('')
  const [signatureOpen, setSignatureOpen] = useState(false)
  const [signature, setSignature] = useState('')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawingRef = useRef(false)
  const today = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date())

  const update = (field: keyof typeof form, value: string) => setForm(current => ({ ...current, [field]: value }))
  const sendLetter = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!form.subject.trim() || !form.senderName.trim() || !form.from.trim() || !form.body.trim()) {
      setStatus('Please complete your name, subject, email, and message.')
      return
    }
    if (!/^\S+@\S+\.\S+$/.test(form.from.trim())) {
      setStatus('Please enter a valid email address.')
      return
    }
    const message = `Dear ${form.dear.trim() || 'Tajri'},\n\nRE: ${form.subject.trim()}\nFrom: ${form.senderName.trim()} <${form.from.trim()}>\nVia: ${form.via.trim() || 'Portfolio website'}\n\n${form.body.trim()}\n\nSincerely,\n${form.senderName.trim()}${signature ? '\n[Digital signature added in the portfolio letter]' : ''}`
    window.location.href = `mailto:tajrianhaar@gmail.com?subject=${encodeURIComponent(form.subject.trim())}&body=${encodeURIComponent(message)}`
    setStatus('Your email app is opening with the letter prepared.')
  }

  return <section className="contact-section" id="contact">
    <div className="contact-grain" aria-hidden="true" />
    <div className="contact-shell">
      <div className="contact-heading"><span>05 / CONTACT</span><span className="contact-heading-line" /><span>WRITE A LETTER</span></div>
      <div className="letter-board">
        <div className="letter-pin letter-pin-left" /><div className="letter-pin letter-pin-right" />
        <form className="letter-paper" onSubmit={sendLetter}>
          <div className="letter-head"><div><strong>TAJRI ANHAAR</strong><span>FULL STACK DEVELOPER</span></div><div className="letter-address">Jakarta, Indonesia<br />tajrianhaar@gmail.com</div></div>
          <div className="letter-divider" />
          <div className="letter-date">{today}</div>
          <label>Dear <input aria-label="Recipient name" value={form.dear} onChange={event => update('dear', event.target.value)} />,</label>
          <div className="letter-fields"><label><span>RE:</span><input required value={form.subject} onChange={event => update('subject', event.target.value)} placeholder="The subject of your letter" /></label><label><span>FROM NAME:</span><input required value={form.senderName} onChange={event => update('senderName', event.target.value)} placeholder="Your name" /></label><label><span>EMAIL:</span><input required type="email" value={form.from} onChange={event => update('from', event.target.value)} placeholder="your@email.com" /></label><label><span>VIA:</span><input value={form.via} onChange={event => update('via', event.target.value)} placeholder="How did you find me?" /></label></div>
          <label className="letter-body-label"><span>BODY:</span><textarea required value={form.body} onChange={event => update('body', event.target.value)} placeholder="Write your message here..." rows={6} /></label>
          <div className="letter-closing"><p>Sincerely,</p><button type="button" className={`signature-space ${signature ? 'has-signature' : ''}`} onClick={() => setSignatureOpen(true)} aria-label={signature ? 'Edit your signature' : 'Add your signature'}>{signature ? <img className="signature-image" src={signature} alt="Your handwritten signature" /> : <span>SIGN HERE</span>}</button><strong>{form.senderName || 'Your name'}</strong><span>{form.from || 'your@email.com'}</span></div>
          <div className="letter-footer"><span>PRIVATE CORRESPONDENCE / 2026</span><button type="submit">SEND LETTER <b>↗</b></button></div>
          {status && <p className="letter-status" role="status">{status}</p>}
        </form>
      </div>
      <p className="contact-security">This form opens your own email application. No message is stored or sent through a public server.</p>
    </div>
    {signatureOpen && <div className="signature-modal-backdrop" onClick={() => setSignatureOpen(false)}><div className="signature-modal" role="dialog" aria-modal="true" aria-label="Create signature" onClick={event => event.stopPropagation()}><div className="signature-modal-head"><span>DRAW YOUR SIGNATURE</span><button type="button" onClick={() => setSignatureOpen(false)}>×</button></div><p>Use your mouse, trackpad, or finger to sign below.</p><canvas ref={canvasRef} width={620} height={210} className="signature-canvas" onPointerDown={event => { drawingRef.current = true; const context = canvasRef.current?.getContext('2d'); if (!context) return; context.beginPath(); const rect = event.currentTarget.getBoundingClientRect(); context.moveTo((event.clientX - rect.left) * (event.currentTarget.width / rect.width), (event.clientY - rect.top) * (event.currentTarget.height / rect.height)) }} onPointerMove={event => { if (!drawingRef.current) return; const context = canvasRef.current?.getContext('2d'); if (!context) return; const rect = event.currentTarget.getBoundingClientRect(); context.lineTo((event.clientX - rect.left) * (event.currentTarget.width / rect.width), (event.clientY - rect.top) * (event.currentTarget.height / rect.height)); context.stroke() }} onPointerUp={() => { drawingRef.current = false }} onPointerLeave={() => { drawingRef.current = false }} /><div className="signature-modal-actions"><button type="button" onClick={() => { const context = canvasRef.current?.getContext('2d'); context?.clearRect(0, 0, 620, 210) }}>CLEAR</button><button type="button" onClick={() => { if (canvasRef.current) setSignature(canvasRef.current.toDataURL('image/png')); setSignatureOpen(false) }}>USE SIGNATURE</button></div></div></div>}
  </section>
}

function App() {
  const [portraitFailed, setPortraitFailed] = useState(false)

  return (
    <main className="hero-page">
      <section className="hero-poster" aria-label="Tajri Anhaar portfolio introduction">
        <div className="paper-grain" aria-hidden="true" />
        <div className="torn-edge torn-edge-top" aria-hidden="true" />
        <div className="torn-edge torn-edge-bottom" aria-hidden="true" />

        <div className="hero-corner hero-corner-left">
          <span className="corner-label">ROLE</span>
          <strong>FULL STACK<br />DEVELOPER</strong>
          <small>BASED IN JAKARTA, ID</small>
        </div>

        <div className="hero-corner hero-corner-right">
          <span className="corner-label">CONNECT</span>
          <div className="social-links">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><InstagramLogo weight="regular" /></a>
            <a href="https://linkedin.com/in/tajri-ma" target="_blank" rel="noreferrer" aria-label="LinkedIn"><LinkedinLogo weight="regular" /></a>
            <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub"><GithubLogo weight="regular" /></a>
          </div>
        </div>

        <div className="hero-caption hero-caption-left">PORTFOLIO / 2026</div>
        <div className="hero-caption hero-caption-right">SCROLL TO EXPLORE</div>

        <div className="marquee-layer marquee-layer-top"><Marquee /></div>
        <div className="marquee-layer marquee-layer-bottom"><Marquee reverse /></div>

        <div className="portrait-wrap">
          <div className="portrait-shadow" aria-hidden="true" />
          <div className={`portrait ${portraitFailed ? 'portrait-missing' : ''}`}>
            {!portraitFailed && <img src="/assets/tajri-portrait.jpg" alt="Close-up portrait of Tajri Mintahtihal Anhaar" onError={() => setPortraitFailed(true)} />}
            {portraitFailed && <><strong>TA</strong><span>ADD<br />PORTRAIT</span></>}
          </div>
          <div className="portrait-tape" aria-hidden="true" />
        </div>

        <div className="hero-name"><span>TAJRI</span><span>ANHAAR</span></div>
        <p className="hero-note">Kode yang bisa diuji,<br />dibaca, dan dilanjutkan.</p>
      </section>

      <section className="education-section" id="education">
        <div className="education-grain" aria-hidden="true" />
        <div className="education-shell">
          <div className="education-heading"><span>02 / EDUCATION</span><span className="education-heading-line" /><span>UNIVERSITAS INDONESIA</span></div>
          <div className="education-board">
            <div className="board-pin board-pin-left" /><div className="board-pin board-pin-right" />
            <div className="education-paper">
              <div className="paper-topline"><span>ACADEMIC RECORD / 2022—2026</span><span>UI / FASILKOM</span></div>
              <div className="education-main">
                <div className="institution-mark" aria-label="Logo Universitas Indonesia"><img src="/assets/logo-universitas-indonesia.png" alt="Logo Universitas Indonesia" /></div>
                <div className="institution-title"><span className="paper-kicker">SARJANA ILMU KOMPUTER</span><h2>Universitas<br /><em>Indonesia</em></h2><p>Program Studi Sistem Informasi<br />Fakultas Ilmu Komputer</p></div>
                <div className="degree-stamp"><span>S.Kom.</span><small>CUM<br />LAUDE</small></div>
              </div>
              <div className="education-details">
                <div className="education-detail"><span>PERIODE</span><strong>2022 — 2026</strong><small>Lulus 15 Juli 2026</small></div>
                <div className="education-detail"><span>IPK</span><strong>3.77 / 4.00</strong><small>125 SKS · 471,2 mutu</small></div>
                <div className="education-detail"><span>PERAN AKADEMIK</span><strong>Asisten Dosen</strong><small>Matematika Diskrit 2 · 2024 & 2025</small></div>
              </div>
              <div className="education-lower">
                <div className="relevant-courses"><span className="paper-kicker">RELEVANT COURSES / ALL A</span><div className="course-list"><span>Basis Data <b>95,82</b></span><span>Arsitektur & Pemrograman Aplikasi Perusahaan <b>86,52</b></span><span>Analisis & Perancangan Sistem Informasi <b>87,53</b></span><span>Pengantar Keamanan Perangkat Lunak <b>98,56</b></span><span>Proyek Pengembangan Sistem Informasi <b>98,91</b></span></div></div>
                <div className="thesis-note"><span className="paper-kicker">FINAL PROJECT</span><h3>Design System untuk Direktorat Transformasi Digital UI</h3><p>Audit komponen, token warna dan tipografi, sampai panduan pemakaian.</p><span className="thesis-arrow">↗</span></div>
              </div>
              <div className="paper-footer"><span>SELECTED FROM 85 APPLICANTS / TAUGHT 350+ STUDENTS</span><span>02</span></div>
            </div>
          </div>
        </div>
      </section>
      <SelectedWork />
      <SkillsSection />
      <ContactSection />
    </main>
  )
}

export default App
