import type { Metadata } from 'next';
import ArticleScrollSpy from '../../components/ArticleScrollSpy';
import ArticleRecommendations from '../../components/ArticleRecommendations';
import LumenConsole from './LumenConsole';
import PromptReveal from './PromptReveal';

export const metadata: Metadata = {
  title: 'LUMEN | Braven Chiam',
  description: 'An ESP32 voice assistant for a smart room: wake word and INMP441 mic on the board, a FastAPI relay that calls Whisper and a DeepSeek command parser through OpenRouter, and MQTT out to the devices, on a board with no PSRAM.',
  alternates: { canonical: 'https://www.chiambucket.com/lumen' },
  openGraph: {
    title: 'LUMEN | Braven Chiam',
    description: 'An ESP32 voice assistant: wake word and mic on the board, Whisper and a DeepSeek command parser via OpenRouter on a FastAPI relay, MQTT to the room.',
    url: 'https://www.chiambucket.com/lumen',
    type: 'article',
    images: [{ url: '/images/logo.png' }],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'LUMEN, an ESP32 voice assistant',
  description: 'A voice-controlled smart-room assistant on an ESP32 (MicroPython) with a FastAPI relay that calls OpenRouter for Whisper speech-to-text and a DeepSeek command parser, sending commands to the room over MQTT. Built for NYP IoT Programming.',
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
          <a className="art-back" href="/#portfolio-items-holder"><BackArrow /> Back to projects</a>
          <div className="art-tags">
            <span className="hp-md-tag school">School project</span>
          </div>
          <h1 className="art-title"><em>LUMEN</em></h1>
          <p className="art-lead">A voice-controlled smart-room assistant. Say &ldquo;Hello Robot&rdquo; or hold a button and speak. An ESP32 records the audio, a server transcribes it and has an LLM turn it into one JSON command, and MQTT carries that command to the lights, fan, servo and buzzer. The hard part was fitting it onto a board with about 33&nbsp;KB of free RAM.</p>
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
              <a href="#brain">The parser</a>
              <a href="#hardware">Hardware</a>
              <a href="#memory">Memory</a>
              <a href="#auto">Auto mode</a>
              <a href="#deploy">Dashboard</a>
              <a href="#slides">Slides</a>
              <a href="#next">What I&apos;d add next</a>
            </nav>
          </div>
        </aside>

        <div className="art-content">
          <section id="overview" className="art-section" data-reveal>
            <h2>Overview</h2>
            <p>LUMEN was my mini project for NYP&apos;s IoT Programming module. The brief was open: build a connected device that does something useful. I wanted to see what a cheap ESP32 could do with real language understanding instead of a fixed list of commands.</p>
            <p>It listens for a wake word, records what you say and turns it into actions: &ldquo;dim the light a bit&rdquo;, &ldquo;turn the fan on in ten minutes&rdquo;, &ldquo;set the brightness to match the humidity&rdquo;, &ldquo;good night&rdquo;. The language work runs on a small server. The ESP32 only records audio and runs commands.</p>
            <figure className="lm-demo">
              <video controls preload="none" poster="/images/posters/lumen-demo.webp" playsInline width={1280} height={720}>
                <source src="/videos/lumen-demo.webm" type="video/webm" />
                <source src="/videos/lumen-demo.mp4" type="video/mp4" />
              </video>
              <figcaption>The wake word, a few spoken commands and the room responding.</figcaption>
            </figure>
          </section>

          <section id="try" className="art-section" data-reveal>
            <h2>Try it</h2>
            <p>The same path the real system uses, in miniature: a trigger, Whisper for speech-to-text, a DeepSeek LLM that parses the text into one JSON command (both through OpenRouter), then MQTT out to the devices. Pick a phrase or let it cycle.</p>
            <LumenConsole />
            <p className="art-cap-note">The last two phrases show the guardrails: a question is answered from live sensor data and takes no action, and an impossible request is refused. The ESP32 only acts on validated JSON.</p>
          </section>

          <section id="how" className="art-section" data-reveal>
            <h2>How it works</h2>
            <p><strong>The ESP32 does almost no thinking.</strong> It records audio and executes commands. Speech-to-text, the language model and logging run on a FastAPI server in Docker on my homelab, which the board reaches over the local network.</p>
            <SignalPath />
            <p>A trigger (the &ldquo;Hello Robot&rdquo; wake word, or a push-to-talk button as the fallback) starts an INMP441 microphone capturing 16&nbsp;kHz mono audio. The board wraps it as a WAV and streams it to the server&apos;s <code>/upload</code> endpoint. The server calls <strong>OpenRouter</strong> for both steps on one API key: Whisper transcribes the audio, then a DeepSeek model turns the text into one JSON command under a strict system prompt. The server validates the JSON and publishes it to an MQTT topic the ESP32 subscribes to. Each result is also appended to a Google Sheet with an estimated cost per request.</p>
            <p>The server also subscribes to the room&apos;s state and sensor topics, caches the latest values and passes them to the LLM as context. That is how &ldquo;what&apos;s the temperature?&rdquo; and &ldquo;is the fan on?&rdquo; get answered from real readings.</p>
            <h3>The voice pipeline</h3>
            <ol className="lm-steps">
              <li><b>Trigger.</b> You say &ldquo;Hello Robot&rdquo; or hold the push-to-talk button.</li>
              <li><b>Record.</b> The INMP441 captures about three seconds of 16&nbsp;kHz mono audio. The red REC LED stays lit during the capture.</li>
              <li><b>Wrap and upload.</b> The raw PCM gets a 44-byte WAV header and streams to <code>/upload</code> as it is recorded.</li>
              <li><b>Transcribe.</b> The server sends the clip to OpenRouter, where Whisper turns it into text.</li>
              <li><b>Add context.</b> The transcript and a snapshot of device state and sensor readings go to the model.</li>
              <li><b>Parse.</b> A DeepSeek model (also through OpenRouter) returns one JSON command, validated against the schema: retry once, else a no-op.</li>
              <li><b>Send.</b> The server publishes the command to MQTT and appends a row to the Google Sheet.</li>
              <li><b>Execute.</b> The ESP32 receives it, acts on it and shows the reply on its OLED.</li>
            </ol>
          </section>

          <section id="brain" className="art-section" data-reveal>
            <h2>The parser: one sentence, one command</h2>
            <p>The model never controls a device directly. It converts one sentence into exactly one of three JSON shapes:</p>
            <ul className="lm-list">
              <li><b>action</b>: a single change. &ldquo;Turn the fan on&rdquo;, &ldquo;set it to cyan&rdquo;.</li>
              <li><b>sequence</b>: ordered steps, each with a delay from the moment you spoke. &ldquo;Lights off, then fan off a second later&rdquo;.</li>
              <li><b>timer</b>: one change after a countdown. &ldquo;Light off in ten minutes&rdquo;.</li>
            </ul>
            <CommandFlowchart />
            <p>It is multilingual. Whisper transcribes many languages and each one resolves to the same JSON vocabulary, so a command spoken in Malay or Mandarin produces the same action as the English version.</p>
            <p>A long, strict system prompt fixes the device vocabulary (white LED, NeoPixel RGB, fan, servo, buzzer, comfort range, auto mode), forces valid JSON with numbers as numbers, and has the model map colour names to RGB itself. The server checks every response against a schema. If it fails, the server retries once, then falls back to a no-op instead of sending the board something it cannot trust.</p>
            <PromptReveal text={SYSTEM_PROMPT} />
            <p>The model can also use the room&apos;s readings as inputs. Ask it to &ldquo;set the brightness to the humidity percentage&rdquo; and it reads the live humidity from the cached sensor state, rounds it, clamps it to the LED&apos;s 0 to 100 range and emits a real <code>set_brightness</code> command.</p>
          </section>

          <section id="hardware" className="art-section" data-reveal>
            <h2>Hardware</h2>
            <p>Everything hangs off one ESP32-WROOM running MicroPython. Inputs on one side, outputs on the other, all served by one non-blocking main loop so trigger detection never stalls.</p>
            <HardwareHub />
            <p>The LDR is a digital light module with its own sensitivity potentiometer, so there are no analog reads, which avoids the ESP32&apos;s ADC conflict with WiFi. A red LED lights only while the microphone is recording. An SSD1306 OLED with two navigation buttons shows status and the last command across four pages. The DF2301Q wake-word module is wired in and its driver is written, but on the bench I demo with the push-to-talk button.</p>
            <figure className="art-fig">
              <img src="/images/lumen-mic.webp" alt="Close-up of the INMP441 I2S microphone wired to the ESP32" loading="lazy" />
              <figcaption>The INMP441 I2S microphone.</figcaption>
            </figure>
          </section>

          <section id="memory" className="art-section" data-reveal>
            <h2>Fitting it in memory</h2>
            <p>The ESP32-WROOM has no PSRAM. With WiFi up, MicroPython left me about 33&nbsp;KB of usable RAM. A voice clip is about 96&nbsp;KB, so the audio does not fit in memory.</p>
            <p>So nothing holds the whole clip. The microphone is one persistent, pre-warmed instance, the capture buffers are small and allocated lazily, and the upload is <strong>streamed over a raw socket</strong> as it records: a preamble, the WAV header, the PCM chunk by chunk, then a tail. Peak memory during an upload is about 10&nbsp;KB. Building one big <code>bytes</code> object instead makes the garbage collector take a ~26&nbsp;KB block from the same heap that WiFi and the I2S microphone need, which starves the network stack and the upload times out.</p>
            <p>The OLED showed me where the ceiling is. A lean four-page status screen ships in the current firmware. A richer version with live-refreshing sensor values and a recording splash grew the heap enough to break boot: the board could no longer connect to MQTT (<code>ENOBUFS</code>) or open the microphone (<code>ENOMEM</code>). To make room I also removed the real-time clock and clock-time schedules. Timers now run off a monotonic tick count and need no clock.</p>
          </section>

          <section id="auto" className="art-section" data-reveal>
            <h2>Auto mode</h2>
            <p>Auto mode runs locally on the board. If it detects motion while the room is dark, it turns the white LED on, then off after five minutes without motion. If the temperature rises above the comfort range, the fan turns on, with a hysteresis gap so it does not toggle around the threshold.</p>
            <p>Any spoken command takes priority and clears the automatic state, so auto mode never overrides a light you just set.</p>
          </section>

          <section id="deploy" className="art-section" data-reveal>
            <h2>Dashboard and deployment</h2>
            <p>The server is a Dockerised FastAPI app with a web dashboard: device controls (white LED, RGB picker, fan, servo, buzzer, auto-mode toggle, comfort-range editor), a live state readout, a temperature and humidity history chart, a log of recent commands, a player for the last few voice recordings, and a text box that feeds the same LLM path. The text box is my backup if the microphone fails during a live demo. A reset clears the chart, log and recordings.</p>
            <p>It runs on my homelab behind Nginx Proxy Manager and Cloudflare, which serve the dashboard on an HTTPS hostname. The MQTT broker is reached directly, not through Cloudflare. The ESP32 only talks to a LAN address, never the public hostname, which keeps the firmware small.</p>
            <figure className="art-fig lm-dash">
              <img src="/images/lumen-dashboard.webp" alt="The LUMEN web dashboard: device controls, live readout, history chart and activity log" loading="lazy" />
              <figcaption>The dashboard: device controls, live state, the temperature and humidity chart, the activity log and recordings.</figcaption>
            </figure>
          </section>

          <section id="slides" className="art-section" data-reveal>
            <h2>Slides</h2>
            <p>The deck I presented at the module review: the brief, the pipeline, the memory work and the demo.</p>
            <div className="art-embed lm-deck">
              <iframe
                title="LUMEN project presentation (Figma deck)"
                src="https://embed.figma.com/deck/SPhrhpw7sGvLo9PwOkXY8b/LUMEN?embed-host=share"
                allowFullScreen
                loading="lazy"
              />
            </div>
          </section>

          <section id="next" className="art-section" data-reveal>
            <h2>What I&apos;d add next</h2>
            <p>An ESP32-S3 with PSRAM would bring back most of what I cut. The WROOM is at its limit streaming microphone audio while running WiFi and MQTT.</p>
            <ul className="lm-list">
              <li><b>A richer OLED</b>: live-refreshing sensor pages and a recording splash, the versions I had to remove.</li>
              <li><b>Clock-time schedules</b> (&ldquo;every day at 8&nbsp;am&rdquo;), which need the real-time clock I removed to save memory.</li>
              <li><b>Durable history</b>, so the dashboard&apos;s charts and the timers survive a reboot. Today the last couple of hours live only in RAM.</li>
              <li><b>A working wake word</b> on the hardware, so push-to-talk becomes the fallback instead of the main trigger.</li>
            </ul>

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
          background: linear-gradient(165deg, var(--sa-panel-hi, rgba(20,22,38,0.7)), var(--sa-panel-lo, rgba(10,11,20,0.85)));
          border: 1px solid var(--sa-hairline, rgba(255,255,255,0.1)); }
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
        .lm-pr-head { display: flex; align-items: center; justify-content: space-between; gap: 9px 14px; flex-wrap: wrap; margin-bottom: 9px; }
        .lm-pr-eyebrow { font-size: 0.62rem; letter-spacing: 0.16em; text-transform: uppercase; color: #7a8398; font-family: var(--font-ddt, monospace); }
        .lm-pr-toggle { display: inline-flex; gap: 2px; padding: 3px; border-radius: 999px; border: 1px solid var(--hp-line, rgba(255,255,255,0.1)); background: rgba(255,255,255,0.03); }
        .lm-pr-tab { font-family: inherit; font-size: 0.72rem; font-weight: 600; padding: 4px 13px; border: none; border-radius: 999px; background: transparent; color: #aab4c8; cursor: pointer; transition: color 0.2s, background 0.2s, transform 0.15s; }
        .lm-pr-tab:hover { color: #eef1f7; }
        .lm-pr-tab:active { transform: scale(0.96); }
        .lm-pr-tab.on { color: #08101e; background: var(--hp-sky, #7fa8ff); }
        .lm-pr-tab:focus-visible { outline: 2px solid var(--hp-sky, #7fa8ff); outline-offset: 2px; }
        .lm-pr-box { position: relative; border: 1px solid var(--hp-line, rgba(255,255,255,0.1)); border-radius: 14px; background: rgba(0,0,0,0.3); overflow: hidden; }
        .lm-pr-content { max-height: 230px; overflow: hidden; transition: max-height 0.55s cubic-bezier(0.16,1,0.3,1); }
        .lm-pr.open .lm-pr-content { max-height: 9000px; overflow: visible; }
        .lm-pr-pre { margin: 0; padding: 16px;
          font-family: var(--font-ddt, ui-monospace, monospace); font-size: 0.78rem; line-height: 1.55; color: #c7d0e0; white-space: pre-wrap; word-break: break-word; }
        /* Formatted (rendered-markdown) view */
        .lm-pr-fmt { padding: 15px 17px; font-size: 0.84rem; line-height: 1.62; color: #c7d0e0; font-family: var(--font-dmsans, inherit); }
        .lm-pr-fmt > :first-child { margin-top: 0; }
        .lm-pr-h { margin: 18px 0 7px; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.13em; text-transform: uppercase; color: var(--hp-sky, #7fa8ff); }
        .lm-pr-p { margin: 7px 0; }
        .lm-pr-ol { margin: 7px 0; padding-left: 21px; }
        .lm-pr-ol > li { margin: 4px 0; }
        .lm-pr-ul { margin: 7px 0; padding-left: 4px; list-style: none; }
        .lm-pr-ul > li { position: relative; padding-left: 17px; margin: 5px 0; }
        .lm-pr-ul > li::before { content: ''; position: absolute; left: 2px; top: 0.62em; width: 5px; height: 5px; border-radius: 1px; background: var(--hp-sky, #7fa8ff); }
        .lm-pr-sub { margin: 5px 0; padding-left: 4px; list-style: none; }
        .lm-pr-sub > li { position: relative; padding-left: 15px; margin: 3px 0; color: #aab4c8; }
        .lm-pr-sub > li::before { content: ''; position: absolute; left: 1px; top: 0.66em; width: 6px; height: 1px; background: #6d768a; }
        .lm-pr-q { color: #e7ecf6; font-style: italic; }
        .lm-pr-arrow { color: var(--hp-sky, #7fa8ff); font-weight: 600; padding: 0 2px; }
        .lm-pr-ex { margin: 9px 0; border: 1px solid rgba(255,255,255,0.07); border-radius: 10px; overflow: hidden; background: rgba(255,255,255,0.015); }
        .lm-pr-ex-q { padding: 8px 12px; font-style: italic; color: #e7ecf6; background: color-mix(in srgb, var(--hp-sky, #7fa8ff) 7%, transparent); border-bottom: 1px solid rgba(255,255,255,0.06); }
        .lm-pr-ex-code { margin: 0; padding: 10px 12px; font-family: var(--font-ddt, ui-monospace, monospace); font-size: 0.73rem; line-height: 1.5; color: #b7e3c8; white-space: pre-wrap; word-break: break-word; }
        /* Collapsed preview dissolves into the field via a mask (no opaque fade slab) */
        .lm-pr:not(.open) .lm-pr-content {
          -webkit-mask-image: linear-gradient(180deg, #000 45%, transparent 97%);
          mask-image: linear-gradient(180deg, #000 45%, transparent 97%); }
        .lm-pr-fade { display: none; }
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

        /* ── Figma slide deck (decks are 16:9, not the .art-embed default) ── */
        .lm-deck { aspect-ratio: 16 / 9; }

        /* ── Demo video ── */
        .lm-demo { margin: 1.3rem 0 0.6rem; }
        .lm-demo video { width: 100%; height: auto; aspect-ratio: 16 / 9; display: block; border-radius: 14px; background: #000; border: 1px solid rgba(255,255,255,0.08); }
        .lm-demo figcaption { margin-top: 0.7rem; font-size: 0.86rem; color: #8b94a8; text-align: center; }

        /* ── Dashboard (tall portrait) figure ── */
        .lm-dash img { display: block; margin: 0 auto; max-height: 80vh; width: auto; border-radius: 12px; }

        /* ── Inline SVG diagrams ── */
        .lm-dia { width: 100%; box-sizing: border-box; margin: 1.2rem 0 0.6rem; padding: clamp(16px, 2.4vw, 26px); border-radius: 18px;
          background: linear-gradient(165deg, var(--sa-panel-hi, rgba(20,22,38,0.7)), var(--sa-panel-lo, rgba(10,11,20,0.85)));
          border: 1px solid var(--sa-hairline, rgba(255,255,255,0.1)); overflow-x: auto; -webkit-overflow-scrolling: touch; }
        .lm-dia svg { width: 100%; height: auto; display: block; }
        /* On phones, both inline diagrams reflow to native layouts (see .lm-fc-m / .lm-hw-m)
           instead of shrinking the SVG or scrolling it sideways */
        @media (max-width: 640px) {
          .lm-dia { padding: 14px; }
          .lm-dia > svg { display: none; }
        }
        .lm-dia .d-box { fill: rgba(255,255,255,0.03); stroke: color-mix(in srgb, var(--hp-sky, #7fa8ff) 30%, rgba(255,255,255,0.12)); }
        .lm-dia .d-box.accent { fill: color-mix(in srgb, var(--hp-sky, #7fa8ff) 12%, transparent); stroke: var(--hp-sky, #7fa8ff); }
        .lm-dia .d-box.warm { fill: rgba(245,201,122,0.08); stroke: rgba(245,201,122,0.55); }
        .lm-dia .d-box.note { fill: color-mix(in srgb, var(--hp-sky, #7fa8ff) 5%, transparent); stroke: color-mix(in srgb, var(--hp-sky, #7fa8ff) 30%, rgba(255,255,255,0.1)); stroke-dasharray: 5 4; }
        .lm-dia .d-t { fill: #e8edf6; font-size: 13px; font-weight: 600; font-family: var(--font-dmsans, sans-serif); }
        .lm-dia .d-s { fill: #97a1b6; font-size: 10.5px; font-family: var(--font-dmsans, sans-serif); }
        .lm-dia .d-line { stroke: color-mix(in srgb, var(--hp-sky, #7fa8ff) 45%, rgba(255,255,255,0.2)); stroke-width: 1.6; fill: none; }
        .lm-dia .d-line.dash { stroke-dasharray: 4 4; opacity: 0.7; }
        .lm-dia .d-chip { fill: #b7e3c8; font-size: 11px; font-family: var(--font-ddt, monospace); }
        .lm-dia-cap { font-size: 0.86rem; color: #8b94a8; text-align: center; margin-top: 0.7rem; }

        /* ── Command flowchart: native top-to-bottom reflow for phones (replaces the scrolling SVG) ── */
        .lm-fc-m { display: none; }
        .lm-hw-m { display: none; }
        @media (max-width: 640px) {
          .lm-fc-m { display: flex; flex-direction: column; align-items: stretch; }
          .lm-hw-m { display: flex; flex-direction: column; gap: 14px; }
        }
        .lm-fc-node { position: relative; border-radius: 14px; padding: 15px 17px; text-align: center;
          border: 1px solid color-mix(in srgb, var(--hp-sky, #7fa8ff) 26%, rgba(255,255,255,0.12));
          background: rgba(255,255,255,0.035); }
        .lm-fc-node b { display: block; font-size: 0.96rem; font-weight: 600; color: #eef1f7; font-family: var(--font-dmsans, sans-serif); line-height: 1.35; }
        .lm-fc-node span { display: block; margin-top: 5px; font-size: 0.81rem; line-height: 1.5; color: #97a1b6; }
        .lm-fc-node .lm-fc-badge { display: inline-block; margin-top: 10px; padding: 3px 11px; border-radius: 999px;
          font-size: 0.64rem; letter-spacing: 0.09em; text-transform: uppercase; font-family: var(--font-ddt, monospace);
          color: var(--hp-sky, #7fa8ff); background: color-mix(in srgb, var(--hp-sky, #7fa8ff) 13%, transparent);
          border: 1px solid color-mix(in srgb, var(--hp-sky, #7fa8ff) 34%, transparent); }
        .lm-fc-node .lm-fc-badge::before { content: '🌐'; margin-right: 5px; font-size: 0.72rem; }
        .lm-fc-node.accent { background: color-mix(in srgb, var(--hp-sky, #7fa8ff) 12%, transparent); border-color: color-mix(in srgb, var(--hp-sky, #7fa8ff) 70%, transparent); }
        .lm-fc-node.accent b { color: #dce7ff; }
        .lm-fc-node.warm { background: rgba(245,201,122,0.08); border-color: rgba(245,201,122,0.5); }
        .lm-fc-node.warm b { color: #f3d9a6; }
        .lm-fc-node.dec { border-style: dashed; border-color: color-mix(in srgb, var(--hp-sky, #7fa8ff) 55%, transparent);
          background: color-mix(in srgb, var(--hp-sky, #7fa8ff) 7%, transparent); }
        .lm-fc-node.dec b { color: var(--hp-sky, #7fa8ff); }

        /* vertical connector: line + down-arrow, with an optional centered chip label */
        .lm-fc-conn { position: relative; height: 42px; }
        .lm-fc-conn.sm { height: 32px; }
        .lm-fc-conn::before { content: ''; position: absolute; left: 50%; top: -1px; bottom: 6px; width: 2px; transform: translateX(-50%);
          background: color-mix(in srgb, var(--hp-sky, #7fa8ff) 42%, rgba(255,255,255,0.16)); }
        .lm-fc-conn::after { content: ''; position: absolute; left: 50%; bottom: 4px; width: 7px; height: 7px;
          border-right: 2px solid color-mix(in srgb, var(--hp-sky, #7fa8ff) 52%, rgba(255,255,255,0.2));
          border-bottom: 2px solid color-mix(in srgb, var(--hp-sky, #7fa8ff) 52%, rgba(255,255,255,0.2));
          transform: translate(-50%, 0) rotate(45deg); }
        .lm-fc-conn i { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -58%); white-space: nowrap;
          padding: 2px 11px; border-radius: 999px; font-style: normal; font-size: 0.65rem; letter-spacing: 0.08em; text-transform: uppercase;
          font-family: var(--font-ddt, monospace); color: #b7e3c8; background: #0d0f1a; border: 1px solid rgba(255,255,255,0.09); }

        /* the failure branch: a clearly self-contained, dimmer side path */
        .lm-fc-branch { display: flex; flex-direction: column; align-items: stretch; padding: 14px 14px 16px;
          border-radius: 14px; border: 1px dashed rgba(245,201,122,0.4); background: rgba(245,201,122,0.045); }
        .lm-fc-blabel { align-self: flex-start; margin-bottom: 13px; padding: 3px 10px; border-radius: 999px;
          font-size: 0.6rem; letter-spacing: 0.1em; text-transform: uppercase; font-family: var(--font-ddt, monospace);
          color: #f3d9a6; background: rgba(245,201,122,0.12); border: 1px solid rgba(245,201,122,0.32); }
        .lm-fc-branch .lm-fc-conn::before { background: rgba(245,201,122,0.45); }
        .lm-fc-branch .lm-fc-conn::after { border-color: rgba(245,201,122,0.5); }

        /* the three command outcomes */
        .lm-fc-outs { display: flex; flex-direction: column; gap: 9px; }
        .lm-fc-out { display: flex; align-items: baseline; gap: 11px; padding: 12px 15px; border-radius: 12px;
          border: 1px solid var(--hp-line, rgba(255,255,255,0.1)); background: rgba(255,255,255,0.025); }
        .lm-fc-out::before { content: ''; flex: none; align-self: center; width: 7px; height: 7px; border-radius: 2px;
          background: var(--hp-sky, #7fa8ff); box-shadow: 0 0 8px color-mix(in srgb, var(--hp-sky, #7fa8ff) 55%, transparent); }
        .lm-fc-out b { flex: none; min-width: 62px; text-align: left; font-size: 0.86rem; color: #eef1f7; font-family: var(--font-dmsans, sans-serif); }
        .lm-fc-out span { font-size: 0.78rem; line-height: 1.4; color: #97a1b6; }

        /* ── Hardware map: native pin-list reflow for phones (replaces the scrolling wiring SVG) ── */
        .lm-hw-core { text-align: center; padding: 14px 16px; border-radius: 14px;
          border: 1px solid var(--hp-sky, #7fa8ff); background: color-mix(in srgb, var(--hp-sky, #7fa8ff) 12%, transparent); }
        .lm-hw-core b { display: block; font-size: 1rem; letter-spacing: 0.02em; color: #dce7ff; font-family: var(--font-dmsans, sans-serif); }
        .lm-hw-core span { display: block; margin-top: 3px; font-size: 0.79rem; color: #9fb2dd; }
        .lm-hw-group { border: 1px solid var(--hp-line, rgba(255,255,255,0.1)); border-radius: 14px; background: rgba(255,255,255,0.02); overflow: hidden; }
        .lm-hw-glabel { display: flex; align-items: center; gap: 8px; padding: 10px 15px; font-size: 0.64rem; letter-spacing: 0.12em; text-transform: uppercase;
          font-family: var(--font-ddt, monospace); color: #8b94a8; background: rgba(255,255,255,0.025); border-bottom: 1px solid var(--hp-line, rgba(255,255,255,0.08)); }
        .lm-hw-glabel::before { content: ''; width: 7px; height: 7px; border-radius: 2px; background: var(--hp-sky, #7fa8ff); flex: none; }
        .lm-hw-group.out .lm-hw-glabel::before { background: #5ad6a0; }
        .lm-hw-group.bus .lm-hw-glabel::before { background: #b79bff; }
        .lm-hw-row { display: flex; align-items: center; gap: 12px; padding: 11px 15px; }
        .lm-hw-row + .lm-hw-row { border-top: 1px solid rgba(255,255,255,0.05); }
        .lm-hw-row > div { flex: 1; min-width: 0; }
        .lm-hw-row b { display: block; font-size: 0.88rem; color: #eef1f7; font-family: var(--font-dmsans, sans-serif); }
        .lm-hw-row span { display: block; margin-top: 1px; font-size: 0.76rem; line-height: 1.4; color: #97a1b6; }
        .lm-hw-pin { flex: none; padding: 4px 10px; border-radius: 8px; font-size: 0.72rem; font-family: var(--font-ddt, monospace);
          color: #b7e3c8; background: color-mix(in srgb, var(--hp-sky, #7fa8ff) 9%, rgba(255,255,255,0.02)); border: 1px solid rgba(255,255,255,0.1); white-space: nowrap; }
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
            <b>Trigger and mic</b>
            <span>Wake word or push-to-talk. The INMP441 captures 16&nbsp;kHz mono audio.</span>
          </div>
        </div>

        <div className="lm-flow-link">
          <span className="lm-flow-pill">stream to /upload</span>
          <i className="lm-flow-ar" aria-hidden="true" />
        </div>

        <div className="lm-flow-stage">
          <span className="lm-flow-tag">FastAPI server, OpenRouter</span>
          <div className="lm-flow-card lit">
            <b>Whisper, DeepSeek, validate</b>
            <span>Whisper turns speech into text and a DeepSeek model parses it into one JSON command. The server checks it against the schema: retry once, else a no-op.</span>
          </div>
        </div>

        <div className="lm-flow-link">
          <span className="lm-flow-pill">MQTT command</span>
          <i className="lm-flow-ar" aria-hidden="true" />
        </div>

        <div className="lm-flow-stage">
          <span className="lm-flow-tag">In the room</span>
          <div className="lm-flow-card">
            <b>Devices act</b>
            <span>The LED, RGB, fan, servo and buzzer respond, and the OLED shows the reply.</span>
          </div>
        </div>
      </div>
      <figcaption className="lm-flow-foot">The server also caches the room&apos;s live state and sensor readings, passes them to the LLM as context and logs every call. The board only records and executes.</figcaption>
    </figure>
  );
}

function CommandFlowchart() {
  return (
    <figure className="lm-dia lm-fc" data-no-zoom>
      <svg viewBox="0 0 840 445" role="img" aria-label="Command parsing flowchart. Speech in any of many languages is transcribed by Whisper, then the text and live sensor context go to the DeepSeek LLM. If the output JSON fails schema validation, the server retries once, and if it is still invalid the result is a safe no-op. If valid, the command is routed by type: action for a single device change, sequence for ordered steps with delays, or timer for one change after a countdown.">
        <defs>
          <marker id="lm-fc-arr" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="var(--hp-sky, #7fa8ff)" fillOpacity="0.7" />
          </marker>
        </defs>

        {/* ─ Input node ─ */}
        <rect className="d-box" x="180" y="16" width="360" height="52" rx="10" />
        <text className="d-t" x="360" y="38" textAnchor="middle">Transcribed text and sensor context</text>
        <text className="d-s" x="360" y="56" textAnchor="middle">Whisper transcript plus a live room snapshot from the MQTT cache</text>

        {/* Multilingual annotation on the input */}
        <line className="d-line dash" x1="540" y1="42" x2="586" y2="42" />
        <rect className="d-box note" x="588" y="20" width="232" height="46" rx="10" />
        <text className="d-t" x="601" y="40" style={{fontSize: 12}}>Multilingual input</text>
        <text className="d-s" x="601" y="56">Whisper handles many languages</text>

        {/* Arrow: input → DeepSeek */}
        <line className="d-line" x1="360" y1="68" x2="360" y2="95" markerEnd="url(#lm-fc-arr)" />

        {/* ─ DeepSeek LLM node ─ */}
        <rect className="d-box accent" x="205" y="97" width="310" height="52" rx="10" />
        <text className="d-t" x="360" y="119" textAnchor="middle">DeepSeek LLM (through OpenRouter)</text>
        <text className="d-s" x="360" y="137" textAnchor="middle">Parses the request into one JSON command</text>

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
        <text className="d-s" x="360" y="323" textAnchor="middle">action, sequence or timer</text>

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
        <text className="d-s" x="637" y="227" textAnchor="middle">re-prompt the LLM</text>

        {/* Fails arrow: retry → no-op */}
        <line className="d-line" x1="637" y1="241" x2="637" y2="269" markerEnd="url(#lm-fc-arr)" />
        <text className="d-chip" x="645" y="259">fails</text>

        {/* ─ Safe no-op node ─ */}
        <rect className="d-box warm" x="560" y="271" width="155" height="52" rx="10" />
        <text className="d-t" x="637" y="293" textAnchor="middle">Safe no-op</text>
        <text className="d-s" x="637" y="309" textAnchor="middle">reply only, no action</text>
      </svg>

      {/* Phone layout: the same flow, reflowed top-to-bottom so nothing shrinks, scrolls, or overlaps */}
      <div className="lm-fc-m">
        <div className="lm-fc-node">
          <b>Transcribed text and sensor context</b>
          <span>Whisper transcript plus a live room snapshot from the MQTT cache</span>
          <span className="lm-fc-badge">Speaks many languages</span>
        </div>

        <div className="lm-fc-conn" />

        <div className="lm-fc-node accent">
          <b>DeepSeek LLM (through OpenRouter)</b>
          <span>Parses the request into one JSON command</span>
        </div>

        <div className="lm-fc-conn"><i>JSON</i></div>

        <div className="lm-fc-node dec">
          <b>JSON schema valid?</b>
        </div>

        <div className="lm-fc-conn sm"><i>if invalid</i></div>

        <div className="lm-fc-branch">
          <span className="lm-fc-blabel">Failure path</span>
          <div className="lm-fc-node">
            <b>Retry once</b>
            <span>Re-prompt the LLM</span>
          </div>
          <div className="lm-fc-conn sm"><i>still fails</i></div>
          <div className="lm-fc-node warm">
            <b>Safe no-op</b>
            <span>Reply only, no action on the room</span>
          </div>
        </div>

        <div className="lm-fc-conn"><i>if valid</i></div>

        <div className="lm-fc-node">
          <b>Route by command type</b>
          <span>action, sequence or timer</span>
        </div>

        <div className="lm-fc-conn"><i>by type</i></div>

        <div className="lm-fc-outs">
          <div className="lm-fc-out"><b>action</b><span>Single device change</span></div>
          <div className="lm-fc-out"><b>sequence</b><span>Steps with delays</span></div>
          <div className="lm-fc-out"><b>timer</b><span>One change after a delay</span></div>
        </div>
      </div>

      <figcaption className="lm-dia-cap">How a voice command moves through the parser. Every path ends in one of four outcomes: action, sequence, timer, or a refusal that takes no action.</figcaption>
    </figure>
  );
}

function HardwareHub() {
  const left: [string, string, string][] = [
    ['INMP441 mic', 'I2S microphone', 'G14, 23, 32'],
    ['DHT22', 'temperature and humidity', 'G4'],
    ['PIR', 'motion', 'G35'],
    ['LDR module', 'light or dark', 'G34'],
    ['PTT button', 'push-to-talk', 'G19'],
  ];
  const right: [string, string, string][] = [
    ['White LED', 'PWM brightness', 'G25'],
    ['NeoPixel', 'WS2812 RGB', 'G27'],
    ['Fan', 'on or off', 'G26'],
    ['Servo', '0 to 180°', 'G13'],
    ['Buzzer', 'beeps and alerts', 'G33'],
    ['REC LED', 'recording', 'G17'],
  ];
  const bottom: [string, string, string][] = [
    ['OLED', 'SSD1306, 0x3C', 'I2C'],
    ['DF2301Q', 'wake word, 0x64', 'I2C'],
    ['Nav A', 'page', 'G18'],
    ['Nav B', 'page', 'G16'],
  ];
  return (
    <figure className="lm-dia lm-hw" data-no-zoom>
      <svg viewBox="0 0 960 600" role="img" aria-label="Wiring map with an ESP32-WROOM at the centre. Left, the sensors and their pins: INMP441 mic on I2S (GPIO 14, 23, 32), DHT22 (GPIO 4), PIR (GPIO 35), LDR (GPIO 34), push-to-talk button (GPIO 19). Right, the outputs: white LED (GPIO 25), NeoPixel (GPIO 27), fan (GPIO 26), servo (GPIO 13), buzzer (GPIO 33), recording LED (GPIO 17). Along the bottom, the shared I2C bus (SDA 21, SCL 22) carries the SSD1306 OLED (0x3C) and the DF2301Q wake-word module (0x64), and two navigation buttons sit on GPIO 18 and 16.">
        <text className="d-s" x="20" y="26">Sensors and inputs</text>
        <text className="d-s" x="772" y="26" textAnchor="end">Outputs</text>
        <text className="d-s" x="20" y="480">I2C bus (SDA 21, SCL 22) and UI buttons</text>

        {/* ESP32 centre */}
        <rect className="d-box accent" x="392" y="250" width="176" height="118" rx="16" />
        <text className="d-t" x="480" y="298" textAnchor="middle" style={{ fontSize: 17 }}>ESP32</text>
        <text className="d-s" x="480" y="320" textAnchor="middle">WROOM, MicroPython</text>
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

      {/* Phone layout: the same wiring as a grouped pin list, no shrinking or sideways scroll */}
      <div className="lm-hw-m">
        <div className="lm-hw-core">
          <b>ESP32-WROOM</b>
          <span>MicroPython, one non-blocking loop</span>
        </div>
        <div className="lm-hw-group">
          <span className="lm-hw-glabel">Sensors and inputs</span>
          {left.map(([n, s, p]) => (
            <div className="lm-hw-row" key={n}>
              <div><b>{n}</b><span>{s}</span></div>
              <span className="lm-hw-pin">{p}</span>
            </div>
          ))}
        </div>
        <div className="lm-hw-group out">
          <span className="lm-hw-glabel">Outputs</span>
          {right.map(([n, s, p]) => (
            <div className="lm-hw-row" key={n}>
              <div><b>{n}</b><span>{s}</span></div>
              <span className="lm-hw-pin">{p}</span>
            </div>
          ))}
        </div>
        <div className="lm-hw-group bus">
          <span className="lm-hw-glabel">I2C bus (SDA 21, SCL 22) and UI buttons</span>
          {bottom.map(([n, s, p]) => (
            <div className="lm-hw-row" key={n}>
              <div><b>{n}</b><span>{s}</span></div>
              <span className="lm-hw-pin">{p}</span>
            </div>
          ))}
        </div>
      </div>

      <figcaption className="lm-dia-cap">Every component and the GPIO it uses, from <code>docs/pinmap.md</code>. The OLED and DF2301Q share one I2C bus.</figcaption>
    </figure>
  );
}
