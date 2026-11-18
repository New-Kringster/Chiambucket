/*
  The AtomS3R and its screen (server-safe, no state).

  Atom   the AtomS3R straight on, rendered from M5Stack's own model
         (M5_Hardware, Products/C126_AtomS3R/Structures/AtomS3R.stl, MIT,
         copyright M5Stack) with three.js: public/images/scroll-ruler/atoms3r-front.webp,
         961 x 960. The cap's display window is 16.2 mm square and lands at
         16.36 % to 83.7 % of the picture both ways; the screen box sits on it.
  Screen the firmware's three screens (src/main.cpp, ui::drawMeasuring,
         drawCalibrating, drawConfirming) at their own coordinates on the
         128 x 128 panel, in --u (one panel pixel). Colours are the firmware's
         RGB565 values converted: kLive 0x07E8, kCal 0x4D7F, kWarn 0xFD20,
         kDim 0x8410, the rule 0x2104 and the hint grey 0x4208.
*/
import type { ReactNode } from 'react';

export type Mode = 'calibrating' | 'confirming' | 'measuring';
export type ScreenState = { mode: Mode; pressed: boolean; steps: number; calSteps: number; per10cm: number };

export function Atom({ children, className, label, onPress }: { children: ReactNode; className?: string; label?: string; onPress?: boolean }) {
  return (
    <div className={`sr-atom${className ? ` ${className}` : ''}${onPress ? ' is-button' : ''}`} data-no-zoom role={label ? 'img' : undefined} aria-label={label}>
      <img className="sr-atom-frame" src="/images/scroll-ruler/atoms3r-front.webp" alt="" aria-hidden="true" draggable={false} />
      <div className="sr-atom-screen">{children}</div>
    </div>
  );
}

const fmt1 = (v: number) => v.toFixed(1); // like printf("%.1f"), so a hair below zero reads -0.0, as on the device

function Header({ title, cls, tag, tagCls }: { title: string; cls?: string; tag?: string; tagCls?: string }) {
  return (
    <>
      <span className={`srs-title ${cls ?? ''}`}>{title}</span>
      {tag && <span className={`srs-tag ${tagCls ?? ''}`}>{tag}</span>}
      <i className="srs-rule" />
    </>
  );
}

/* The panel's contents for one state, positioned exactly as the firmware draws them. */
export function Screen({ s }: { s: ScreenState }) {
  if (s.mode === 'measuring') {
    const mm = s.per10cm ? (s.steps * 100) / s.per10cm : 0;
    const live = s.pressed;
    const res = s.per10cm ? 100 / Math.abs(s.per10cm) : 0;
    const big = fmt1(mm / 10);
    return (
      <div className="srs">
        <Header title="RULER" tag={live ? 'LIVE' : 'IDLE'} tagCls={live ? 'is-live' : 'is-dim'} />
        <b className={`srs-big${live ? ' is-live' : ''}${big.length > 5 ? ' is-long' : ''}`} style={{ top: 'calc(var(--u) * 54)' }}>{big}</b>
        <span className="srs-unit" style={{ top: 'calc(var(--u) * 84)' }}>cm</span>
        <span className="srs-small is-dim" style={{ top: 'calc(var(--u) * 103)' }}>{mm.toFixed(0)} mm&nbsp;&nbsp;({res.toFixed(1)}/step)</span>
        <span className="srs-small is-hint" style={{ top: 'calc(var(--u) * 119)' }}>tap: zero&nbsp;&nbsp;hold: calib</span>
      </div>
    );
  }
  if (s.mode === 'calibrating') {
    const cancel = s.calSteps === 0 && s.per10cm !== 0;
    return (
      <div className="srs">
        <Header title="CALIBRATE" cls="is-cal" tag={s.pressed ? 'LIVE' : undefined} tagCls="is-live" />
        <b className={`srs-big${s.pressed ? ' is-live' : ''}`} style={{ top: 'calc(var(--u) * 50)' }}>{Math.abs(s.calSteps)}</b>
        <span className="srs-small is-dim" style={{ top: 'calc(var(--u) * 76)' }}>steps</span>
        <span className="srs-small" style={{ top: 'calc(var(--u) * 94)' }}>Press the wheel and</span>
        <span className="srs-small" style={{ top: 'calc(var(--u) * 105)' }}>roll exactly 10 cm</span>
        {cancel
          ? <span className="srs-small is-hint" style={{ top: 'calc(var(--u) * 119)' }}>tap: cancel</span>
          : <span className="srs-small" style={{ top: 'calc(var(--u) * 116)' }}>then release</span>}
      </div>
    );
  }
  const ok = Math.abs(s.calSteps) >= 4;
  return (
    <div className="srs">
      <Header title="CALIBRATE" cls="is-cal" tag="CHECK" tagCls="is-warn" />
      <b className="srs-big" style={{ top: 'calc(var(--u) * 46)' }}>{Math.abs(s.calSteps)}</b>
      <span className="srs-small is-dim" style={{ top: 'calc(var(--u) * 72)' }}>steps = 10 cm</span>
      <span className={`srs-mid ${ok ? 'is-live' : 'is-warn'}`} style={{ top: 'calc(var(--u) * 92)' }}>{ok ? 'tap: save' : 'too short'}</span>
      <span className="srs-small is-dim" style={{ top: 'calc(var(--u) * 108)' }}>hold: start over</span>
      <span className="srs-small is-dim" style={{ top: 'calc(var(--u) * 119)' }}>wheel: keep rolling</span>
    </div>
  );
}
