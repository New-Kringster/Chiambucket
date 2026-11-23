'use client';
import { useMemo, useState } from 'react';
import Story, { type Frame } from './Story';
import ConfigKingSim, { CK_STYLE, CkViewContext, type CkView, type Press, type SimScene } from './ConfigKingSim';
import { IcScreen } from '../../components/Icons';
import type { WaterslopCopy } from './_copy';

/* On the chapter's first slide: past the eight steps, straight to the last frame,
   where the simulator is the reader's to use. Lands where the stage's own dots do. */
function SkipToSim({ label }: { label: string }) {
  const go = () => {
    const el = document.getElementById('configking');
    if (!el) return;
    const n = el.querySelectorAll('.ws-frame').length;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const y = top + ((n - 1 + 0.3) / n) * (el.offsetHeight - window.innerHeight);
    window.scrollTo({ top: y, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };
  return <button type="button" className="ws-btn ck-skipsim" onClick={go}><IcScreen /> {label}</button>;
}

/* ConfigKingChapter: the setup procedure, walked on the real Cardputer (a photo,
   its screen live and magnified above it). It follows straight on from the
   DrumNet film with no cover: the first frame is that same reading, 0092.07, as
   ConfigKing shows it. Each step frame then replays the press that gets there
   from the step before (the key lights on the photo, a chip names it, the screen
   moves on); the last frame hands the reader the keys. Step text is the report's,
   and lives in the page's copy (configking). */

type CkCopy = WaterslopCopy['configking'];
type StepScene = keyof CkCopy['steps'];
type StepFrame = { scene: StepScene; from?: SimScene; via?: (t: CkCopy['press']) => Press[] };
/* The Cardputer's enter key is printed "ok". */
const ok = (label: string, wait?: number): Press => ({ key: { enter: true }, cap: 'enter', name: 'ok ↵', label, wait });
/* Each step's words are configking.steps in the page's copy; the chip beside the pressed key reads configking.press. */
const STEPS: StepFrame[] = [
  { scene: 'nearby', from: 'free', via: () => [] },
  { scene: 'identify', from: 'nearby', via: (p) => [ok(p.connect, 1900)] },
  { scene: 'layout', from: 'identify', via: (p) => [ok(p.save)] },
  { scene: 'camera', from: 'layout', via: (p) => [ok(p.next)] },
  { scene: 'roi', from: 'camera', via: (p) => [ok(p.next)] },
  { scene: 'read', from: 'roi', via: (p) => [ok(p.next, 1700)] },
  { scene: 'radio', from: 'read', via: (p) => [ok(p.next, 1700)] },
  { scene: 'review', from: 'radio', via: (p) => [ok(p.next)] },
  { scene: 'done', from: 'review', via: (p) => [ok(p.finish, 1500)] },
  { scene: 'connected', from: 'done', via: (p) => [ok(p.continue)] },
];

const buildFrames = (view: CkView, t: CkCopy): Frame[] => [
  {
    // The bridge from the film: the same reading, as the setup tool shows it.
    id: 'ck-intro', eyebrow: t.intro.eyebrow, title: t.intro.title, cls: `ck-first ckf${view === 'close' ? ' ck-bleed' : ''}`,
    body: (
      <>
        {t.intro.before}
        <SkipToSim label={t.skipToSim} />
        {t.intro.after}
      </>
    ),
    visual: <ConfigKingSim scene="reread" keys={false} />,
  },
  ...STEPS.map((s): Frame => ({
    id: `ck-${s.scene}`, eyebrow: t.steps[s.scene].eyebrow, title: t.steps[s.scene].title, body: <p>{t.steps[s.scene].body}</p>, cls: `ckf${view === 'close' ? ' ck-bleed' : ''}`,
    visual: <ConfigKingSim scene={s.scene} keys={false} from={s.from} via={s.via?.(t.press)} />,
  })),
  {
    id: 'ck-free', eyebrow: t.free.eyebrow, title: t.free.title, wide: true, cls: `tall ckf${view === 'close' ? ' ck-bleed' : ''}`,
    body: t.free.body,
    visual: <ConfigKingSim scene="free" keys large />,
  },
];

/* No cover: the chapter carries straight on from the DrumNet film. */
export default function ConfigKingChapter({ chapter, t }: { chapter: string; t: CkCopy }) {
  // Zoomed in by default; the choice carries across every frame of the chapter.
  const [view, setView] = useState<CkView>('close');
  const frames = useMemo(() => buildFrames(view, t), [view, t]);
  const ctx = useMemo(() => ({ view, setView }), [view]);
  return (
    <CkViewContext.Provider value={ctx}>
      <Story id="configking" chapter={chapter} title={t.title} frames={frames} per={0.85} />
      <style>{CK_STYLE}</style>
    </CkViewContext.Provider>
  );
}
