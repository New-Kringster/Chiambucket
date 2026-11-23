/* The LoRA Messenger article, rendered in any language: the English page (page.tsx) and
   app/[lang]/brolocator/page.tsx both render it. Its words come from ./_copy. */
import ArticleRecommendations from '../../components/ArticleRecommendations';
import ArticleScrollSpy from '../../components/ArticleScrollSpy';
import ArticleLinks from '../../components/ArticleLinks';
import AiMark from '../../components/AiMark';
import LinkDemo from './LinkDemo';
import { IcGitHub, IcDownload, IcCube } from '../../components/Icons';
import { loadBrolocatorCopy } from './_copy';
import { HTML_LANG, SITE, localize, type Lang } from '@/lib/i18n';

export const URL = 'https://www.chiambucket.com/brolocator';
const REPO = 'https://github.com/New-Kringster/Bro_Locator';
const ONSHAPE = 'https://cad.onshape.com/documents/06f42027d48061220c14a0ca/w/a8ae7436030816f045f9e912/e/ee2cc98ca48e0de54fb6f19a?renderMode=0&uiState=69242b3fb36228e1cf876de1';

const BackArrow = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

/* the chapter rail, by section id */
const RAIL = ['Demo', 'Functionality', 'ProjectDevelopment', 'Code', 'PCBDesign', 'threeDDesign', 'Assembly'] as const;

