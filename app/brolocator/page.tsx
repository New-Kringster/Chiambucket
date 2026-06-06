import type { Metadata } from 'next';
import ArticleScrollSpy from '../../components/ArticleScrollSpy';

export const metadata: Metadata = {
  title: 'LoRA Messenger (Brolocator) — Chiambucket',
  description: 'Project article: a LoRA-based peer-to-peer messenger with 2-way voice, built with ESP32, KiCad, and custom PCB.',
  alternates: { canonical: 'https://www.chiambucket.com/brolocator' },
  openGraph: {
    title: 'LoRA Messenger (Brolocator) — Chiambucket',
    description: 'Project article: a LoRA-based peer-to-peer messenger with 2-way voice, built with ESP32, KiCad, and custom PCB.',
    url: 'https://www.chiambucket.com/brolocator',
    type: 'article',
  },
};

export default function BrolocatorPage() {
  return (
    <main>
      <ArticleScrollSpy />
      <div className="article-Brolocator-image"></div>
      <div className="article-content">
        <div className="article-fade"></div>
        <div className="article-body">
          <div className="article-chapters">
            <div className="article-chapters-ultimate-wrapper">
              <h2>Chapters</h2>
              <nav className="article-chapter-wrapper">
                <a href="#Functionality">Functionality</a>
                <a href="#ProjectDevelopment">Project Development</a>
                <a href="#Code">Code</a>
                <a href="#PCBDesign">PCB Design</a>
                <a href="#threeDDesign">3D Design</a>
                <a href="#Assembly">Assembly</a>
              </nav>
            </div>
          </div>
          <div className="article-body-wrapper">
            <div className="article-header">
              <div className="pf-item-tag">
                <div className="pf-item-tag-personal"><h5>Personal Project</h5></div>
              </div>
              <h1 style={{ fontSize: '72px' }}>LoRA Messenger</h1>
              <h3>I started this project with the goal of learning how to use the ESP32 Microcontroller. With the help of YouTube and ChatGPT, I created &quot;Brolocator&quot; a device that allows you to send messages over long distances without internet. It can also perform crude Full-Duplex 2-Way Voice transmissions within range of ESP-NOW.</h3>
              <div className="pf-button-left-stack article-header-icons">
                <div className="icon-stack">
                  <img src="/images/ps-pf-icon.webp" alt="" />
                  <img src="/images/vscode-icon.webp" alt="" />
                  <img src="/images/onshape-icon.webp" alt="" />
                  <img src="/images/Kicad-icon.webp" alt="" />
                  <img src="/images/esp-icon.webp" alt="" />
                  <img src="/images/PlatformIO-icon.webp" alt="" />
                </div>
              </div>
            </div>
            <div className="article-real-body">
              <h2>Demo Video</h2>
              <iframe width="560" height="315" src="https://www.youtube.com/embed/1nbiYCAtGPA?si=DX0zrik6DufUva5P" title="YouTube video player" frameBorder={0} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
            </div>
            <section className="article-real-body article-no-style" id="Functionality">
              <h2>Functionality</h2>
              <p style={{ paddingLeft: 20 }}>- Use LoRA for long distance messaging<br /> - 2-Way Voice communication when in range of ESP-NOW <br /> - Powered off of rechargeable LiPo batteries <br /> - 2 Displays cuz its cool <br /> - A mode for range testing <br /> - Decent &amp; simple to use UI</p>
              <img src="/images/Brolocator1.webp" alt="" loading="lazy" />
              <img src="/images/Brolocator2.webp" alt="" loading="lazy" />
              <img src="/images/Brolocator3.webp" alt="" loading="lazy" />
              <img src="/images/Brolocator4.webp" alt="" loading="lazy" />
              <img src="/images/Brolocator5.webp" alt="" loading="lazy" />
              <img src="/images/Brolocator6.webp" alt="" loading="lazy" />
            </section>
            <section id="ProjectDevelopment" className="article-real-body">
              <h2>Project Development</h2>
              <p>Brolocator is my first deep dive into the microcontrollers, it was also my first attempt at designing a PCB. I used PlatformIO to code the ESP32, and with some help from Youtube and ChatGPT, I was able to learn how use each component to create the Brolocator.</p>
              <img src="/images/Brolocator7.webp" alt="" loading="lazy" />
              <span>Development of the Brolocator</span>
            </section>
            <section id="Code" className="article-real-body">
              <h2>Coding</h2>
              <p>Based on my research, PlatformIO was the best choice for developing code for the ESP32. You can download the PlatformIO Project <a href="https://file.chiambucket.com/public/api/raw?hash=Uw31ufKRXVAmviDG4Y3zsw">HERE</a></p>
              <img src="/images/Brolocator8.webp" alt="" loading="lazy" />
            </section>
            <section id="PCBDesign" className="article-real-body">
              <h2>PCB Design</h2>
              <p>I used KiCAD to design a PCB for all the components to go on. You can download the KiCAD files <a href="https://file.chiambucket.com/public/api/raw?hash=y5dKQ_glrduAHZ2b09PwFw">HERE</a></p>
              <img src="/images/Brolocator9.webp" alt="" loading="lazy" />
              <span>Schematic</span>
              <img src="/images/Brolocator10.webp" alt="" loading="lazy" />
              <span>Board</span>
              <img src="/images/Brolocator11.webp" alt="" loading="lazy" />
            </section>
            <section id="threeDDesign" className="article-real-body">
              <h2>3D Design</h2>
              <p>I used Onshape to design a Case for the board. You can get the files <a href="https://cad.onshape.com/documents/06f42027d48061220c14a0ca/w/a8ae7436030816f045f9e912/e/ee2cc98ca48e0de54fb6f19a?renderMode=0&uiState=69242b3fb36228e1cf876de1">HERE</a></p>
              <img src="/images/Brolocator12.webp" alt="" loading="lazy" />
              <span>3D model of the Brolocator case</span>
              <img src="/images/Brolocator16.webp" alt="" loading="lazy" />
              <span>Design iterations</span>
              <img src="/images/Brolocator17.webp" alt="" loading="lazy" />
              <span>Learning from design failures</span>
            </section>
            <section id="Assembly" className="article-real-body">
              <h2>Assembly</h2>
              <p>Assembly of all components together</p>
              <img src="/images/Brolocator13.webp" alt="" loading="lazy" />
              <span>All components soldered to the PCB and working</span>
              <img src="/images/Brolocator14.webp" alt="" loading="lazy" />
              <span>Fitting PCB into case</span>
              <img src="/images/Brolocator15.webp" alt="" loading="lazy" />
              <span>Complete</span>
            </section>
            <div className="next-article">
              Check Out The Next Article
              <a href="/portfolio" className="pf-item-button">
                View Next Article
                <svg fill="currentColor" viewBox="0 0 24 24" className="pf-item-buttom-icon">
                  <path clipRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z" fillRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
          <div className="article-balance"></div>
        </div>
      </div>
      <div className="article-bottom-fade"></div>
      <div className="article-bottom-fade2"></div>
    </main>
  );
}
