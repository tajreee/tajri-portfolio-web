import { useRef } from 'react'
import { motion, useInView } from 'motion/react'
import { InkHeading } from '../common/InkHeading'
import { useReducedMotion } from '../common/useReducedMotion'

export function EducationSection() {
  const recordRef = useRef<HTMLDivElement>(null)
  const stampRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  // Observe the short record header, not the full mobile-height board.
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

  return (
    <section className="education-section" id="education" tabIndex={-1}>
      <div className="education-grain" aria-hidden="true" />
      <div className="education-shell">
        <div className="education-heading">
          <span>02 / EDUCATION</span>
          <span className="education-heading-line" />
          <span>UNIVERSITAS INDONESIA</span>
        </div>
        <motion.div
          className="record-arrival"
          initial={false}
          animate={{ y: reduceMotion || recordInView ? 0 : 24 }}
          transition={{
            duration: reduceMotion ? 0 : 0.7,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <div className="education-board">
            <div className="board-pin board-pin-left" />
            <div className="board-pin board-pin-right" />
            <div className="education-paper">
              <div className="paper-topline" ref={recordRef}>
                <span>ACADEMIC RECORD / 2022—2026</span>
                <span>UI / FASILKOM</span>
              </div>
              <div className="education-main">
                <div
                  className="institution-mark"
                  aria-label="Logo Universitas Indonesia"
                >
                  <img
                    src="/assets/logo-universitas-indonesia.png"
                    alt="Logo Universitas Indonesia"
                  />
                </div>
                <div className="institution-title">
                  <span className="paper-kicker">SARJANA ILMU KOMPUTER</span>
                  <InkHeading first="Universitas" second="Indonesia" />
                  <p>
                    Program Studi Sistem Informasi
                    <br />
                    Fakultas Ilmu Komputer
                  </p>
                </div>
                <motion.div
                  className="degree-stamp"
                  ref={stampRef}
                  initial={false}
                  animate={{
                    y: stampLanded ? 0 : -22,
                    scale: stampLanded ? 1 : 1.18,
                    rotate: stampLanded ? 0 : -5,
                    opacity: stampLanded ? 1 : 0.6,
                  }}
                  transition={{
                    duration: reduceMotion ? 0 : 0.55,
                    ease: [0.55, 0, 1, 0.45],
                  }}
                >
                  <span>S.Kom.</span>
                  <small>
                    CUM
                    <br />
                    LAUDE
                  </small>
                </motion.div>
              </div>
              <div className="education-details">
                <div className="education-detail">
                  <span>PERIODE</span>
                  <strong>2022 — 2026</strong>
                  <small>Lulus 15 Juli 2026</small>
                </div>
                <div className="education-detail">
                  <span>IPK</span>
                  <strong>3.77 / 4.00</strong>
                  <small>125 SKS · 471,2 mutu</small>
                </div>
                <div className="education-detail">
                  <span>PERAN AKADEMIK</span>
                  <strong>Asisten Dosen</strong>
                  <small>Matematika Diskrit 2 · 2024 & 2025</small>
                </div>
              </div>
              <div className="education-lower">
                <div className="relevant-courses">
                  <span className="paper-kicker">RELEVANT COURSES / ALL A</span>
                  <div className="course-list">
                    <span>
                      Basis Data <b>95,82</b>
                    </span>
                    <span>
                      Arsitektur & Pemrograman Aplikasi Perusahaan <b>86,52</b>
                    </span>
                    <span>
                      Analisis & Perancangan Sistem Informasi <b>87,53</b>
                    </span>
                    <span>
                      Pengantar Keamanan Perangkat Lunak <b>98,56</b>
                    </span>
                    <span>
                      Proyek Pengembangan Sistem Informasi <b>98,91</b>
                    </span>
                  </div>
                </div>
                <div className="thesis-note">
                  <span className="paper-kicker">FINAL PROJECT</span>
                  <h3>
                    Design System untuk Direktorat Transformasi Digital UI
                  </h3>
                  <p>
                    Audit komponen, token warna dan tipografi, sampai panduan
                    pemakaian.
                  </p>
                  <span className="thesis-arrow">↗</span>
                </div>
              </div>
              <div className="paper-footer">
                <span>SELECTED FROM 85 APPLICANTS / TAUGHT 350+ STUDENTS</span>
                <span>02</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