export default async function BrolocatorArticle({ lang }: { lang: Lang }) {
  const c = await loadBrolocatorCopy(lang);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: c.ld.headline,
    alternativeHeadline: c.ld.alternativeHeadline,
    description: c.meta.description,
    image: 'https://www.chiambucket.com/images/borlocator-pf-context.webp',
    author: { '@type': 'Person', name: 'Braven Chiam', url: 'https://www.chiambucket.com/' },
    publisher: { '@type': 'Person', name: 'Braven Chiam' },
    mainEntityOfPage: lang === 'en' ? URL : SITE + localize('/brolocator', lang),
    ...(lang === 'en' ? {} : { inLanguage: HTML_LANG[lang] }),
  };

  return (
    <main className="art">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ArticleScrollSpy />

      {/* Feature hero */}
      <header className="art-hero">
        <div className="art-hero-bg"><img src="/images/covers/lora.webp" alt={c.hero.alt} /></div>
        <div className="art-hero-scrim"></div>
        <div className="art-hero-inner hp-section">
          <a className="art-back" href={localize('/#projects', lang)}><BackArrow /> {c.hero.back}</a>
          <div className="art-tags">
            <AiMark project="proj-lora" lang={lang} />
            <span className="hp-md-tag personal">{c.hero.tag}</span>
          </div>
          <h1 className="art-title">{c.hero.title}</h1>
          <p className="art-lead">{c.hero.lead}</p>
          <div className="art-toolrow">
            <span className="hp-key">{c.hero.builtWith}</span>
            <div className="icon-stack">
              <img src="/images/ps-pf-icon.webp" alt="Photoshop" />
              <img src="/images/vscode-icon.webp" alt="VS Code" />
              <img src="/images/onshape-icon.webp" alt="Onshape" />
              <img src="/images/Kicad-icon.webp" alt="KiCAD" />
              <img src="/images/esp-icon.webp" alt="ESP32" />
              <img src="/images/PlatformIO-icon.webp" alt="PlatformIO" />
            </div>
          </div>
          <ArticleLinks
            links={[
              { type: 'github', label: c.hero.links[0], url: REPO },
              { type: 'video', label: c.hero.links[1], url: 'https://youtu.be/1nbiYCAtGPA' },
              { type: 'cad', label: c.hero.links[2], url: ONSHAPE },
            ]}
          />
        </div>
      </header>

      {/* Body */}
      <div className="art-body hp-section">
        <aside className="art-rail">
          <div className="art-rail-inner">
            <span className="hp-eyebrow">{c.chapters}</span>
            <nav className="art-chapters article-chapter-wrapper">
              {RAIL.map((id) => <a key={id} href={`#${id}`}>{c.rail[id]}</a>)}
            </nav>
          </div>
        </aside>

        <div className="art-content">
          <section id="Demo" className="art-section" data-reveal>
            <h2>{c.demo.h}</h2>
            <div className="art-video">
              <iframe
                src="https://www.youtube.com/embed/1nbiYCAtGPA?si=DX0zrik6DufUva5P"
                title={c.demo.video}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </div>
          </section>

          <section id="Functionality" className="art-section" data-reveal>
            <h2>{c.features.h}</h2>
            <ul>
              {c.features.items.map((x, i) => <li key={i}>{x}</li>)}
            </ul>
            <p>{c.features.p}</p>

            <LinkDemo t={c.demoWidget} />

            <div className="art-grid">
              {c.features.alts.map((alt, i) => <img key={i} src={`/images/Brolocator${i + 1}.webp`} alt={alt} loading="lazy" />)}
            </div>
          </section>

          <section id="ProjectDevelopment" className="art-section" data-reveal>
            <h2>{c.dev.h}</h2>
            <p>{c.dev.p}</p>
            <figure className="art-fig">
              <img src="/images/Brolocator7.webp" alt={c.dev.alt} loading="lazy" />
              <figcaption>{c.dev.caption}</figcaption>
            </figure>
          </section>

          <section id="Code" className="art-section" data-reveal>
            <h2>{c.code.h}</h2>
            <p>{c.code.p}</p>
            <img src="/images/Brolocator8.webp" alt={c.code.alt} loading="lazy" />
            <div className="art-repo">
              <div className="art-repo-text">
                <strong>{c.code.project.title}</strong>
                <span>{c.code.project.text}</span>
              </div>
              <a className="hp-btn" href="https://file.chiambucket.com/public/api/raw?hash=Uw31ufKRXVAmviDG4Y3zsw" target="_blank" rel="noopener"><IcDownload /> {c.code.project.button}</a>
            </div>
            <div className="art-repo">
              <div className="art-repo-text">
                <strong>{c.code.repo.title}</strong>
                <span>{c.code.repo.text}</span>
              </div>
              <a className="hp-btn" href={REPO} target="_blank" rel="noopener"><IcGitHub /> {c.code.repo.button}</a>
            </div>
          </section>

          <section id="PCBDesign" className="art-section" data-reveal>
            <h2>{c.pcb.h}</h2>
            <p>{c.pcb.p}</p>
            <figure className="art-fig">
              <img src="/images/Brolocator9.webp" alt={c.pcb.schematicAlt} loading="lazy" />
              <figcaption>{c.pcb.schematicCaption}</figcaption>
            </figure>
            <figure className="art-fig">
              <img src="/images/Brolocator10.webp" alt={c.pcb.layoutAlt} loading="lazy" />
              <figcaption>{c.pcb.layoutCaption}</figcaption>
            </figure>
            <img src="/images/Brolocator11.webp" alt={c.pcb.finishedAlt} loading="lazy" />
            <div className="art-repo">
              <div className="art-repo-text">
                <strong>{c.pcb.files.title}</strong>
                <span>{c.pcb.files.text}</span>
              </div>
              <a className="hp-btn" href="https://file.chiambucket.com/public/api/raw?hash=y5dKQ_glrduAHZ2b09PwFw" target="_blank" rel="noopener"><IcDownload /> {c.pcb.files.button}</a>
            </div>
          </section>

          <section id="threeDDesign" className="art-section" data-reveal>
            <h2>{c.case.h}</h2>
            <p>{c.case.p}</p>
            {CASE_IMGS.map((src, i) => (
              <figure key={src} className="art-fig">
                <img src={src} alt={c.case.figs[i].alt} loading="lazy" />
                <figcaption>{c.case.figs[i].caption}</figcaption>
              </figure>
            ))}
            <div className="art-repo">
              <div className="art-repo-text">
                <strong>{c.case.model.title}</strong>
                <span>{c.case.model.text}</span>
              </div>
              <a className="hp-btn" href={ONSHAPE} target="_blank" rel="noopener"><IcCube /> {c.case.model.button}</a>
            </div>
          </section>

          <section id="Assembly" className="art-section" data-reveal>
            <h2>{c.assembly.h}</h2>
            {ASSEMBLY_IMGS.map((src, i) => (
              <figure key={src} className="art-fig">
                <img src={src} alt={c.assembly.figs[i].alt} loading="lazy" />
                <figcaption>{c.assembly.figs[i].caption}</figcaption>
              </figure>
            ))}
          </section>

        </div>
      </div>
      <ArticleRecommendations exclude="proj-lora" />
    </main>
  );
}

/* the figures' images; their alt text and captions are in the copy, in the same order */
const CASE_IMGS = ['/images/Brolocator12.webp', '/images/Brolocator16.webp', '/images/Brolocator17.webp'];
const ASSEMBLY_IMGS = ['/images/Brolocator13.webp', '/images/Brolocator14.webp', '/images/Brolocator15.webp'];
