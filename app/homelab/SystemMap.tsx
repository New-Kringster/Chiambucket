'use client';
import { useState, type CSSProperties } from 'react';

/* ── Topology model (viewBox 0 0 1120 640) ── */
type Vlan = 'unraid' | 'server' | 'default' | 'iot' | 'core';
interface Node {
  id: string; x: number; y: number; w: number; h: number;
  label: string; sub: string; vlan: Vlan; detail: string;
}
const N: Record<string, Node> = {
  internet: { id: 'internet', x: 500, y: 22, w: 120, h: 46, label: 'Internet', sub: 'public edge', vlan: 'core',
    detail: 'The open internet. Inbound traffic hits a single public address and is handed to the gateway; there is no direct path to anything behind it.' },
  udm: { id: 'udm', x: 466, y: 112, w: 188, h: 60, label: 'UDM Pro', sub: 'gateway · firewall · RADIUS', vlan: 'core',
    detail: 'The UniFi Dream Machine Pro is the brain: gateway, firewall, controller and RADIUS server. It enforces which VLAN can talk to which, and authenticates the WPA3-Enterprise network.' },
  sw1: { id: 'sw1', x: 142, y: 246, w: 196, h: 56, label: 'USW Pro Max 24', sub: 'server rack', vlan: 'core',
    detail: 'The 24-port workhorse switch wiring up everything in the server rack. Every server lands here on a redundant pair of links.' },
  sw2: { id: 'sw2', x: 476, y: 246, w: 168, h: 56, label: 'USW Flex 2.5G', sub: 'general', vlan: 'core',
    detail: 'A 2.5-gigabit Flex switch handling the faster general-purpose devices around the apartment.' },
  sw3: { id: 'sw3', x: 842, y: 246, w: 176, h: 56, label: 'USW Lite 8 PoE', sub: 'powers the APs', vlan: 'core',
    detail: 'An 8-port PoE switch that both connects and powers the five wireless access points over a single cable each.' },
  newmain: { id: 'newmain', x: 28, y: 410, w: 124, h: 64, label: 'NewMain', sub: 'Unraid · storage', vlan: 'unraid',
    detail: 'The Unraid server sits alone on its own VLAN. It holds the storage and the bulk of the Docker stack, reachable from trusted VLANs but firewalled off from the isolated IoT network.' },
  caca: { id: 'caca', x: 178, y: 410, w: 124, h: 64, label: 'CaCa', sub: 'Proxmox · 24/7', vlan: 'server',
    detail: 'The always-on half of the Proxmox PXE cluster, on the dedicated server VLAN with Adell.' },
  adell: { id: 'adell', x: 328, y: 410, w: 124, h: 64, label: 'Adell', sub: 'Proxmox · on demand', vlan: 'server',
    detail: 'The heavy Proxmox node, woken on demand. Shares the server VLAN with CaCa for live migration and PXE.' },
  clients: { id: 'clients', x: 476, y: 412, w: 168, h: 60, label: 'Workstations', sub: 'laptops · desktops', vlan: 'default',
    detail: 'Everyday devices live on the default VLAN. They can reach the servers, but the IoT network cannot reach them back.' },
  aps: { id: 'aps', x: 842, y: 410, w: 176, h: 62, label: '5× UniFi APs', sub: 'wireless fabric', vlan: 'core',
    detail: 'Five access points broadcast two separate wireless networks across the apartment, all powered over PoE from the Lite 8.' },
  wmain: { id: 'wmain', x: 772, y: 548, w: 150, h: 56, label: 'Main WLAN', sub: 'WPA3-Enterprise', vlan: 'default',
    detail: 'The primary Wi-Fi uses WPA3-Enterprise with RADIUS auth from the UDM Pro, so every device gets its own credentials. Pure enterprise-networking practice, at home.' },
  wiot: { id: 'wiot', x: 938, y: 548, w: 146, h: 56, label: 'IoT WLAN', sub: 'isolated', vlan: 'iot',
    detail: 'The IoT network is walled off by stricter firewall rules. Smart devices get internet, but cannot reach any other VLAN. This is the one segment that cannot talk to the rest.' },
};

