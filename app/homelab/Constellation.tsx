'use client';
import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { CORE_PHOTO, NODES, type MapNode, type NodeId } from './data';
import { useHomelabCopy } from './_copy/context';
import { useOnScreen, useStage } from './stage';
import { IcGitHub } from '../../components/Icons';

/*
  The opening, a pinned stage (homelab.css .hx-sky, ~340svh of scroll):

  1. braven-agents' chassis stands under a beam of light with the title.
  2. As the page scrolls the title lifts away and the chassis settles into
     the middle, while every system it controls comes in around it on an
     ellipse, the machines on the left and the network, edge and platforms on
     the right, each joined to it by a line that draws itself out.
  3. Once the network is whole, signals run out along the lines (only while
     the stage is on screen), and the systems can be selected: the card at
     the foot says what the agents do there.

  Everything moves from one number, the section's `--p` (stage.ts), in CSS:
  each system's own start (`--s`) sets when it comes in. The geometry is
  measured here, in pixels, whenever the stage changes size.
*/

type Geo = { w: number; h: number; cx: number; cy: number; pos: Record<string, { x: number; y: number }>; small: boolean };

/* angles in degrees, 0 to the right and clockwise: the machines down the left, the rest down the right */
const ANGLES: Record<NodeId, number> = {
  newmain: 138, caca: 160, servertop: 182, blade: 204, proxmox: 226,
  unifi: -48, npm: -29, cloudflare: -10, github: 14, vercel: 33, shebang: 52,
};

/** A system's mark where it has no photo. */
export function Glyph({ id }: { id: NodeId }) {
  if (id === 'npm') return <img src="/images/npm-icon.webp" alt="" />;
  if (id === 'cloudflare') return <img src="/images/cloudflare-icon.webp" alt="" />;
  if (id === 'github') return <IcGitHub />;
  if (id === 'vercel') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4 22 20H2Z" fill="currentColor" /></svg>;
  if (id === 'unifi') return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M7 5v7a5 5 0 0 0 10 0V5" /><path d="M12 5v7" />
    </svg>
  );
  return <span className="hx-glyph-text">#!</span>;
}

