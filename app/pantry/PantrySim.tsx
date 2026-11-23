'use client';
/*
  A working copy of the tracker's screen, beside a shelf of products to scan.

  It follows the firmware (src/main.cpp in Pantry_tracker_code): the same
  palette, the same urgency colours (red within a day, amber within a week),
  the same screens and gestures. HOME lists the pantry by expiry; SCAN NOW
  opens SCAN, which glows red until a product is held up; a new product opens
  ENTRY with the Days / Weeks / Months pickers, and SAVE puts it in its place;
  a product already on the list opens DETAIL instead. Swipe a card right to
  left for the bin, and swipe left to right anywhere to go back.

  Until the reader touches it, it plays a short demo by itself (only while it
  is on screen); the first touch hands it over for good. Product names are the
  ones the tracker showed, from Open Food Facts and GS1 China.

  The words around the screen come from the article's copy (`t`, the copy's
  `sim`); the screen itself keeps the firmware's English labels.
*/
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { fill } from '@/lib/fill';
import { Core } from './Core';
import type { PantryCopy } from './_copy/en';

type Prod = { code: string; name: string; brand: string; img?: string };
type Item = { id: number; code: string; days: number; ago: number };
type Screen = 'home' | 'scan' | 'entry' | 'detail';

const IMG = '/images/pantry/products/';
const PRODUCTS: Record<string, Prod> = {
  '7622210449283': { code: '7622210449283', name: 'Prince 全麦巧克力味', brand: 'LU, Prince / 300 g', img: IMG + 'prince.webp' },
  '8076809513753': { code: '8076809513753', name: 'Pesto alla Genovese 热那亚青酱', brand: 'Barilla / 190 g', img: IMG + 'pesto.webp' },
  '3329770077003': { code: '3329770077003', name: '原味 0% 脂肪 Skyr', brand: 'Yoplait / 800 g', img: IMG + 'skyr.webp' },
  '3017620425035': { code: '3017620425035', name: 'Nutella', brand: 'Nutella, Ferrero / 400 g', img: IMG + 'nutella.webp' },
  '5449000000996': { code: '5449000000996', name: 'Coca-Cola Original', brand: 'COCA-COLA SERVICES SA/NV / 330 ml', img: IMG + 'coke.webp' },
  '3256540000698': { code: '3256540000698', name: '牛奶面包', brand: 'Brioche Pasquier / x10 (350g)', img: IMG + 'painsaulait.webp' },
  '6909548500734': { code: '6909548500734', name: '冰红茶（柠檬味茶饮料）', brand: '天然 / 250毫升' },
  '3046920029759': { code: '3046920029759', name: '特级精细黑巧克力', brand: 'Lindt / 100g', img: IMG + 'lindt.webp' },
};
const SHELF = ['5449000000996', '3256540000698', '6909548500734', '3046920029759', '3017620425035'];
const START: Item[] = [
  { id: 1, code: '7622210449283', days: -1, ago: 0 },
  { id: 2, code: '8076809513753', days: 2, ago: 0 },
  { id: 3, code: '3329770077003', days: 5, ago: 0 },
  { id: 4, code: '3017620425035', days: 14, ago: 3 },
];

/* ── the firmware's labels ── */
const urgency = (d: number) => (d <= 1 ? 'is-red' : d <= 7 ? 'is-amber' : '');
const daysBig = (d: number) => (d < 0 ? 'Expired' : d === 0 ? 'Today' : d === 1 ? '1 Day' : `${d} Days`);
const ago = (d: number) => (d <= 0 ? 'today' : d === 1 ? '1d ago' : d < 7 ? `${d}d ago` : `${Math.floor(d / 7)}wk ago`);
const WD = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const pad = (n: number) => String(n).padStart(2, '0');
const fmt = (t: Date) => `${WD[t.getDay()]} ${t.getFullYear()}-${pad(t.getMonth() + 1)}-${pad(t.getDate())}`;
const addDays = (t: Date, n: number) => { const r = new Date(t); r.setDate(r.getDate() + n); return r; };
const expiryOf = (t: Date, d: number, w: number, m: number) => { const r = addDays(t, d + 7 * w); r.setMonth(r.getMonth() + m); return r; };
const between = (a: Date, b: Date) => Math.round((b.getTime() - a.getTime()) / 86400000);

