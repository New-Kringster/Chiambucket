import type { Metadata } from 'next';
import ArticleScrollSpy from '../../components/ArticleScrollSpy';
import ArticleRecommendations from '../../components/ArticleRecommendations';
import LumenConsole from './LumenConsole';
import PromptReveal from './PromptReveal';

export const metadata: Metadata = {
  title: 'LUMEN — Chiambucket',
  description: 'An AI voice-controlled smart-room assistant: an ESP32 with a wake word, an INMP441 mic and sensors, paired with a FastAPI relay that calls OpenRouter for Whisper speech-to-text and a DeepSeek command parser, all squeezed onto a no-PSRAM board.',
  alternates: { canonical: 'https://www.chiambucket.com/lumen' },
  openGraph: {
    title: 'LUMEN — Chiambucket',
    description: 'An ESP32 voice assistant: wake word + mic on-device, Whisper + a DeepSeek command parser via OpenRouter on a FastAPI relay, talking to the room over MQTT.',
    url: 'https://www.chiambucket.com/lumen',
    type: 'article',
    images: [{ url: '/images/logo.png' }],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'LUMEN — ESP32 Voice Assistant',
  description: 'An AI voice-controlled smart-room assistant on an ESP32 (MicroPython) paired with a FastAPI relay that calls OpenRouter for Whisper speech-to-text and a DeepSeek LLM command parser, fanning out to the room over MQTT. Built for NYP IoT Programming.',
  image: 'https://www.chiambucket.com/images/logo.png',
  author: { '@type': 'Person', name: 'Braven Chiam', url: 'https://www.chiambucket.com/' },
  publisher: { '@type': 'Person', name: 'Braven Chiam' },
  mainEntityOfPage: 'https://www.chiambucket.com/lumen',
};

/* The real system prompt LUMEN sends to the LLM, verbatim from server/prompts.py. */
const SYSTEM_PROMPT = `You are LUMEN, the command parser for a voice-controlled smart-room system.
Your only job: convert one natural-language request into ONE JSON command object.
Output JSON and nothing else — no prose, no code fences, no explanation.

## Context you are given each call
- CURRENT_TIME: {iso8601_local}   (timezone UTC+8 / Asia/Singapore)
- STATE: a JSON snapshot of current device state plus a "sensors" object with
  live readings (temp in °C, humidity %, motion, dark) and the comfort range.
  Use it to resolve relative requests ("a bit dimmer", "make it warmer") and to
  answer questions about the room ("what's the temperature", "is it dark").

## Output: exactly one of these three shapes
1. action   — a single device change.
2. sequence — ordered steps, each with delay_ms from the trigger moment.
3. timer    — one device change after delay_seconds.
Every object MUST include a "response_text": one short spoken-style sentence
confirming what you did, suitable for an OLED line (<= 40 chars ideal).

## Devices and allowed actions (never invent others)
- white_led:  turn_on | turn_off | set_brightness(value 0-100)
- rgb_led:    turn_on | turn_off | set_rgb(r,g,b 0-255)
- fan:        turn_on | turn_off
- servo:      set_angle(angle 0-180)
- buzzer:     turn_on | turn_off | beep(count, duration_ms)
- comfort_range: update(min, max)   # degrees C
- auto_mode:  enable | disable
- timers:     cancel_all | cancel(timer_id)
- none:       report | noop   # report = answer a question (no action); noop = impossible/invalid (no action)

## Rules
- RGB: map any colour name to r,g,b yourself. cyan=0,255,255;
  warm white=255,200,100; purple=128,0,128. No fixed list.
- "Dimmer"/"brighter"/"warmer light": read current value from STATE and adjust
  by ~20 (clamp 0-100).
- SENSOR -> PARAMETER: if asked to set a device's numeric value TO a live sensor
  reading ("set the brightness to the humidity", "set the light to the temperature"),
  read that reading from STATE.sensors, round to a whole number, clamp it to the
  field's valid range, and emit the matching set action. This IS doable — do not
  refuse it. E.g. humidity 69.5 -> white_led set_brightness value 70.
- FAN vs COMFORT RANGE — keep these separate:
  * "it's getting warm" / "i'm hot" / "turn on the fan"  -> action, fan, turn_on.
    This does NOT change comfort_range.
  * "set comfortable range to X to Y" / "make the room target warmer"
    -> action, comfort_range, update. This does NOT touch the fan.
- AUTO MODE — the room's automatic behaviour (motion+dark turns the light on;
  the fan follows the comfort range). "turn automatic/auto mode on|off",
  "enable/disable auto mode", "stop running the room automatically", "stop the
  automatic lights/fan", "let me control it manually" -> action, auto_mode,
  enable|disable. This only arms/disarms the automation — it does NOT itself
  switch any device on or off.
- Sequences: first step delay_ms=0, later steps offset from the trigger moment
  (not cumulative gaps unless that's clearly intended).
- Timers: convert "in 10 minutes" -> delay_seconds 600. Give a human label.
- Questions & general knowledge -> device "none", action "report": put the
  answer in response_text and take NO device action.
    * device/sensor status ("what's the temperature", "is the fan on") ->
      answer from STATE.
    * general knowledge ("how tall is the Empire State Building") -> answer
      from your own knowledge. Keep it brief (the OLED wraps ~16 chars/line).
- Invalid / impossible / unsupported, or input you can't parse into any device
  action ("fly to the moon", gibberish) -> device "none", action "noop", with a
  short response_text saying it can't be done. Take NO action.
- Both "report" and "noop" take no device action; their response_text is shown
  on screen and the system simply continues.
- Output valid JSON. Numbers are numbers, not strings.

## Examples
"set the light to cyan and turn on the fan one second later"
-> {"type":"sequence","steps":[
     {"delay_ms":0,"device":"rgb_led","action":"set_rgb","r":0,"g":255,"b":255},
     {"delay_ms":1000,"device":"fan","action":"turn_on"}],
    "response_text":"Cyan now, fan in 1s."}

"it's getting warm"
-> {"type":"action","device":"fan","action":"turn_on",
    "response_text":"Fan on."}

"set the brightness to the humidity percentage"   (STATE.sensors.humidity = 69.5)
-> {"type":"action","device":"white_led","action":"set_brightness","value":70,
    "response_text":"Brightness set to 70%."}

"turn off automatic mode"
-> {"type":"action","device":"auto_mode","action":"disable",
    "response_text":"Auto-mode off."}

"turn the light off in 10 minutes"
-> {"type":"timer","device":"white_led","action":"turn_off",
    "delay_seconds":600,"label":"10 min light off",
    "response_text":"Light off in 10 min."}

"good night"
-> {"type":"sequence","steps":[
     {"delay_ms":0,"device":"white_led","action":"turn_off"},
     {"delay_ms":0,"device":"rgb_led","action":"turn_off"},
     {"delay_ms":0,"device":"fan","action":"turn_off"},
     {"delay_ms":0,"device":"auto_mode","action":"disable"}],
    "response_text":"Good night."}

"how tall is the Empire State Building"
-> {"type":"action","device":"none","action":"report",
    "response_text":"443 m (1,454 ft) to the tip."}

"make me a sandwich"
-> {"type":"action","device":"none","action":"noop",
    "response_text":"Sorry, I can't do that."}`;

const BackArrow = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const Circle = () => (
  <svg fill="currentColor" viewBox="0 0 24 24" className="pf-item-buttom-icon" aria-hidden="true"><path clipRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z" fillRule="evenodd" /></svg>
);

export default function LumenPage() {
  return (
    <main className="art">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ArticleScrollSpy />

      {/* ── Feature hero (decorative; drop a hero photo into art-hero-bg later) ── */}
      <header className="art-hero">
        <div className="art-hero-bg"><img src="/images/lumen-cover.webp" alt="LUMEN smart-home assistant: built with OpenAI Whisper and DeepSeek" /></div>
        <div className="art-hero-scrim"></div>
        <div className="art-hero-inner hp-section">
          <a className="art-back" href="/#portfolio-items-holder"><BackArrow /> All projects</a>
          <div className="art-tags">
            <span className="hp-md-tag highlight">Highlights</span>
            <span className="hp-md-tag school">School Project</span>
          </div>
          <h1 className="art-title"><em>LUMEN</em></h1>
          <p className="art-lead">A voice-controlled smart-room assistant. Say &ldquo;Hello Robot&rdquo; (or hold the button), speak, and the room answers: an ESP32 captures your voice, a server transcribes it and asks an LLM to turn the request into one strict JSON command, and that command fans back out over MQTT to lights, a fan, a servo and a buzzer. The hard part was not the AI. It was fitting all of this onto a microcontroller with about 33&nbsp;KB of free RAM.</p>
          <div className="art-toolrow">
            <span className="hp-key">Built with</span>
            <div className="icon-stack">
              <img src="/images/esp-icon.webp" alt="ESP32" />
              <img src="/images/python-icon.webp" alt="Python" />
              <img src="/images/docker-icon.webp" alt="Docker" />
              <img src="/images/vscode-icon.webp" alt="VS Code" />
            </div>
          </div>
          {/*  KEY LINKS: the repo is private (the spec doc holds graded credentials) and the
              dashboard is only exposed during the demo, so no public links ship yet.
              When ready, add back the row, e.g.:
              <ArticleLinks links={[
                { type: 'video', label: 'Watch the demo', url: 'https://youtu.be/…' },
                { type: 'github', label: 'GitHub', url: 'https://github.com/…' },
              ]} />  */}
        </div>
      </header>

      {/* ── Body ── */}
      <div className="art-body hp-section">
        <aside className="art-rail">
          <div className="art-rail-inner">
            <span className="hp-eyebrow">Chapters</span>
            <nav className="art-chapters article-chapter-wrapper">
              <a href="#overview">Overview</a>
              <a href="#try">Try it</a>
              <a href="#how">How it works</a>
              <a href="#brain">The brain</a>
              <a href="#hardware">The hardware</a>
              <a href="#memory">The memory wall</a>
              <a href="#auto">A room that runs itself</a>
              <a href="#deploy">Dashboard &amp; deployment</a>
              <a href="#next">What I&apos;d add next</a>
            </nav>
          </div>
        </aside>

        <div className="art-content">
          <section id="overview" className="art-section" data-reveal>
            <h2>Overview</h2>
            <p>LUMEN is my Mini Project for NYP&apos;s IoT Programming module. The brief was open: build a connected device that does something useful. I wanted to see how far a cheap ESP32 could go if I gave it real language understanding instead of a fixed list of commands, so I built a smart-room assistant you actually talk to.</p>
            <p>It listens for a wake word, records what you say, and turns plain English into actions: &ldquo;dim the light a bit,&rdquo; &ldquo;turn the fan on in ten minutes,&rdquo; &ldquo;set the brightness to match the humidity,&rdquo; &ldquo;good night.&rdquo; The intelligence lives on a small server; the ESP32 stays a lean, reliable pair of ears and hands.</p>
            <figure className="lm-demo">
              <video controls preload="metadata" poster="/images/lumen-demo-poster.webp" playsInline>
                <source src="/videos/lumen-demo.webm" type="video/webm" />
                <source src="/videos/lumen-demo.mp4" type="video/mp4" />
              </video>
              <figcaption>LUMEN in action: the wake word, a few spoken commands, and the room responding.</figcaption>
            </figure>
          </section>

          <section id="try" className="art-section" data-reveal>
            <h2>Try it</h2>
            <p>Here is the whole loop in miniature. A phrase comes in; it travels the same path the real system uses (trigger, then Whisper for speech-to-text and a DeepSeek LLM that parses it to one JSON command, both reached through OpenRouter, then MQTT out to the device); and the room reacts. Pick a phrase, or let it cycle.</p>
            <LumenConsole />
            <p className="art-cap-note">The last two phrases show the guardrails: a question is answered from live sensor data and takes no action, and an impossible request is politely refused. The ESP32 only ever trusts validated JSON.</p>
          </section>

          <section id="how" className="art-section" data-reveal>
            <h2>How it works</h2>
            <p>The golden rule of the whole design: <strong>the ESP32 does almost no thinking.</strong> It records audio and executes commands. Everything heavy (speech-to-text, the language model, logging) happens on a FastAPI server running in Docker on my homelab; the board just talks to it over the local network.</p>
            <SignalPath />
            <p>A trigger (the &ldquo;Hello Robot&rdquo; wake word, or a push-to-talk button as the reliable fallback) starts an INMP441 microphone capturing 16&nbsp;kHz mono audio. The board wraps it as a WAV and streams it to the server&apos;s <code>/upload</code> endpoint. From there the server calls <strong>OpenRouter</strong> for both steps on a single API key: Whisper transcribes the audio, then a DeepSeek model turns the text into one JSON command under a strict system prompt. The server validates that JSON and publishes it to an MQTT topic the ESP32 subscribes to. The same result is appended to a Google Sheet for logging, with an estimated cost per request.</p>
            <p>One detail that makes the answers feel smart: the server also subscribes to the room&apos;s state and sensor topics and caches the latest values, then feeds them to the LLM as context. That is how &ldquo;what&apos;s the temperature?&rdquo; or &ldquo;is the fan on?&rdquo; get answered from real readings rather than guesses.</p>
            <h3>The voice pipeline, step by step</h3>
            <ol className="lm-steps">
              <li><b>Trigger.</b> You say &ldquo;Hello Robot&rdquo; or hold the push-to-talk button.</li>
              <li><b>Record.</b> The INMP441 captures about three seconds of 16&nbsp;kHz mono audio; the red REC LED stays lit for the whole capture.</li>
              <li><b>Wrap &amp; upload.</b> The raw PCM gets a 44-byte WAV header and streams to <code>/upload</code> as it is recorded.</li>
              <li><b>Transcribe.</b> The server sends the clip to OpenRouter, where Whisper turns the audio into text.</li>
              <li><b>Add context.</b> The transcript plus a live snapshot of device state and sensor readings goes to the model.</li>
              <li><b>Parse.</b> A DeepSeek model (also via OpenRouter) returns one JSON command, validated against the schema (retry once, else a safe no-op).</li>
              <li><b>Fan out.</b> The server publishes the command to MQTT and appends a row to the Google Sheet.</li>
              <li><b>Execute.</b> The ESP32 receives it, acts on it, and shows the spoken reply on its OLED.</li>
            </ol>
          </section>

          <section id="brain" className="art-section" data-reveal>
            <h2>The brain: turning language into one command</h2>
            <p>The model never controls a device directly. Its only job is to convert one sentence into exactly one of three JSON shapes, and nothing else:</p>
            <ul className="lm-list">
              <li><b>action</b> — a single change. &ldquo;Turn the fan on,&rdquo; &ldquo;set it to cyan.&rdquo;</li>
              <li><b>sequence</b> — ordered steps, each with a delay from the moment you spoke. &ldquo;Lights off, then fan off a second later.&rdquo;</li>
              <li><b>timer</b> — one change after a countdown. &ldquo;Light off in ten minutes.&rdquo;</li>
            </ul>
            <CommandFlowchart />
            <p>A long, deliberately strict system prompt pins down the device vocabulary (white LED, NeoPixel RGB, fan, servo, buzzer, comfort range, auto-mode), forces valid JSON with numbers as numbers, and maps colour names to RGB itself. Every response is checked against a schema on the server; if it fails, the server retries once, then falls back to a harmless no-op rather than sending the board something it cannot trust.</p>
            <PromptReveal text={SYSTEM_PROMPT} />
            <p>My favourite behaviour is the one that ties the language model to the physical room. Ask it to &ldquo;set the brightness to the humidity percentage&rdquo; and it reads the live humidity from the cached sensor state, rounds it, clamps it to the LED&apos;s 0&ndash;100 range, and emits a real <code>set_brightness</code> command. The room&apos;s own readings become inputs to the request.</p>
          </section>

          <section id="hardware" className="art-section" data-reveal>
            <h2>The hardware</h2>
            <p>Everything hangs off a single ESP32-WROOM. Inputs on one side, outputs on the other, all sharing one non-blocking main loop so nothing ever stalls trigger detection.</p>
            <HardwareHub />
            <p>The LDR is a <em>digital</em> light module (sensitivity set on its own potentiometer), so there are no analog reads anywhere, which sidesteps the ESP32&apos;s ADC-versus-WiFi headache entirely. A red LED lights only while the microphone is capturing, as a recording indicator. A small SSD1306 OLED, driven by two navigation buttons, shows status and the last command across four pages. The DF2301Q wake-word module is wired into the design and its driver is written, but on the bench the push-to-talk button is the trigger I actually demo with.</p>
            <figure className="art-fig">
              <img src="/images/lumen-mic.webp" alt="Close-up of the INMP441 I2S microphone wired to the ESP32" loading="lazy" />
              <figcaption>The INMP441 I2S microphone, the ears of the whole system.</figcaption>
            </figure>
          </section>

          <section id="memory" className="art-section" data-reveal>
            <h2>The memory wall</h2>
            <p>This is the part I am proudest of, and it is invisible in a demo. The ESP32-WROOM has no PSRAM. With WiFi up, MicroPython left me roughly 33&nbsp;KB of usable RAM, and a voice clip is about 96&nbsp;KB. The audio literally does not fit in memory.</p>
            <p>So nothing ever holds the whole clip. The microphone is one persistent, pre-warmed instance; the capture buffers are tiny and allocated lazily; and the upload is <strong>streamed over a raw socket</strong> as it is recorded (a preamble, the WAV header, then PCM sent chunk by chunk, then a tail). Peak memory during an upload is about 10&nbsp;KB. Build one big <code>bytes</code> object instead and the garbage collector grabs a ~26&nbsp;KB block from the same scarce heap that WiFi and the I2S microphone need, which starves the network stack and the upload times out.</p>
            <p>I found the ceiling the hard way, with the OLED. A lean four-page status screen ships in the current firmware and boots happily. But when I made it richer (live-refreshing sensor values, a recording splash) that extra code alone grew the heap just enough to tip the board over at boot: it could no longer connect to MQTT (<code>ENOBUFS</code>) or open the microphone (<code>ENOMEM</code>). The lesson was precise. The OLED can live here as long as it stays small. To make room for everything else I also cut a real-time clock and clock-time schedules, so timers now run off a monotonic tick count instead of a wall clock and need no clock at all.</p>
          </section>

          <section id="auto" className="art-section" data-reveal>
            <h2>A room that runs itself</h2>
            <p>LUMEN is not only reactive. A lightweight auto-mode runs locally on the board: if it detects motion while the room is dark, it turns the white LED on, then off again after five minutes of stillness. If the temperature climbs above the comfort range, the fan switches on, with a small hysteresis gap so it does not chatter around the threshold.</p>
            <p>Auto-mode and manual control coexist cleanly. Any spoken command immediately takes priority and clears the automatic state, so the system never fights you for control of a light you just set yourself.</p>
          </section>

          <section id="deploy" className="art-section" data-reveal>
            <h2>Dashboard &amp; deployment</h2>
            <p>The server is a Dockerised FastAPI app, and it ships with a web dashboard. There is a device control panel (white LED, an RGB picker, fan, servo, buzzer, an auto-mode toggle and a comfort-range editor), a live state readout, a temperature and humidity history chart, an activity log of recent commands, a player for the last few voice recordings, and a text box that pipes straight into the same LLM path, which is my reliable backup if the microphone misbehaves during a live demo. A reset clears the chart, log and recordings.</p>
            <p>It lives on my homelab behind Nginx Proxy Manager and Cloudflare, which front the dashboard at a clean HTTPS hostname. The MQTT broker is reached directly rather than through Cloudflare. The ESP32 itself only ever talks to a LAN address, never the public hostname, which keeps the firmware lean.</p>
            <figure className="art-fig lm-dash">
              <img src="/images/lumen-dashboard.webp" alt="The LUMEN web dashboard: device control panel, live readout, history chart and activity log" loading="lazy" />
              <figcaption>The dashboard: device control, live state, the temp/humidity chart, the activity log and recordings, in one panel.</figcaption>
            </figure>
          </section>

          <section id="next" className="art-section" data-reveal>
            <h2>What I&apos;d add next</h2>
            <p>Almost everything I cut comes back cheaply on an ESP32-S3 with PSRAM, which is the upgrade I would make first. The WROOM is genuinely at its ceiling streaming microphone audio while running WiFi and MQTT at once.</p>
            <ul className="lm-list">
              <li><b>A richer OLED</b> — live-refreshing sensor pages and a recording splash, the variants I had to strip back to keep the lean screen that ships now.</li>
              <li><b>Clock-time schedules</b> (&ldquo;every day at 8&nbsp;am&rdquo;), which need a real-time clock I removed to save memory.</li>
              <li><b>Durable history</b> so the dashboard&apos;s charts and the timers survive a reboot; today the last couple of hours live only in volatile RAM.</li>
              <li><b>Finishing the wake word</b> on hardware so push-to-talk becomes the fallback, not the primary trigger.</li>
            </ul>
            <p>LUMEN taught me more about memory discipline on a constrained device than any project before it. The AI was the easy, fun layer on top; making it run reliably on a board that could barely hold a single second of audio was the real engineering.</p>

            <div className="art-next">
              <span className="art-next-label">Check out the next article</span>
              <a href="/#portfolio-items-holder" className="hp-btn">All projects <Circle /></a>
            </div>
          </section>
        </div>
      </div>

      <ArticleRecommendations exclude="proj-lumen" />

      <style>{`
        /* ── Signal-path flow (high-level pipeline; CSS so nothing overlaps) ── */
        .lm-flow { margin: 1.2rem 0 0.6rem; padding: clamp(16px, 2.4vw, 26px); border-radius: 18px;
          background: linear-gradient(165deg, rgba(20,22,38,0.7), rgba(10,11,20,0.85));
          border: 1px solid var(--hp-line, rgba(255,255,255,0.1)); }
        .lm-flow-track { display: grid; grid-template-columns: 1fr auto 1.3fr auto 1fr; align-items: stretch; gap: 6px; }
        .lm-flow-stage { display: flex; flex-direction: column; gap: 9px; min-width: 0; }
        .lm-flow-tag { font-size: 0.6rem; letter-spacing: 0.13em; text-transform: uppercase; color: #7a8398; font-family: var(--font-ddt, monospace); }
        .lm-flow-card { flex: 1; display: flex; flex-direction: column; gap: 6px; padding: 14px 15px; border-radius: 13px;
          border: 1px solid color-mix(in srgb, var(--hp-sky, #7fa8ff) 22%, rgba(255,255,255,0.1));
          background: color-mix(in srgb, var(--hp-sky, #7fa8ff) 6%, rgba(255,255,255,0.015)); }
        .lm-flow-card.lit { border-color: color-mix(in srgb, var(--hp-sky, #7fa8ff) 48%, transparent); background: color-mix(in srgb, var(--hp-sky, #7fa8ff) 12%, transparent); }
        .lm-flow-card b { font-size: 0.92rem; color: #eef1f7; }
        .lm-flow-card span { font-size: 0.8rem; line-height: 1.5; color: #97a1b6; }
        .lm-flow-link { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; padding: 0 2px; align-self: center; }
        .lm-flow-pill { font-size: 0.64rem; font-family: var(--font-ddt, monospace); color: #b7e3c8; white-space: nowrap; }
        .lm-flow-ar { position: relative; width: 38px; height: 2px; border-radius: 2px;
          background: color-mix(in srgb, var(--hp-sky, #7fa8ff) 55%, transparent); }
        .lm-flow-ar::after { content: ''; position: absolute; right: -1px; top: 50%; width: 7px; height: 7px;
          border-top: 2px solid color-mix(in srgb, var(--hp-sky, #7fa8ff) 70%, transparent);
          border-right: 2px solid color-mix(in srgb, var(--hp-sky, #7fa8ff) 70%, transparent);
          transform: translateY(-50%) rotate(45deg); }
        .lm-flow-foot { margin: 1rem 0 0; font-size: 0.82rem; line-height: 1.55; color: #8b94a8; text-align: center; }
        @media (max-width: 720px) {
          .lm-flow-track { grid-template-columns: 1fr; gap: 4px; }
          .lm-flow-link { flex-direction: column; padding: 6px 0; }
          .lm-flow-ar { width: 2px; height: 24px; }
          .lm-flow-ar::after { right: 50%; top: auto; bottom: -1px; transform: translateX(50%) rotate(135deg); }
        }

        /* ── Lists ── */
        /* Inherit the global .art-section ul gutter (li padding-left:20px) so the blue dot
           sits in the margin, not on the text. Only tweak the row gap here. */
        .lm-list { margin: 0.6rem 0 0.4rem; gap: 0.55rem; }
        .art-cap-note { font-size: 0.92rem; color: #aab4c8; }

        /* ── System prompt reveal (preview → fade → show more) ── */
        .lm-pr { margin: 1.1rem 0 1.3rem; }
        .lm-pr-eyebrow { font-size: 0.62rem; letter-spacing: 0.16em; text-transform: uppercase; color: #7a8398; margin-bottom: 8px; font-family: var(--font-ddt, monospace); }
        .lm-pr-box { position: relative; border: 1px solid var(--hp-line, rgba(255,255,255,0.1)); border-radius: 14px; background: rgba(0,0,0,0.3); overflow: hidden; }
        .lm-pr-pre { margin: 0; padding: 16px; max-height: 224px; overflow: hidden;
          font-family: var(--font-ddt, ui-monospace, monospace); font-size: 0.78rem; line-height: 1.55; color: #c7d0e0; white-space: pre-wrap; word-break: break-word;
          transition: max-height 0.5s cubic-bezier(0.16,1,0.3,1); }
        .lm-pr.open .lm-pr-pre { max-height: 2200px; overflow: auto; }
        .lm-pr-fade { position: absolute; left: 0; right: 0; bottom: 0; height: 96px; pointer-events: none;
          background: linear-gradient(to bottom, rgba(8,9,16,0), rgba(8,9,16,0.97)); }
        .lm-pr-btn { display: inline-flex; align-items: center; gap: 7px; margin-top: 11px; padding: 8px 15px; cursor: pointer;
          border-radius: 999px; border: 1px solid color-mix(in srgb, var(--hp-sky, #7fa8ff) 40%, transparent);
          background: color-mix(in srgb, var(--hp-sky, #7fa8ff) 10%, transparent); color: var(--hp-sky, #7fa8ff);
          font-size: 0.82rem; font-weight: 600; transition: background 0.2s, color 0.2s, transform 0.15s; }
        .lm-pr-btn:hover { background: color-mix(in srgb, var(--hp-sky, #7fa8ff) 18%, transparent); color: #fff; }
        .lm-pr-btn:active { transform: scale(0.97); }
        .lm-pr-btn:focus-visible { outline: 2px solid var(--hp-sky, #7fa8ff); outline-offset: 2px; }
        .lm-pr-btn svg { transition: transform 0.25s ease; }
        .lm-pr.open .lm-pr-btn svg { transform: rotate(180deg); }

        /* ── Numbered voice-pipeline steps ── */
        .lm-steps { margin: 0.8rem 0 0.4rem; padding: 0; list-style: none; counter-reset: lm-step; display: flex; flex-direction: column; gap: 0.6rem; }
        .lm-steps li { position: relative; counter-increment: lm-step; padding: 11px 14px 11px 52px; border-radius: 12px; line-height: 1.6;
          border: 1px solid var(--hp-line, rgba(255,255,255,0.08)); background: color-mix(in srgb, var(--hp-indigo, #5e79db) 6%, rgba(255,255,255,0.015)); }
        .lm-steps li::before { content: counter(lm-step); position: absolute; left: 12px; top: 10px; width: 28px; height: 28px;
          display: flex; align-items: center; justify-content: center; border-radius: 8px; font-family: var(--font-ddt, monospace); font-size: 0.84rem; font-weight: 700;
          color: var(--hp-sky, #7fa8ff); background: color-mix(in srgb, var(--hp-sky, #7fa8ff) 14%, transparent); border: 1px solid color-mix(in srgb, var(--hp-sky, #7fa8ff) 35%, transparent); }
        .lm-steps b { color: #eef1f7; }

        /* ── Demo video ── */
        .lm-demo { margin: 1.3rem 0 0.6rem; }
        .lm-demo video { width: 100%; aspect-ratio: 16 / 9; display: block; border-radius: 14px; background: #000; border: 1px solid rgba(255,255,255,0.08); }
        .lm-demo figcaption { margin-top: 0.7rem; font-size: 0.86rem; color: #8b94a8; text-align: center; }

        /* ── Dashboard (tall portrait) figure ── */
        .lm-dash img { display: block; margin: 0 auto; max-height: 80vh; width: auto; border-radius: 12px; }

        /* ── Inline SVG diagrams ── */
        .lm-dia { width: 100%; margin: 1.2rem 0 0.6rem; padding: clamp(16px, 2.4vw, 26px); border-radius: 18px;
          background: linear-gradient(165deg, rgba(20,22,38,0.7), rgba(10,11,20,0.85));
          border: 1px solid var(--hp-line, rgba(255,255,255,0.1)); overflow-x: auto; -webkit-overflow-scrolling: touch; }
        .lm-dia svg { width: 100%; height: auto; display: block; }
        /* Dense diagrams: keep a legible minimum width and scroll horizontally on phones */
        @media (max-width: 640px) {
          .lm-dia { padding: 14px; }
          .lm-dia svg { min-width: 600px; }
          .lm-dia-cap::after { content: " — swipe to see all of it"; opacity: 0.7; }
        }
        .lm-dia .d-box { fill: rgba(255,255,255,0.03); stroke: color-mix(in srgb, var(--hp-sky, #7fa8ff) 30%, rgba(255,255,255,0.12)); }
        .lm-dia .d-box.accent { fill: color-mix(in srgb, var(--hp-sky, #7fa8ff) 12%, transparent); stroke: var(--hp-sky, #7fa8ff); }
        .lm-dia .d-box.warm { fill: rgba(245,201,122,0.08); stroke: rgba(245,201,122,0.55); }
        .lm-dia .d-t { fill: #e8edf6; font-size: 13px; font-weight: 600; font-family: var(--font-dmsans, sans-serif); }
        .lm-dia .d-s { fill: #97a1b6; font-size: 10.5px; font-family: var(--font-dmsans, sans-serif); }
        .lm-dia .d-line { stroke: color-mix(in srgb, var(--hp-sky, #7fa8ff) 45%, rgba(255,255,255,0.2)); stroke-width: 1.6; fill: none; }
        .lm-dia .d-line.dash { stroke-dasharray: 4 4; opacity: 0.7; }
        .lm-dia .d-chip { fill: #b7e3c8; font-size: 11px; font-family: var(--font-ddt, monospace); }
        .lm-dia-cap { font-size: 0.86rem; color: #8b94a8; text-align: center; margin-top: 0.7rem; }
      `}</style>
    </main>
  );
}

/* ───────────────────────── Diagrams ───────────────────────── */

function SignalPath() {
  return (
    <figure className="lm-flow" data-no-zoom>
      <div className="lm-flow-track">
        <div className="lm-flow-stage">
          <span className="lm-flow-tag">On the ESP32</span>
          <div className="lm-flow-card">
            <b>Trigger + mic</b>
            <span>Wake word or push-to-talk; the INMP441 captures 16&nbsp;kHz mono audio.</span>
          </div>
        </div>

        <div className="lm-flow-link">
          <span className="lm-flow-pill">stream /upload</span>
          <i className="lm-flow-ar" aria-hidden="true" />
        </div>

        <div className="lm-flow-stage">
          <span className="lm-flow-tag">FastAPI server · OpenRouter</span>
          <div className="lm-flow-card lit">
            <b>Whisper → DeepSeek → validate</b>
            <span>Through OpenRouter, Whisper turns speech into text and a DeepSeek model parses it into one JSON command; the server checks that against the schema (retry once, else a safe no-op).</span>
          </div>
        </div>

        <div className="lm-flow-link">
          <span className="lm-flow-pill">MQTT command</span>
          <i className="lm-flow-ar" aria-hidden="true" />
        </div>

        <div className="lm-flow-stage">
          <span className="lm-flow-tag">Back in the room</span>
          <div className="lm-flow-card">
            <b>Devices act</b>
            <span>The LED, RGB, fan, servo and buzzer respond, and the OLED shows the spoken reply.</span>
          </div>
        </div>
      </div>
      <figcaption className="lm-flow-foot">The server also caches the room&apos;s live state and sensor readings, feeds them back to the LLM as context, and logs every call to a dashboard. The board only records and executes; all the intelligence lives on the server.</figcaption>
    </figure>
  );
}

function CommandFlowchart() {
  return (
    <figure className="lm-dia" data-no-zoom>
      <svg viewBox="0 0 840 445" role="img" aria-label="Command parsing flowchart: transcribed text and live sensor context enters the DeepSeek LLM. If the output JSON fails schema validation, the server retries once; still invalid becomes a safe no-op. If valid, the command is routed by type — action for a single device change, sequence for ordered steps with delays, or timer for one change after a countdown.">
        <defs>
          <marker id="lm-fc-arr" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="var(--hp-sky, #7fa8ff)" fillOpacity="0.7" />
          </marker>
        </defs>

        {/* ─ Input node ─ */}
        <rect className="d-box" x="180" y="16" width="360" height="52" rx="10" />
        <text className="d-t" x="360" y="38" textAnchor="middle">Transcribed text + sensor context</text>
        <text className="d-s" x="360" y="56" textAnchor="middle">Whisper transcript + live room snapshot from MQTT cache</text>

        {/* Arrow: input → DeepSeek */}
        <line className="d-line" x1="360" y1="68" x2="360" y2="95" markerEnd="url(#lm-fc-arr)" />

        {/* ─ DeepSeek LLM node ─ */}
        <rect className="d-box accent" x="205" y="97" width="310" height="52" rx="10" />
        <text className="d-t" x="360" y="119" textAnchor="middle">DeepSeek LLM (via OpenRouter)</text>
        <text className="d-s" x="360" y="137" textAnchor="middle">Parses request into one JSON command</text>

        {/* Arrow: DeepSeek → diamond, with label */}
        <line className="d-line" x1="360" y1="149" x2="360" y2="171" markerEnd="url(#lm-fc-arr)" />
        <text className="d-chip" x="368" y="164">JSON</text>

        {/* ─ Decision diamond: schema valid? ─
            Center (360, 215); vertices: top (360,173) right (465,215) bottom (360,257) left (255,215) */}
        <polygon className="d-box" points="255,215 360,173 465,215 360,257" />
        <text className="d-t" x="360" y="210" textAnchor="middle" style={{fontSize: 12}}>JSON schema</text>
        <text className="d-t" x="360" y="226" textAnchor="middle" style={{fontSize: 12}}>valid?</text>

        {/* Yes: arrow down from diamond bottom */}
        <line className="d-line" x1="360" y1="257" x2="360" y2="285" markerEnd="url(#lm-fc-arr)" />
        <text className="d-chip" x="368" y="275">Yes</text>

        {/* ─ Route by type node ─ */}
        <rect className="d-box" x="200" y="287" width="320" height="48" rx="10" />
        <text className="d-t" x="360" y="307" textAnchor="middle">Route by command type</text>
        <text className="d-s" x="360" y="323" textAnchor="middle">action · sequence · timer</text>

        {/* Three branch lines from route box bottom */}
        <path className="d-line" d="M 310 335 L 115 370" markerEnd="url(#lm-fc-arr)" />
        <line className="d-line" x1="360" y1="335" x2="360" y2="370" markerEnd="url(#lm-fc-arr)" />
        <path className="d-line" d="M 415 335 L 605 370" markerEnd="url(#lm-fc-arr)" />

        {/* Branch type labels */}
        <text className="d-chip" x="198" y="360" textAnchor="middle">action</text>
        <text className="d-chip" x="360" y="358" textAnchor="middle">sequence</text>
        <text className="d-chip" x="519" y="360" textAnchor="middle">timer</text>

        {/* ─ Outcome boxes ─ */}
        <rect className="d-box" x="20" y="370" width="190" height="52" rx="10" />
        <text className="d-t" x="115" y="392" textAnchor="middle">action</text>
        <text className="d-s" x="115" y="408" textAnchor="middle">Single device change</text>

        <rect className="d-box" x="265" y="370" width="190" height="52" rx="10" />
        <text className="d-t" x="360" y="392" textAnchor="middle">sequence</text>
        <text className="d-s" x="360" y="408" textAnchor="middle">Steps with delays</text>

        <rect className="d-box" x="510" y="370" width="190" height="52" rx="10" />
        <text className="d-t" x="605" y="392" textAnchor="middle">timer</text>
        <text className="d-s" x="605" y="408" textAnchor="middle">One change after a delay</text>

        {/* No: arrow right from diamond to retry */}
        <line className="d-line" x1="465" y1="215" x2="558" y2="215" markerEnd="url(#lm-fc-arr)" />
        <text className="d-chip" x="493" y="208">No</text>

        {/* ─ Retry node ─ */}
        <rect className="d-box" x="560" y="189" width="155" height="52" rx="10" />
        <text className="d-t" x="637" y="211" textAnchor="middle">Retry once</text>
        <text className="d-s" x="637" y="227" textAnchor="middle">re-prompt LLM</text>

        {/* Fails arrow: retry → no-op */}
        <line className="d-line" x1="637" y1="241" x2="637" y2="269" markerEnd="url(#lm-fc-arr)" />
        <text className="d-chip" x="645" y="259">fails</text>

        {/* ─ Safe no-op node ─ */}
        <rect className="d-box warm" x="560" y="271" width="155" height="52" rx="10" />
        <text className="d-t" x="637" y="293" textAnchor="middle">Safe no-op</text>
        <text className="d-s" x="637" y="309" textAnchor="middle">reply only, no action</text>
      </svg>
      <figcaption className="lm-dia-cap">How a voice command moves through the parser. Every path ends in one of four outcomes: action, sequence, timer, or a polite refusal that does nothing to the room.</figcaption>
    </figure>
  );
}

function HardwareHub() {
  const left: [string, string, string][] = [
    ['INMP441 mic', 'I2S microphone', 'G14·23·32'],
    ['DHT22', 'temp + humidity', 'G4'],
    ['PIR', 'motion', 'G35'],
    ['LDR module', 'light / dark', 'G34'],
    ['PTT button', 'push-to-talk', 'G19'],
  ];
  const right: [string, string, string][] = [
    ['White LED', 'PWM brightness', 'G25'],
    ['NeoPixel', 'WS2812 RGB', 'G27'],
    ['Fan', 'on / off', 'G26'],
    ['Servo', '0–180°', 'G13'],
    ['Buzzer', 'beep + alerts', 'G33'],
    ['REC LED', 'recording', 'G17'],
  ];
  const bottom: [string, string, string][] = [
    ['OLED', 'SSD1306 · 0x3C', 'I2C'],
    ['DF2301Q', 'wake word · 0x64', 'I2C'],
    ['Nav A', 'page', 'G18'],
    ['Nav B', 'page', 'G16'],
  ];
  return (
    <figure className="lm-dia" data-no-zoom>
      <svg viewBox="0 0 960 600" role="img" aria-label="Wiring map: an ESP32-WROOM at the centre. Left, the sensors and their pins — INMP441 mic on I2S (GPIO 14, 23, 32), DHT22 (GPIO 4), PIR (GPIO 35), LDR (GPIO 34), push-to-talk button (GPIO 19). Right, the outputs — white LED (GPIO 25), NeoPixel (GPIO 27), fan (GPIO 26), servo (GPIO 13), buzzer (GPIO 33), recording LED (GPIO 17). Along the bottom, the shared I2C bus (SDA 21, SCL 22) carries the SSD1306 OLED (0x3C) and the DF2301Q wake-word module (0x64), and two navigation buttons sit on GPIO 18 and 16.">
        <text className="d-s" x="20" y="26">SENSORS / INPUTS</text>
        <text className="d-s" x="772" y="26" textAnchor="end">OUTPUTS</text>
        <text className="d-s" x="20" y="480">I2C BUS · SDA 21 / SCL 22 · + UI BUTTONS</text>

        {/* ESP32 centre */}
        <rect className="d-box accent" x="392" y="250" width="176" height="118" rx="16" />
        <text className="d-t" x="480" y="298" textAnchor="middle" style={{ fontSize: 17 }}>ESP32</text>
        <text className="d-s" x="480" y="320" textAnchor="middle">WROOM · MicroPython</text>
        <text className="d-s" x="480" y="338" textAnchor="middle">one non-blocking loop</text>

        {left.map(([n, s, p], i) => {
          const y = 44 + i * 70;
          const ty = 268 + i * 22;
          return (
            <g key={n}>
              <path className="d-line" d={`M252 ${y + 26} C 322 ${y + 26}, 334 ${ty}, 392 ${ty}`} />
              <text className="d-chip" x="306" y={(y + 26 + ty) / 2 - 5} textAnchor="middle">{p}</text>
              <rect className="d-box" x="20" y={y} width="232" height="52" rx="10" />
              <text className="d-t" x="36" y={y + 22}>{n}</text>
              <text className="d-s" x="36" y={y + 40}>{s}</text>
            </g>
          );
        })}

        {right.map(([n, s, p], i) => {
          const y = 44 + i * 58;
          const ty = 262 + i * 18;
          return (
            <g key={n}>
              <path className="d-line" d={`M708 ${y + 26} C 638 ${y + 26}, 628 ${ty}, 568 ${ty}`} />
              <text className="d-chip" x="654" y={(y + 26 + ty) / 2 - 5} textAnchor="middle">{p}</text>
              <rect className="d-box" x="708" y={y} width="232" height="52" rx="10" />
              <text className="d-t" x="724" y={y + 22}>{n}</text>
              <text className="d-s" x="724" y={y + 40}>{s}</text>
            </g>
          );
        })}

        {bottom.map(([n, s, p], j) => {
          const x = 20 + j * 240;
          const cx = x + 110;
          const tx = 410 + j * 46;
          return (
            <g key={n}>
              <path className="d-line" d={`M${cx} 502 C ${cx} 440, ${tx} 430, ${tx} 368`} />
              <text className="d-chip" x={cx} y="497" textAnchor="middle">{p}</text>
              <rect className="d-box" x={x} y="502" width="220" height="56" rx="10" />
              <text className="d-t" x={x + 16} y="526">{n}</text>
              <text className="d-s" x={x + 16} y="544">{s}</text>
            </g>
          );
        })}
      </svg>
      <figcaption className="lm-dia-cap">Every component and the GPIO it lands on (mirrors <code>docs/pinmap.md</code>). The OLED and DF2301Q share one I2C bus.</figcaption>
    </figure>
  );
}
