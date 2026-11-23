'use client';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { GROUPS, NODES, type MapNode, type NodeId } from './data';
import { useHomelabCopy } from './_copy/context';

/*
  The control map: braven-agents in the middle, the machines on its left and
  the network, edge and platforms on its right, each joined to it by a line.
  Every so often a small pulse runs down one line to its system, the way a
  command goes out; once a system is selected the pulses go only to it.
  Selecting a system lists what the agents do there (below the map on wide
  screens, under the system itself on phones). The lines are measured from
  the cards, so they follow any wrapping. Pulses pause off screen, and with
  reduced motion there are none.
*/

// a pulse sets off this often, and takes TRAVEL_MS to reach its system (homelab.css matches it)
const PULSE_MS = 1100;

export default function ControlMap() {
  const c = useHomelabCopy();
  const [sel, setSel] = useState<NodeId>('newmain');
  const [paths, setPaths] = useState<Partial<Record<NodeId, string>>>({});
  const [box, setBox] = useState({ w: 0, h: 0 });
  const [pulse, setPulse] = useState<{ id: NodeId; n: number } | null>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const core = useRef<HTMLDivElement>(null);
  const cards = useRef<Partial<Record<NodeId, HTMLButtonElement | null>>>({});
  const selRef = useRef(sel);
  selRef.current = sel;
  // once a system has been picked, every other pulse goes to it
  const chosen = useRef(false);

  const name = (n: MapNode) => n.name ?? c.core.proxmoxName;

  // the lines, measured from the cards whenever the layout changes
  useLayoutEffect(() => {
    const el = wrap.current;
    const hub = core.current;
    if (!el || !hub) return;
    const measure = () => {
      const o = el.getBoundingClientRect();
      const k = hub.getBoundingClientRect();
      if (!k.width) { setPaths({}); return; }
      setBox({ w: o.width, h: o.height });
      const next: Partial<Record<NodeId, string>> = {};
      const sides = { left: NODES.filter((n) => n.group === 'machines'), right: NODES.filter((n) => n.group !== 'machines') };
      (['left', 'right'] as const).forEach((side) => {
        const list = sides[side];
        list.forEach((n, i) => {
          const card = cards.current[n.id];
          if (!card) return;
          const r = card.getBoundingClientRect();
          // the lines leave the core spread over its middle half, in the order of their cards
          const y0 = k.top - o.top + k.height * (0.25 + (0.5 * (i + 0.5)) / list.length);
          const x0 = side === 'left' ? k.left - o.left : k.right - o.left;
          const x1 = side === 'left' ? r.right - o.left : r.left - o.left;
          const y1 = r.top - o.top + r.height / 2;
          const mid = (x0 + x1) / 2;
          // drawn from the core out, so the pulses travel outwards
          next[n.id] = `M${x0.toFixed(1)} ${y0.toFixed(1)} C${mid.toFixed(1)} ${y0.toFixed(1)} ${mid.toFixed(1)} ${y1.toFixed(1)} ${x1.toFixed(1)} ${y1.toFixed(1)}`;
        });
      });
      setPaths(next);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  }, []);

  // the pulses: one at a time, round the systems, or only to the selected one
  useEffect(() => {
    const el = wrap.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const live = NODES.filter((n) => !n.planned);
    let i = 0;
    let n = 0;
    let timer = 0;
    let seen = false;
    const tick = () => {
      if (seen && !document.hidden) {
        const own = selRef.current;
        const toSel = chosen.current && n % 2 === 1 && live.some((x) => x.id === own);
        setPulse({ id: toSel ? own : live[i++ % live.length].id, n: ++n });
      }
      timer = window.setTimeout(tick, PULSE_MS);
    };
    const io = new IntersectionObserver(([e]) => { seen = e.isIntersecting; }, { threshold: 0.2 });
    io.observe(el);
    timer = window.setTimeout(tick, 600);
    return () => { io.disconnect(); window.clearTimeout(timer); };
  }, []);

  const pick = (id: NodeId) => { chosen.current = true; setSel(id); };
  const current = NODES.find((n) => n.id === sel)!;
  const t = c.core.nodes[sel];

  // plain render functions, not components, so a re-render never remounts a focused button
  const detail = (n: MapNode) => (
    <div className="hx-map-does">
      <span className="hx-map-does-label">{c.core.doesLabel}</span>
      <ul>{c.core.nodes[n.id].does.map((d) => <li key={d}>{d}</li>)}</ul>
    </div>
  );

  const node = (n: MapNode) => {
    const on = sel === n.id;
    const tt = c.core.nodes[n.id];
    return (
      <div key={n.id} className={`hx-node-wrap${on ? ' is-on' : ''}`}>
        <button
          type="button"
          ref={(el) => { cards.current[n.id] = el; }}
          className={`hx-node${n.planned ? ' is-planned' : ''}${on ? ' is-on' : ''}`}
          aria-pressed={on}
          onClick={() => pick(n.id)}
        >
          {/* lights up as a pulse arrives */}
          {pulse?.id === n.id && <span key={pulse.n} className="hx-node-ping" aria-hidden="true" />}
          <span className="hx-node-name">{name(n)}</span>
          <span className="hx-node-role">{tt.role}</span>
          <span className={`hx-node-via${n.planned ? ' planned' : ''}`}>{n.planned ? c.core.planned : tt.via}</span>
        </button>
        {on && <div className="hx-node-inline">{detail(n)}</div>}
      </div>
    );
  };

  return (
    <div className="hx-map" data-no-zoom>
      <div className="hx-map-stage" ref={wrap} role="group" aria-label={c.core.mapLabel}>
        <svg className="hx-map-lines" width={box.w} height={box.h} viewBox={`0 0 ${box.w || 1} ${box.h || 1}`} aria-hidden="true">
          {NODES.map((n) => paths[n.id] && (
            <path key={n.id} d={paths[n.id]} className={`${n.planned ? 'planned' : ''}${sel === n.id ? ' on' : ''}`} />
          ))}
        </svg>
        {pulse && paths[pulse.id] && (
          <span key={pulse.n} className="hx-pulse" style={{ offsetPath: `path('${paths[pulse.id]}')` }} aria-hidden="true" />
        )}

        <div className="hx-map-col left">
          <span className="hx-map-group">{c.core.groups.machines}</span>
          {NODES.filter((n) => n.group === 'machines').map(node)}
        </div>

        <div className="hx-core" ref={core}>
          <span className="hx-core-tag"><i className="hx-dot on" />{c.core.coreTag}</span>
          <b className="hx-core-name">braven-agents</b>
          <p className="hx-core-role">{c.core.coreRole}</p>
        </div>

        <div className="hx-map-col right">
          {GROUPS.filter((g) => g !== 'machines').map((g) => (
            <div key={g} className="hx-map-sub">
              <span className="hx-map-group">{c.core.groups[g]}</span>
              {NODES.filter((n) => n.group === g).map(node)}
            </div>
          ))}
        </div>
      </div>

      {/* the selected system, below the map on wide screens */}
      <div className="hx-map-panel" aria-live="polite">
        <div className="hx-map-panel-head">
          <b>{name(current)}</b>
          <span>{t.role}</span>
        </div>
        {detail(current)}
      </div>
    </div>
  );
}
