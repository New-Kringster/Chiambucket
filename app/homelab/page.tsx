'use client';
import type { Metadata } from 'next';
import { useEffect } from 'react';

function CheckItem({ text }: { text: string }) {
  return (
    <li className="homelab_card__list_item">
      <span className="check">
        <svg className="check_svg" fill="currentColor" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
          <path clipRule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" fillRule="evenodd" />
        </svg>
      </span>
      <span className="list_text">{text}</span>
    </li>
  );
}

export default function HomelabPage() {
  useEffect(() => {
    const stopAnim = () => document.getAnimations().forEach((a) => a.pause());
    const timer = setTimeout(stopAnim, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main>
      <div className="change-screen">This page is under active development and could be subjected to frequent changes.</div>
      <div className="hl-hero-overflow">
        <div className="hl-hero-bg">
          <iframe src="https://my.spline.design/glowingplanetparticles-oywHJQUuCZao8KfsYrwaUMow/" frameBorder={0} width="100%" height="100%" className="h1hero-bg-if"></iframe>
        </div>
      </div>
      <div className="homelab-hero">
        <div className="hl-flywrapper1"><img src="/images/paperless-icon.webp" alt="" /></div>
        <div className="hl-flywrapper2"><img src="/images/netdata-icon.webp" alt="" /></div>
        <div className="hl-flywrapper3"><img src="/images/npm-icon.webp" alt="" /></div>
        <div className="hl-flywrapper4"><img src="/images/wordpress-icon.webp" alt="" /></div>
        <div className="hl-flywrapper5"><img src="/images/upsnap-icon.webp" alt="" /></div>
        <div className="hl-flywrapper6"><img src="/images/mysql-icon.webp" alt="" /></div>
        <div className="homelab-hero-header photography-header-headline">
          <h1>Servers That Just Run</h1>
          <p>These servers enable me to experiment with new projects from the open-source community and host my own cloud services, eliminating the need to rely on commercial providers.</p>
        </div>
      </div>

      <div className="homelab-body1">
        <div className="whyselfhost">
          <h2>Why Self-Host?</h2>
          <p>Self-hosting gives me full control over my data and frees me from annoying monthly subscriptions. I&apos;m responsible for maintaining the quality of the service, and I genuinely enjoy the process of learning about computer networking and keeping my server running smoothly.</p>
        </div>
        <h1>The Servers</h1>
        <div className="homelab-servercard-holder">
          <div className="newmain-card">
            <div className="homelab_card">
              <div className="homelab_card__border"></div>
              <div className="homelab_card_title__container">
                <span className="homelab_card_title">New Main</span>
                <p className="homelab_card_paragraph">The workhorse that runs everything</p>
              </div>
              <hr className="line" />
              <ul className="homelab_card__list">
                <CheckItem text="Runs Unraid" />
                <CheckItem text="Ryzen 7 3700X" />
                <CheckItem text="DDR4 64GB" />
                <CheckItem text="GTX 1650" />
                <CheckItem text="18TB of usable storage" />
                <CheckItem text="Runs 90% of the Docker containers" />
              </ul>
            </div>
          </div>
          <div className="adell-card">
            <div className="homelab_card homelab_card1">
              <div className="homelab_card__border"></div>
              <div className="homelab_card_title__container">
                <span className="homelab_card_title">Adell</span>
                <p className="homelab_card_paragraph">Runs all my Proxmox VMs</p>
              </div>
              <hr className="line" />
              <ul className="homelab_card__list">
                <CheckItem text="Runs Proxmox" />
                <CheckItem text="2x 10c Xeon E5-2470 V2" />
                <CheckItem text="DDR3 128GB" />
                <CheckItem text="Perc H710P mini [IT mode]" />
                <CheckItem text="1TB of usable storage" />
                <CheckItem text="Runs All of my Proxmox VMs" />
              </ul>
            </div>
          </div>
          <div className="caca-card">
            <div className="homelab_card homelab_card2">
              <div className="homelab_card__border"></div>
              <div className="homelab_card_title__container">
                <span className="homelab_card_title">CaCa</span>
                <p className="homelab_card_paragraph">Runs Minecraft Servers</p>
              </div>
              <hr className="line" />
              <ul className="homelab_card__list">
                <CheckItem text="Used to be my main server" />
                <CheckItem text="Core i7-6700T" />
                <CheckItem text="DDR4 32GB" />
                <CheckItem text="Used to run Casaos but runs proxmox now" />
                <CheckItem text="1TB of usable storage" />
                <CheckItem text="Runs Crafty Controller to manage the MC servers" />
              </ul>
            </div>
          </div>
        </div>

        <h1>The Apps</h1>
        <div className="homelab-body-apps-holder">
          {[
            { cls: '', img: '/images/netdata-icon.webp', name: 'NetData', desc: "Netdata is a great tool for logging and monitoring system metrics. I don't have much to say because it has worked flawlessly for me so far.", ctx: '/images/netdatacontext.webp' },
            { cls: 'homelab-body-apps-item-wrapper1', img: '/images/npm-icon.webp', name: 'Nginx Proxy Manager', desc: 'Simple and easy-to-use Reverse Proxy Manager. But I am looking into Traefik as it is more secure and has load-balancing.', ctx: '/images/NPMcontext.webp' },
            { cls: '', img: '/images/paperless-icon.webp', name: 'PaperlessNGX', desc: 'PaperlessNGX Helps me index all my documents and PDFs allowing them to be easily accessible from any device.', ctx: '/images/paperless-context.webp' },
            { cls: 'homelab-body-apps-item-wrapper2', img: '/images/upsnap-icon.webp', name: 'UpSnap', desc: 'Just a simple docker that allows me to perform wake-on LAN requests through a well-crafted web interface.', ctx: '/images/upsnap-context.webp' },
            { cls: 'homelab-body-apps-item-wrapper3', img: '/images/lychee-icon.webp', name: 'Lychee', desc: 'A Simple Docker applet that allows me to share my gallery in high quality. Access it HERE.', ctx: '/images/lychee-context.webp' },
            { cls: 'homelab-body-apps-item-wrapper4', img: '/images/fireshare-icon.webp', name: 'Fireshare', desc: 'Fireshare lets me and my friends share our game clips without any upload size limits.', ctx: '/images/fireshare-context.webp', noRadius: true },
            { cls: 'homelab-body-apps-item-wrapper5', img: '/images/crafty-icon.webp', name: 'Crafty', desc: 'A no muss, no fuss Minecraft server manager that just works.', ctx: '/images/crafty-context.webp', noRadius: true },
            { cls: 'homelab-body-apps-item-wrapper6', img: '/images/automatic-icon.webp', name: 'Automatic1111', desc: 'Automatic 1111 is a web-based GUI for stable diffusion generative image generation.', ctx: '/images/automatic-context.webp', noRadius: true },
            { cls: 'homelab-body-apps-item-wrapper7', img: '/images/openwebui-icon.webp', name: 'Open Web UI', desc: 'Open Web UI is a web-based GUI for Ollama, a Large language model manager.', ctx: '/images/openwebui-context.webp', noRadius: true },
            { cls: 'homelab-body-apps-item-wrapper8', img: '/images/netboot-icon.webp', name: 'NetBootXYZ', desc: 'NetBoot.xyz turned my Ventoy boot USB stick obsolete overnight. It offers a wide range of bootable installers via PXE boot over LAN.', ctx: '/images/netboot-context.webp' },
            { cls: 'homelab-body-apps-item-wrapper9', img: '/images/ost-icon.webp', name: 'OpenSpeedTest', desc: "Simple Speedtest applet that just works, it's really cool to see the internet speed between my server and some locations.", ctx: '/images/ost-context.webp' },
            { cls: 'homelab-body-apps-item-wrapper8', img: '/images/portainer-icon.webp', name: 'Portainer', desc: 'Fuss-free docker manager that works almost too well.', ctx: '/images/portainer-context.webp' },
            { cls: 'homelab-body-apps-item-wrapper10', img: '/images/alist-icon.webp', name: 'Alist', desc: 'Google Drive alternative for me to access my files while using my own storage.', ctx: '/images/alist-context.webp' },
            { cls: 'homelab-body-apps-item-wrapper11', img: '/images/immich-icon.webp', name: 'Immich', desc: 'Google Photos alternative for me to access my photos while using my own storage and also back them up!', ctx: '/images/immich-context.webp' },
            { cls: 'homelab-body-apps-item-wrapper9', img: '/images/syncthing-icon.webp', name: 'Syncthing', desc: 'The most Goated piece of software to ever exist, backups, versions, syncs my files between devices.', ctx: '/images/syncthing-context.webp' },
            { cls: '', img: '/images/nginx-icon.webp', name: 'Nginx', desc: 'Lets me run this very website you are on right now!', ctx: '/images/nginx-context.webp', noRadius: true },
          ].map(({ cls, img, name, desc, ctx, noRadius }) => (
            <div key={name} className={`homelab-body-apps-item-wrapper ${cls}`}>
              <div className="homelab-body-apps-item">
                <div className="homelab-body-apps-item-top">
                  <img src={img} alt={`${name} icon`} style={noRadius ? { borderRadius: 0 } : undefined} />
                  <div className="homelab-body-apps-item-text">
                    <h2>{name}</h2>
                    <p>{desc}</p>
                  </div>
                </div>
                <div className="homelab-body-apps-item-bottom">
                  <img src={ctx} alt="" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="portfolio-call-to-action">
        <div className="portfolio-cta-content">
          <h1>Check out my Portfolio NOW!</h1>
          <button className="button-photography" onClick={() => { window.location.href = '/portfolio'; }}>
            Portfolio
            <svg className="icon-photography-button" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </main>
  );
}