/* ── EAN-13, encoded for real, so the shelf's barcodes scan ── */
const L = ['0001101', '0011001', '0010011', '0111101', '0100011', '0110001', '0101111', '0111011', '0110111', '0001011'];
const G = ['0100111', '0110011', '0011011', '0100001', '0011101', '0111001', '0000101', '0010001', '0001001', '0010111'];
const R = ['1110010', '1100110', '1101100', '1000010', '1011100', '1001110', '1010000', '1000100', '1001000', '1110100'];
const PAR = ['LLLLLL', 'LLGLGG', 'LLGGLG', 'LLGGGL', 'LGLLGG', 'LGGLLG', 'LGGGLL', 'LGLGLG', 'LGLGGL', 'LGGLGL'];
function ean13(code: string) {
  const d = code.split('').map(Number);
  let bits = '101';
  for (let i = 1; i <= 6; i++) bits += (PAR[d[0]][i - 1] === 'L' ? L : G)[d[i]];
  bits += '01010';
  for (let i = 7; i <= 12; i++) bits += R[d[i]];
  return bits + '101';
}
function Barcode({ code }: { code: string }) {
  const bits = useMemo(() => ean13(code), [code]);
  const guard = (i: number) => i < 3 || (i >= 45 && i < 50) || i >= 92;
  const bars: React.ReactNode[] = [];
  for (let i = 0; i < bits.length; i++) {
    if (bits[i] !== '1') continue;
    let j = i; while (j + 1 < bits.length && bits[j + 1] === '1' && guard(j + 1) === guard(i)) j++;
    bars.push(<rect key={i} x={i + 7} y={0} width={j - i + 1} height={guard(i) ? 46 : 40} />);
    i = j;
  }
  return (
    <svg className="pxs-bc" viewBox="0 0 109 56" aria-hidden="true">
      {bars}
      <text x="2" y="54">{code[0]}</text>
      <text x="12" y="54" textLength="40">{code.slice(1, 7)}</text>
      <text x="58" y="54" textLength="40">{code.slice(7)}</text>
    </svg>
  );
}