export default function Constellation({ onPick }: { onPick?: (id: NodeId | null) => void }) {
  const c = useHomelabCopy();
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [geo, setGeo] = useState<Geo | null>(null);
  const [net, setNet] = useState(false);
  const [sel, setSel] = useState<NodeId | null>(null);
  const seen = useOnScreen(stage);

  useStage(section, (p) => {
    const on = p > 0.6;
    setNet((was) => (was === on ? was : on));
  });

  useLayoutEffect(() => {
    const el = stage.current;
    if (!el) return;
    const measure = () => {
      const w = el.clientWidth, h = el.clientHeight;
      const small = w < 760;
      const cx = w / 2;
      const cy = small ? h * 0.42 : h * 0.47;
      // wide enough to spread out, narrow enough that the labels beside the outer pictures stay on screen
      const rx = small ? w * 0.36 : Math.min(w * 0.36, 560, cx - 250);
      const ry = small ? h * 0.27 : Math.min(h * 0.3, 300);
      const pos: Geo['pos'] = {};
      for (const n of NODES) {
        // on phones the two sides squeeze into taller arcs so the labels fit
        const a = (ANGLES[n.id] * Math.PI) / 180;
        pos[n.id] = { x: cx + Math.cos(a) * rx, y: cy + Math.sin(a) * ry * (small ? 1.25 : 1) };
      }
      setGeo({ w, h, cx, cy, pos, small });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const pick = (id: NodeId) => {
    const next = sel === id ? null : id;
    setSel(next);
    onPick?.(next);
  };
  const name = (n: MapNode) => n.name ?? c.core.proxmoxName;
  const shown = sel ? NODES.find((n) => n.id === sel)! : null;

  // the chassis: big under the beam at first, then small in the middle of the network
  const coreVars = geo ? {
    '--cx0': `${geo.small ? geo.cx : geo.w * 0.66}px`, '--cy0': `${geo.small ? geo.h * 0.33 : geo.h * 0.42}px`, '--cs0': geo.small ? 0.9 : 1,
    '--cx1': `${geo.cx}px`, '--cy1': `${geo.cy}px`, '--cs1': geo.small ? 0.42 : 0.5,
  } as CSSProperties : undefined;

  return (
    <section className="hx-sky" ref={section} aria-labelledby="hx-title">
      <div className={`hx-sky-stage${net ? ' is-net' : ''}${net && seen ? ' is-live' : ''}`} ref={stage} style={coreVars}>
        <div className="hx-beam" aria-hidden="true" />

        {/* the lines, drawn from the core out */}
        {geo && (
          <svg className="hx-net" width={geo.w} height={geo.h} viewBox={`0 0 ${geo.w} ${geo.h}`} aria-hidden="true">
            {NODES.map((n, i) => {
              const q = geo.pos[n.id];
              const d = `M${geo.cx} ${geo.cy} L${q.x.toFixed(1)} ${q.y.toFixed(1)}`;
              return (
                <g key={n.id} style={{ '--s': 0.36 + i * 0.018 } as CSSProperties} className={`${n.planned ? 'planned' : ''}${sel === n.id ? ' on' : ''}`}>
                  <path className="hx-net-line" d={d} pathLength={1} />
                  {!n.planned && <path className="hx-net-sig" d={d} pathLength={100} style={{ animationDelay: `${(i * 0.37) % 2.2}s` }} />}
                </g>
              );
            })}
          </svg>
        )}

        <div className="hx-core-node">
          <img className="hx-core-photo" src={CORE_PHOTO} alt="" />
          <span className="hx-core-label">braven-agents</span>
        </div>

        {geo && NODES.map((n, i) => {
          const q = geo.pos[n.id];
          return (
            <button
              key={n.id}
              type="button"
              className={`hx-sys${n.planned ? ' is-planned' : ''}${sel === n.id ? ' is-on' : ''}${q.x < geo.cx ? ' left' : ' right'}`}
              style={{ left: q.x, top: q.y, '--s': 0.38 + i * 0.018 } as CSSProperties}
              tabIndex={net ? 0 : -1}
              aria-pressed={sel === n.id}
              onClick={() => pick(n.id)}
            >
              <span className="hx-sys-pic" aria-hidden="true">
                {n.photo ? <img src={n.photo} alt="" /> : n.planned ? <i className="hx-sys-dash" /> : <Glyph id={n.id} />}
              </span>
              <span className="hx-sys-text">
                <span className="hx-sys-name">{name(n)}</span>
                <span className="hx-sys-role">{n.planned ? c.core.planned : c.core.nodes[n.id].role}</span>
              </span>
            </button>
          );
        })}

        {/* the opening words, which lift away as the network forms */}
        <div className="hx-open">
          <span className="hx-tag"><i /> {c.hero.tag}</span>
          <h1 className="hx-open-title" id="hx-title">{c.hero.title}</h1>
          <p className="hx-sub"><span className="hx-trace" aria-hidden="true" />{c.hero.sub}</p>
        </div>
        <span className="hx-cue" aria-hidden="true"><span>{c.hero.scroll}</span><i /></span>

        {/* what the network is, then what the agents do at the system picked */}
        <div className="hx-net-card" aria-live="polite">
          {shown ? (
            <>
              <span className="hx-net-card-tag">{name(shown)} <em>{shown.planned ? c.core.planned : c.core.nodes[shown.id].via}</em></span>
              <ul>{c.core.nodes[shown.id].does.map((d) => <li key={d}>{d}</li>)}</ul>
            </>
          ) : (
            <>
              <span className="hx-net-card-tag">{c.core.title}</span>
              <p>{c.core.lead}</p>
              <span className="hx-net-card-hint">{c.core.hint}</span>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