interface Edge { from: string; to: string; redundant?: boolean }
const EDGES: Edge[] = [
  { from: 'internet', to: 'udm' },
  { from: 'udm', to: 'sw1' }, { from: 'udm', to: 'sw2' }, { from: 'udm', to: 'sw3' },
  { from: 'sw1', to: 'newmain', redundant: true }, { from: 'sw1', to: 'caca', redundant: true }, { from: 'sw1', to: 'adell', redundant: true },
  { from: 'sw2', to: 'clients' },
  { from: 'sw3', to: 'aps' },
  { from: 'aps', to: 'wmain' }, { from: 'aps', to: 'wiot' },
];

const VLAN_COLOR: Record<Vlan, string> = {
  unraid: '#38a8e8', server: '#7b6fe0', default: '#6f9fd8', iot: '#e0a84e', core: '#8a9bb0',
};

const LEGEND: { v: Vlan; label: string }[] = [
  { v: 'unraid', label: 'Unraid VLAN' },
  { v: 'server', label: 'Server VLAN' },
  { v: 'default', label: 'Default VLAN' },
  { v: 'iot', label: 'IoT · isolated' },
];

const VLAN_INFO: Record<Vlan, { label: string; blurb: string }> = {
  unraid: { label: 'Unraid VLAN', blurb: 'NewMain sits alone on its own segment. Trusted VLANs can reach it for storage and apps, but it is firewalled off from the isolated IoT network.' },
  server: { label: 'Server VLAN', blurb: 'The Proxmox PXE cluster, CaCa and Adell, share a dedicated segment so they can live-migrate and network-boot between each other.' },
  default: { label: 'Default VLAN', blurb: 'Everyday workstations and the main WPA3-Enterprise Wi-Fi. They can reach the servers; the IoT network can never reach back.' },
  iot: { label: 'IoT · isolated', blurb: 'Smart devices get internet and nothing else. Stricter firewall rules wall this segment off from every other VLAN on the network.' },
  core: { label: 'Core network', blurb: 'The gateway and switches that route between every segment.' },
};

const cx = (n: Node) => n.x + n.w / 2;
const cy = (n: Node) => n.y + n.h / 2;