/* ── the little icons the firmware draws ── */
const Chevron = ({ up }: { up?: boolean }) => (
  <svg viewBox="0 0 24 14" aria-hidden="true"><path d={up ? 'M2 12 12 2l10 10' : 'M2 2l10 10L22 2'} fill="none" stroke="currentColor" strokeWidth="2" /></svg>
);
const Status = () => (
  <span className="pxs-status" aria-hidden="true">
    <svg viewBox="0 0 16 14"><path d="M8 1 1 7.5h2.2V13h3.6V9h2.4v4h3.6V7.5H15z" fill="#30D158" /></svg>
    <svg viewBox="0 0 18 14"><path d="M1 5a11 11 0 0 1 16 0M3.6 7.6a7.3 7.3 0 0 1 10.8 0M6.3 10.2a3.5 3.5 0 0 1 5.4 0" fill="none" stroke="#F5F5F7" strokeWidth="2" strokeLinecap="round" /><circle cx="9" cy="12.6" r="1.3" fill="#F5F5F7" /></svg>
    <svg viewBox="0 0 22 12"><rect x="1" y="1" width="17" height="10" rx="2" fill="none" stroke="#F5F5F7" strokeWidth="1.6" /><rect x="3" y="3" width="13" height="6" rx="1" fill="#F5F5F7" /><rect x="19" y="4" width="2" height="4" rx="1" fill="#F5F5F7" /></svg>
  </span>
);
const Bin = () => (
  <svg viewBox="0 0 20 22" aria-hidden="true"><path d="M2 5h16M7 5V2.5h6V5M4.5 5l1 15h9l1-15M8.5 9v7M11.5 9v7" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const Thumb = ({ p, big }: { p: Prod; big?: boolean }) => (
  <span className={`pxs-thumb${big ? ' big' : ''}`}>{p.img ? <img src={p.img} alt="" draggable={false} /> : null}</span>
);

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function PantrySim({ t }: { t: PantryCopy['sim'] }) {
  const root = useRef<HTMLDivElement>(null);
  const [today, setToday] = useState<Date | null>(null);
  const [items, setItems] = useState<Item[]>(START);
  const [screen, setScreen] = useState<Screen>('home');
  const [dir, setDir] = useState<'fwd' | 'back'>('fwd');
  const [cur, setCur] = useState<string | null>(null);     // the product on ENTRY / DETAIL
  const [pick, setPick] = useState({ d: 0, w: 1, m: 0 });
  const [open, setOpen] = useState<number | null>(null);   // the card swiped open
  const [drag, setDrag] = useState<{ id: number; x: number } | null>(null);
  const [gone, setGone] = useState<number | null>(null);   // the card on its way out
  const [fresh, setFresh] = useState<number | null>(null); // the card just saved
  const [toast, setToast] = useState<string | null>(null);
  const [beam, setBeam] = useState<string | null>(null);   // the shelf product under the scanner
  const [flash, setFlash] = useState(0);
  const [press, setPress] = useState<string | null>(null); // the demo's "finger"
  const [manual, setManual] = useState(false);
  const [inView, setInView] = useState(false);
  const busy = useRef(false);
  const nextId = useRef(10);
  const toastT = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => { const t = new Date(); t.setHours(0, 0, 0, 0); setToday(t); }, []);

  const sorted = useMemo(() => [...items].sort((a, b) => a.days - b.days || a.id - b.id), [items]);
  const go = useCallback((s: Screen, d: 'fwd' | 'back' = 'fwd') => { setDir(d); setScreen(s); setOpen(null); }, []);
  const say = (s: string) => { setToast(s); clearTimeout(toastT.current); toastT.current = setTimeout(() => setToast(null), 2600); };

  /* A product held up to the scanner: the screen flashes, then it opens. */
  const scanned = useCallback(async (code: string) => {
    if (busy.current) return;
    busy.current = true;
    if (screen !== 'scan') { go('scan'); await sleep(900); }
    setBeam(code); await sleep(650);
    setFlash((f) => f + 1); setBeam(null); await sleep(180);
    setCur(code);
    if (items.some((i) => i.code === code)) go('detail');
    else { setPick({ d: 0, w: 1, m: 0 }); go('entry'); }
    busy.current = false;
  }, [screen, items, go]);

  const save = useCallback(() => {
    if (!cur || !today) return;
    const days = between(today, expiryOf(today, pick.d, pick.w, pick.m));
    const id = nextId.current++;
    setItems((xs) => [...xs, { id, code: cur, days, ago: 0 }]);
    setFresh(id); setTimeout(() => setFresh(null), 1600);
    say(`Added ${PRODUCTS[cur].name}`);
    go('home', 'back');
  }, [cur, today, pick, go]);

  const remove = useCallback((id: number, back?: boolean) => {
    setGone(id); setOpen(null);
    setTimeout(() => { setItems((xs) => xs.filter((x) => x.id !== id)); setGone(null); }, 320);
    if (back) go('home', 'back');
  }, [go]);

  const bump = (k: 'd' | 'w' | 'm', by: number) => setPick((p) => ({ ...p, [k]: Math.max(0, Math.min(k === 'm' ? 24 : 99, p[k] + by)) }));
  const reset = () => { setItems(START); setCur(null); setOpen(null); setToast(null); go('home', 'back'); };

  /* ── gestures: swipe a card left for the bin, swipe right anywhere to go back ── */
  const g = useRef<{ x: number; y: number; id: number | null; moved: boolean; base: number } | null>(null);
  const dragged = useRef(false); // a drag just ended: the click that follows it is not a tap
  const UNIT = () => (root.current?.querySelector('.pt-core-screen') as HTMLElement | null)?.clientWidth ?? 320;
  const onDown = (e: React.PointerEvent, id: number | null) => {
    g.current = { x: e.clientX, y: e.clientY, id, moved: false, base: id !== null && open === id ? -0.19 * UNIT() : 0 };
  };
  const onMove = (e: React.PointerEvent) => {
    const s = g.current; if (!s) return;
    const dx = e.clientX - s.x, dy = e.clientY - s.y;
    if (!s.moved && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) { s.moved = true; (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId); }
    if (s.moved && s.id !== null && screen === 'home') setDrag({ id: s.id, x: Math.min(0, Math.max(-0.26 * UNIT(), s.base + dx)) });
  };
  const onUp = (e: React.PointerEvent) => {
    const s = g.current; g.current = null; if (!s) return;
    const dx = e.clientX - s.x;
    if (s.moved) {
      dragged.current = true; setTimeout(() => { dragged.current = false; }, 0);
      if (dx > 40 && screen !== 'home') { go('home', 'back'); setDrag(null); return; }
      if (s.id !== null && screen === 'home') setOpen(s.base + dx < -0.09 * UNIT() ? s.id : null);
      else if (dx > 40) setOpen(null);
      setDrag(null);
      return;
    }
    setDrag(null);
  };
  const tapCard = (it: Item) => {
    if (dragged.current) return;
    if (open !== null) { setOpen(null); return; }
    setCur(it.code); go('detail');
  };

  /* ── the demo it plays by itself until touched ── */
  /* a card just saved scrolls into view inside the list (never the page) */
  useEffect(() => {
    if (fresh === null) return;
    const t = setTimeout(() => {
      const row = root.current?.querySelector<HTMLElement>('.pxs-row.is-fresh');
      const list = row?.parentElement;
      if (!row || !list) return;
      const pad = list.clientHeight * 0.18;
      if (row.offsetTop + row.offsetHeight > list.scrollTop + list.clientHeight - pad) list.scrollTo({ top: row.offsetTop + row.offsetHeight - list.clientHeight + pad, behavior: 'smooth' });
      else if (row.offsetTop < list.scrollTop) list.scrollTo({ top: row.offsetTop, behavior: 'smooth' });
    }, 320);
    return () => clearTimeout(t);
  }, [fresh, screen]);

  const viewRef = useRef(inView); viewRef.current = inView;
  const manualRef = useRef(manual); manualRef.current = manual;
  useEffect(() => {
    const el = root.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!today || manual || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let stop = false;
    const wait = async (ms: number) => {
      let left = ms;
      while (left > 0) { if (stop || manualRef.current) throw 0; await sleep(100); if (viewRef.current) left -= 100; }
    };
    const tap = async (id: string, then: () => void) => { setPress(id); await wait(260); setPress(null); then(); };
    (async () => {
      try {
        await wait(1400);
        for (;;) {
          await tap('scan', () => go('scan'));
          await wait(1500);
          setBeam('5449000000996'); await wait(700); setFlash((f) => f + 1); setBeam(null); await wait(180);
          setCur('5449000000996'); setPick({ d: 0, w: 1, m: 0 }); go('entry');
          await wait(1300);
          await tap('d+', () => bump('d', 1)); await wait(380);
          await tap('d+', () => bump('d', 1)); await wait(900);
          await tap('save', () => { /* save reads state, so set it up directly */ });
          setItems((xs) => [...xs, { id: 99, code: '5449000000996', days: 9, ago: 0 }]);
          setFresh(99); say('Added Coca-Cola Original'); go('home', 'back');
          await wait(2600); setFresh(null);
          setOpen(1); await wait(1200);
          await tap('bin-1', () => remove(1));
          await wait(1800);
          setBeam('3017620425035'); go('scan'); await wait(900); await wait(600); setFlash((f) => f + 1); setBeam(null); await wait(180);
          setCur('3017620425035'); go('detail');
          await wait(2600);
          go('home', 'back');
          await wait(3200);
          setItems(START); setCur(null); setOpen(null);
          await wait(1600);
        }
      } catch { /* handed over, or gone */ }
    })();
    return () => { stop = true; };
  }, [today, manual, go, remove]);

  const takeOver = () => { if (!manual) { setManual(true); setPress(null); setBeam(null); } };

  const p = cur ? PRODUCTS[cur] : null;
  const curItem = cur ? items.find((i) => i.code === cur) : undefined;
  const expiry = today && p ? expiryOf(today, pick.d, pick.w, pick.m) : null;
  const left = today && expiry ? between(today, expiry) : 0;

  const live =
    screen === 'scan' ? t.live.scan
    : screen === 'entry' && p ? fill(t.live.entry, { name: p.name })
    : screen === 'detail' && p ? fill(t.live.detail, { name: p.name, days: curItem ? daysBig(curItem.days) : '' })
    : fill(t.live.home, { n: sorted.length });

  return (
    <div ref={root} className={`pxs${manual ? ' is-manual' : ''}`} data-no-zoom onPointerDownCapture={takeOver} onKeyDownCapture={takeOver}>
      <div className="pxs-device">
        <Core className="pxs-core">
          <div className="pxs-screen" onPointerDown={(e) => onDown(e, null)} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={() => { g.current = null; setDrag(null); }}>
            <div key={screen + (screen === 'detail' || screen === 'entry' ? cur : '')} className={`pxs-page is-${dir}`}>
              {screen === 'home' && (
                <>
                  <div className="pxs-bar">
                    <span className="pxs-pill">Pantry <i className="pxs-caret" /></span>
                    <span className="pxs-round">+</span>
                    <Status />
                  </div>
                  <ul className="pxs-list" aria-label={t.list}>
                    {sorted.map((it) => {
                      const q = PRODUCTS[it.code];
                      const x = drag?.id === it.id ? drag.x : open === it.id ? -0.19 * UNIT() : 0;
                      return (
                        <li key={it.id} className={`pxs-row${gone === it.id ? ' is-gone' : ''}${fresh === it.id ? ' is-fresh' : ''}`}>
                          <button type="button" className={`pxs-bin${press === `bin-${it.id}` ? ' is-press' : ''}`} tabIndex={open === it.id ? 0 : -1}
                            aria-label={fill(t.remove, { name: q.name })} onClick={() => remove(it.id)}><Bin /></button>
                          <button type="button" className={`pxs-card${drag?.id === it.id ? ' is-drag' : ''}`} style={{ transform: `translateX(${x}px)` }}
                            onPointerDown={(e) => { e.stopPropagation(); onDown(e, it.id); }} onPointerMove={onMove} onPointerUp={onUp}
                            onClick={() => tapCard(it)} aria-label={fill(t.card, { name: q.name, days: daysBig(it.days) })}>
                            <Thumb p={q} />
                            <span className="pxs-name">{q.name}</span>
                            <span className="pxs-brand">{q.brand.split(' / ')[0]}</span>
                            <span className="pxs-ago">{ago(it.ago)}</span>
                            <span className={`pxs-days ${urgency(it.days)}`}>{daysBig(it.days)}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                  {toast && <span className="pxs-toast">{toast}</span>}
                  <button type="button" className={`pxs-cta${press === 'scan' ? ' is-press' : ''}`} onClick={() => go('scan')}>SCAN NOW</button>
                </>
              )}

              {screen === 'scan' && (
                <div className="pxs-scan" key={flash}>
                  <i className="pxs-glow" aria-hidden="true" />
                  <b>Scanning</b>
                  <span className="pxs-pill is-mid">Pantry <i className="pxs-caret" /></span>
                  {flash > 0 && <i className="pxs-flash" aria-hidden="true" />}
                </div>
              )}

              {screen === 'entry' && p && (
                <>
                  <div className="pxs-bar">
                    <span className="pxs-pill">Pantry <i className="pxs-caret" /></span>
                    <button type="button" className="pxs-round" aria-label={t.cancel} onClick={() => go('home', 'back')}>✕</button>
                    <Status />
                  </div>
                  <div className="pxs-sheet">
                    <div className="pxs-prod">
                      <Thumb p={p} big />
                      <span className="pxs-name">{p.name}</span>
                      <span className="pxs-brand">{p.brand}</span>
                      <span className="pxs-brand">{expiry ? `${fmt(expiry)}  (${daysBig(left)})` : ''}</span>
                    </div>
                    <div className="pxs-pickers">
                      {(['d', 'w', 'm'] as const).map((k) => (
                        <div className="pxs-picker" key={k}>
                          <span>{k === 'd' ? 'Days' : k === 'w' ? 'Weeks' : 'Months'}</span>
                          <button type="button" className={press === `${k}+` ? 'is-press' : ''} aria-label={t.more[k]} onClick={() => bump(k, 1)}><Chevron up /></button>
                          <b>{pick[k]}</b>
                          <button type="button" aria-label={t.fewer[k]} onClick={() => bump(k, -1)}><Chevron /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button type="button" className={`pxs-cta is-green${press === 'save' ? ' is-press' : ''}`} onClick={save}>SAVE</button>
                </>
              )}

              {screen === 'detail' && p && (
                <>
                  <div className="pxs-bar">
                    <span className="pxs-pill">Pantry <i className="pxs-caret" /></span>
                    <button type="button" className="pxs-round" aria-label={t.back} onClick={() => go('home', 'back')}>✕</button>
                    <Status />
                  </div>
                  <div className="pxs-sheet is-detail">
                    <div className="pxs-prod">
                      <Thumb p={p} big />
                      <span className="pxs-name">{p.name}</span>
                      <span className="pxs-brand">{p.brand}</span>
                      <span className="pxs-brand">added {ago(curItem?.ago ?? 0)} / {p.code}</span>
                    </div>
                    <span className="pxs-label">EXPIRES</span>
                    <span className="pxs-date">{today && curItem ? fmt(addDays(today, curItem.days)) : ''}</span>
                    {curItem && <span className={`pxs-days is-detail ${urgency(curItem.days)}`}>{daysBig(curItem.days)}</span>}
                  </div>
                  <button type="button" className="pxs-cta is-red" onClick={() => curItem && remove(curItem.id, true)}>DELETE</button>
                </>
              )}
            </div>
          </div>
        </Core>
        <p className="pxs-live" aria-live="polite">{live}</p>
      </div>

      <div className="pxs-shelf">
        <p className="pxs-hint">{screen === 'scan' ? t.hintScan : t.hint}</p>
        <ul>
          {SHELF.map((code) => {
            const q = PRODUCTS[code];
            const saved = items.some((i) => i.code === code);
            return (
              <li key={code}>
                <button type="button" className={`pxs-item${beam === code ? ' is-beam' : ''}`} onClick={() => scanned(code)}
                  aria-label={fill(saved ? t.scanSaved : t.scan, { name: q.name })}>
                  <Thumb p={q} />
                  <span className="pxs-item-name">{t.shelf[code]}{saved && <em>{t.onList}</em>}</span>
                  <Barcode code={code} />
                  <i className="pxs-laser" aria-hidden="true" />
                </button>
              </li>
            );
          })}
        </ul>
        <button type="button" className="pxs-reset" onClick={reset}>{t.reset}</button>
      </div>
    </div>
  );
}
