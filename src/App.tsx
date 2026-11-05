/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Sajad Ali's portfolio: a plain scrolling portfolio page. No 3D view,
 * no modal, no charts, no dock — just sections a visitor can read top
 * to bottom on a phone or a desktop.
 */

import React from 'react';
import {
  AUTHOR_PROFILE,
  MACHINES,
  PUBLICATIONS,
  WEB_PROJECTS,
  EXPERIENCE,
  EDUCATION,
  SKILLS,
  LANGUAGES,
  HONOURS,
  REFERENCES,
  CURRENT_RESEARCH,
} from './data/portfolioData';

function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="max-w-5xl mx-auto px-5 md:px-8 py-12 md:py-16">
      <p className="font-mono text-xs text-[#d0864a] tracking-wider mb-2">{eyebrow}</p>
      <h2 className="font-display text-3xl md:text-4xl font-normal text-[#e9e4da] mb-6">{title}</h2>
      {children}
    </section>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#161e24] border border-[#36424a] rounded-2xl p-5 md:p-6 shadow-xl">
      {children}
    </div>
  );
}

function ExternalLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-block text-sm text-[#d0864a] hover:underline font-medium"
    >
      {label} →
    </a>
  );
}

export default function App() {
  const p = AUTHOR_PROFILE;
  return (
    <div className="min-h-screen bg-[#12181c] text-[#e9e4da]">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#12181c]/95 border-b border-[#36424a]">
        <div className="max-w-5xl mx-auto px-5 md:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
          <a href="#top" className="font-display text-xl text-[#e9e4da]">
            Sajad Ali
          </a>
          <nav className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[#9aa5a8]">
            <a href="#about" className="hover:text-[#e9e4da]">About</a>
            <a href="#machines" className="hover:text-[#e9e4da]">Machines</a>
            <a href="#publications" className="hover:text-[#e9e4da]">Publications</a>
            <a href="#projects" className="hover:text-[#e9e4da]">Web Projects</a>
            <a href="#experience" className="hover:text-[#e9e4da]">Experience</a>
            <a href="#contact" className="hover:text-[#e9e4da]">Contact</a>
          </nav>
          <a
            href={`mailto:${p.email}?subject=PhD%20opportunity`}
            className="px-3.5 py-1.5 text-xs font-semibold text-[#12181c] bg-[#d0864a] rounded-lg hover:bg-[#e0965a] whitespace-nowrap"
          >
            Contact for PhD
          </a>
        </div>
      </header>

      {/* Hero */}
      <section id="top" className="max-w-5xl mx-auto px-5 md:px-8 pt-14 pb-10 md:pt-20 md:pb-14">
        <p className="font-mono text-xs text-[#d0864a] tracking-wider mb-3">
          {p.role} · {p.institution} · {p.location}
        </p>
        <h1 className="font-display text-4xl md:text-6xl font-normal leading-tight mb-5">
          Electromagnetic machine design meets machine learning
        </h1>
        <p className="text-base md:text-lg text-[#e9e4da]/85 leading-relaxed max-w-3xl mb-4">
          {p.tagline}
        </p>
        <p className="text-base text-[#9aa5a8] leading-relaxed max-w-3xl mb-7">{p.phdObjective}</p>
        <div className="flex flex-wrap gap-3">
          <a
            href="#publications"
            className="px-4 py-2 text-sm font-semibold text-[#12181c] bg-[#d0864a] rounded-lg hover:bg-[#e0965a]"
          >
            View Publications
          </a>
          <a
            href="#machines"
            className="px-4 py-2 text-sm font-medium text-[#e9e4da] border border-[#36424a] rounded-lg hover:border-[#d0864a]"
          >
            Machines I Designed
          </a>
        </div>
      </section>

      {/* About */}
      <Section id="about" eyebrow="About" title="About me">
        <div className="space-y-4 text-base leading-relaxed text-[#e9e4da]/85 max-w-3xl">
          <p>
            I am Sajad Ali, an electrical engineering graduate from Sukkur IBA University. My work
            is the design, modelling and simulation of advanced electrical machines, especially
            dual-stator hybrid-rotor machines.
          </p>
          <p>
            I analyse machines with finite element analysis in Ansys Maxwell and PyAEDT, and I
            build machine-learning surrogate models to make the design loop faster. My ME thesis
            designed a dual stator brushless hybrid rotor machine that operates in both
            synchronous and vernier modes.
          </p>
          <p>{CURRENT_RESEARCH}</p>
          <p>
            I am open to PhD positions and to collaboration on electrical machine design and
            optimisation.
          </p>
        </div>
      </Section>

      {/* Machines */}
      <Section id="machines" eyebrow="Electrical Machines" title="Machines I designed">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MACHINES.map((m) => (
            <Card key={m.title}>
              <p className="font-mono text-[11px] text-[#d0864a] tracking-wider mb-1">{m.kind}</p>
              <h3 className="font-display text-xl mb-2">{m.title}</h3>
              <p className="text-sm text-[#e9e4da]/85 leading-relaxed mb-3">{m.description}</p>
              <ul className="flex flex-wrap gap-1.5">
                {m.specs.map((s) => (
                  <li
                    key={s}
                    className="px-2 py-0.5 rounded bg-[#12181c] border border-[#36424a] font-mono text-[11px] text-[#9aa5a8]"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </Section>

      {/* Publications */}
      <Section id="publications" eyebrow="Publications" title="Publications">
        <div className="space-y-4">
          {PUBLICATIONS.map((pub) => (
            <Card key={pub.title}>
              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                <p className="font-mono text-[11px] text-[#d0864a] tracking-wider">
                  {pub.venue} · {pub.year}
                </p>
              </div>
              <h3 className="font-display text-lg leading-snug mb-2">{pub.title}</h3>
              {pub.doiUrl ? (
                <ExternalLink href={pub.doiUrl} label={`DOI: ${pub.doi}`} />
              ) : (
                <p className="text-sm text-[#9aa5a8]">No DOI or paper link verified yet.</p>
              )}
            </Card>
          ))}
        </div>
      </Section>

      {/* Web projects */}
      <Section id="projects" eyebrow="Vibe Coding" title="Web projects I built">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {WEB_PROJECTS.map((w) => (
            <Card key={w.title}>
              <h3 className="font-display text-xl mb-2">{w.title}</h3>
              <p className="text-sm text-[#e9e4da]/85 leading-relaxed mb-4">{w.description}</p>
              <ExternalLink href={w.liveUrl} label="Open Live App" />
            </Card>
          ))}
        </div>
      </Section>

      {/* Experience & education */}
      <Section id="experience" eyebrow="Background" title="Experience and education">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <h3 className="font-display text-xl mb-4">Experience</h3>
            <div className="space-y-4">
              {EXPERIENCE.map((e) => (
                <div key={e.title}>
                  <p className="font-semibold">{e.title}</p>
                  <p className="text-sm text-[#9aa5a8]">{e.place}</p>
                  <p className="font-mono text-xs text-[#d0864a]">{e.period}</p>
                  <p className="text-sm text-[#e9e4da]/85 mt-1">{e.detail}</p>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <h3 className="font-display text-xl mb-4">Education</h3>
            <div className="space-y-4">
              {EDUCATION.map((e) => (
                <div key={e.title}>
                  <p className="font-semibold">{e.title}</p>
                  <p className="text-sm text-[#9aa5a8]">{e.place}</p>
                  <p className="font-mono text-xs text-[#d0864a]">{e.period}</p>
                  <p className="text-sm text-[#e9e4da]/85 mt-1">{e.detail}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </Section>

      {/* Skills */}
      <Section id="skills" eyebrow="Tools & Skills" title="What I work with">
        <ul className="flex flex-wrap gap-2 mb-8">
          {SKILLS.map((s) => (
            <li
              key={s}
              className="px-3 py-1.5 rounded-full bg-[#161e24] border border-[#36424a] text-sm text-[#e9e4da]/90"
            >
              {s}
            </li>
          ))}
        </ul>
        <p className="text-sm text-[#9aa5a8]">
          Languages: {LANGUAGES.join(', ')}.
        </p>
      </Section>

      {/* Honours */}
      <Section id="honours" eyebrow="Honours" title="Awards and scholarships">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {HONOURS.map((h) => (
            <Card key={h.title}>
              <h3 className="font-display text-lg leading-snug mb-1">{h.title}</h3>
              <p className="text-sm text-[#9aa5a8]">{h.detail}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* References */}
      <Section id="references" eyebrow="References" title="References">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {REFERENCES.map((r) => (
            <Card key={r.name}>
              <h3 className="font-display text-lg mb-1">{r.name}</h3>
              <p className="text-sm text-[#9aa5a8]">{r.title}</p>
              <p className="text-sm text-[#9aa5a8] mb-3">{r.institution}</p>
              <a href={`mailto:${r.email}`} className="text-sm text-[#d0864a] hover:underline break-all">
                {r.email}
              </a>
            </Card>
          ))}
        </div>
      </Section>

      {/* Contact */}
      <Section id="contact" eyebrow="Contact" title="Get in touch">
        <Card>
          <p className="text-base text-[#e9e4da]/85 leading-relaxed mb-4">
            I am available for PhD positions and for research collaboration on electrical machine
            design and optimisation.
          </p>
          <div className="space-y-2 text-sm">
            <p>
              Email: <a href={`mailto:${p.email}`} className="text-[#d0864a] hover:underline break-all">{p.email}</a>
            </p>
            <p>
              Also: <a href={`mailto:${p.secondaryEmail}`} className="text-[#d0864a] hover:underline break-all">{p.secondaryEmail}</a>
            </p>
            <p>Location: {p.location}</p>
          </div>
          <div className="flex flex-wrap gap-4 mt-5">
            <ExternalLink href={p.linkedinUrl} label="LinkedIn" />
            <ExternalLink href={p.scholarUrl} label="Google Scholar" />
            <ExternalLink href={p.researchGateUrl} label="ResearchGate" />
            <ExternalLink href={p.orcidUrl} label="ORCID" />
            <ExternalLink href={p.githubUrl} label="GitHub" />
          </div>
        </Card>
      </Section>

      <footer className="border-t border-[#36424a] py-6">
        <p className="text-center font-mono text-xs text-[#9aa5a8]">
          Sajad Ali · {p.institution} · {p.location}
        </p>
      </footer>
    </div>
  );
}