export default function SystemMap() {
  const [selected, setSelected] = useState<string>('udm');
  const [pinned, setPinned] = useState<Vlan | null>(null);
  const [hovered, setHovered] = useState<Vlan | null>(null);
  const active = hovered ?? pinned; // hover previews a segment, click pins it

  const isCore = (id: string) => N[id].vlan === 'core';
  const nodeDim = (n: Node) => !!active && n.vlan !== active && n.vlan !== 'core';
  const nodeSpot = (n: Node) => !!active && n.vlan === active;
  const edgeHot = (e: Edge) => !!active && (N[e.from].vlan === active || N[e.to].vlan === active);
  const edgeDim = (e: Edge) => {
    if (active) {
      const otherBranch = (!isCore(e.from) && N[e.from].vlan !== active) || (!isCore(e.to) && N[e.to].vlan !== active);
      return otherBranch && !edgeHot(e);
    }
    return selected ? selected !== e.from && selected !== e.to : false;
  };

  const pickVlan = (v: Vlan) => { setPinned((p) => (p === v ? null : v)); setSelected(''); };
  const pickNode = (id: string) => { setSelected(id); setPinned(null); setHovered(null); };

  const sel = selected ? N[selected] : null;

  return (
    <div className="hl2-map-wrap">
      <div className="hl2-map-controls">
        <div className="hl2-legend">
          {LEGEND.map((l) => (
            <button
              key={l.v}
              type="button"
              className={`hl2-legend-item${pinned === l.v ? ' on' : ''}`}
              style={{ '--lc': VLAN_COLOR[l.v] } as CSSProperties}
              onClick={() => pickVlan(l.v)}
              onMouseEnter={() => setHovered(l.v)}
              onMouseLeave={() => setHovered(null)}
              aria-pressed={pinned === l.v}
            >
              <i style={{ background: VLAN_COLOR[l.v] }} />{l.label}
            </button>
          ))}
        </div>
        <div className="hl2-map-buttons">
          {pinned
            ? <button type="button" className="hl2-btn small ghost" onClick={() => setPinned(null)}>Clear segment</button>
            : <span className="hl2-map-tip">Hover or tap a VLAN to trace its segment</span>}
        </div>
      </div>

      <div className="hl2-map-scroll">
        <svg className="hl2-map-svg" viewBox="0 0 1120 640" role="img" aria-label="Network topology diagram">
          {/* VLAN zones (only the two adjacent server-rack groups get a backing) */}
          <g className="hl2-zones">
            <Zone x={19} y={384} w={142} h={98} color={VLAN_COLOR.unraid} label="UNRAID VLAN" active={active === 'unraid'} />
            <Zone x={169} y={384} w={292} h={98} color={VLAN_COLOR.server} label="SERVER VLAN" dashed active={active === 'server'} />
          </g>

          {/* edges */}
          <g>
            {EDGES.map((e, i) => {
              const a = N[e.from], b = N[e.to];
              const x1 = cx(a), y1 = a.y + a.h, x2 = cx(b), y2 = b.y;
              const hot = edgeHot(e);
              const dim = edgeDim(e);
              return (
                <g key={i} opacity={dim ? 0.14 : 1} style={{ transition: 'opacity .35s' }}>
                  <path d={`M${x1},${y1} C${x1},${(y1 + y2) / 2} ${x2},${(y1 + y2) / 2} ${x2},${y2}`}
                    className={`hl2-edge${hot ? ' hot' : ''}`} style={hot && active ? { stroke: VLAN_COLOR[active] } : undefined} fill="none" />
                  {e.redundant && (
                    <path d={`M${x1 + 5},${y1} C${x1 + 5},${(y1 + y2) / 2} ${x2 + 5},${(y1 + y2) / 2} ${x2 + 5},${y2}`}
                      className="hl2-edge redundant" fill="none" />
                  )}
                </g>
              );
            })}
          </g>

          {/* nodes */}
          {Object.values(N).map((n) => {
            const color = VLAN_COLOR[n.vlan];
            const isSel = !active && selected === n.id;
            return (
              <g key={n.id} className="hl2-node" transform={`translate(${n.x},${n.y})`}
                opacity={nodeDim(n) ? 0.26 : 1} style={{ transition: 'opacity .35s' }}
                onClick={() => pickNode(n.id)} tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') pickNode(n.id); }} role="button" aria-label={n.label}>
                <rect width={n.w} height={n.h} rx={13}
                  className={`hl2-node-box${isSel ? ' sel' : ''}${nodeSpot(n) ? ' spot' : ''}${n.vlan === 'iot' ? ' iot' : ''}`}
                  style={{ '--nc': color } as CSSProperties} />
                <text x={n.w / 2} y={n.h / 2 - 3} className="hl2-node-label">{n.label}</text>
                <text x={n.w / 2} y={n.h / 2 + 15} className="hl2-node-sub">{n.sub}</text>
                <circle cx={14} cy={14} r={4} fill={color} className="hl2-node-led" />
              </g>
            );
          })}
        </svg>
      </div>

      {/* detail / segment panel */}
      <div className="hl2-map-panel">
        {active ? (
          <div className="hl2-detail">
            <div className="hl2-detail-head">
              <span className="hl2-detail-vlan" style={{ '--nc': VLAN_COLOR[active] } as CSSProperties}>{active === 'core' ? 'core network' : `${active} vlan`}</span>
              <h4>{VLAN_INFO[active].label}</h4>
            </div>
            <p>{VLAN_INFO[active].blurb}</p>
          </div>
        ) : sel ? (
          <div className="hl2-detail">
            <div className="hl2-detail-head">
              <span className="hl2-detail-vlan" style={{ '--nc': VLAN_COLOR[sel.vlan] } as CSSProperties}>{sel.vlan === 'core' ? 'core network' : `${sel.vlan} vlan`}</span>
              <h4>{sel.label}</h4>
              <span className="hl2-detail-sub">{sel.sub}</span>
            </div>
            <p>{sel.detail}</p>
          </div>
        ) : (
          <p className="hl2-detail-hint">Tap any node to inspect it.</p>
        )}
      </div>
    </div>
  );
}

function Zone({ x, y, w, h, color, label, dashed, active }: { x: number; y: number; w: number; h: number; color: string; label: string; dashed?: boolean; active?: boolean }) {
  return (
    <g opacity={active ? 1 : 0.9} style={{ transition: 'opacity .35s' }}>
      <rect x={x} y={y} width={w} height={h} rx={16} fill={color} fillOpacity={active ? 0.12 : 0.05}
        stroke={color} strokeOpacity={active ? 0.7 : 0.34} strokeWidth={1.2} strokeDasharray={dashed ? '5 5' : undefined}
        style={{ transition: 'fill-opacity .35s, stroke-opacity .35s' }} />
      <text x={x + 10} y={y + 18} className="hl2-zone-label" fill={color} fillOpacity={active ? 1 : 0.85}>{label}</text>
    </g>
  );
}
