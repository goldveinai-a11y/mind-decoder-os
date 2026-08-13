/**
 * Browser-side 8-bit chip-tune synthesizer using Web Audio API.
 * No external files — everything is generated in real time.
 */

type Envelope = {
  attack: number;
  decay: number;
  sustain: number;
  release: number;
};

type Step = {
  bass: number;
  lead: number;
  noise?: boolean;
};

const STORAGE_KEY = "unbluff_sound_enabled";

class ChiptuneEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private loopOscillators: OscillatorNode[] = [];
  private loopGains: GainNode[] = [];
  private loopTimeouts: number[] = [];
  private enabled = false;
  private active = false;

  constructor() {
    if (typeof window === "undefined") return;
    this.enabled = localStorage.getItem(STORAGE_KEY) === "1";
  }

  private init() {
    if (this.ctx) return;
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    this.ctx = new AudioCtx();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.25;
    this.master.connect(this.ctx.destination);
  }

  isEnabled() {
    return this.enabled;
  }

  setEnabled(value: boolean) {
    this.enabled = value;
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, value ? "1" : "0");
    }
    if (value) {
      this.init();
      // Resume context if suspended (browser autoplay policy).
      void this.ctx?.resume();
    } else {
      this.stopLoop();
    }
  }

  toggle() {
    this.setEnabled(!this.enabled);
    return this.enabled;
  }

  /** Start the urgent 8-bit loop. Safe to call repeatedly. */
  playLoop() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx || !this.master || this.active) return;
    this.active = true;
    this.scheduleLoop();
  }

  /** Stop the loop immediately. */
  stopLoop() {
    this.active = false;
    this.loopOscillators.forEach((o) => {
      try {
        o.stop();
        o.disconnect();
      } catch {
        /* already stopped */
      }
    });
    this.loopGains.forEach((g) => g.disconnect());
    this.loopTimeouts.forEach((id) => window.clearTimeout(id));
    this.loopOscillators = [];
    this.loopGains = [];
    this.loopTimeouts = [];
  }

  /** Short confirmation / unlock blip. */
  blipSuccess() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx || !this.master) return;
    const now = this.ctx.currentTime;
    this.playTone(880, 0.08, now, "square", { attack: 0.01, decay: 0.05, sustain: 0.1, release: 0.1 });
    this.playTone(1760, 0.08, now + 0.08, "square", { attack: 0.01, decay: 0.05, sustain: 0.1, release: 0.1 });
  }

  /** Short scan-start blip. */
  blipScan() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx || !this.master) return;
    const now = this.ctx.currentTime;
    this.playTone(440, 0.12, now, "sawtooth", { attack: 0.01, decay: 0.08, sustain: 0.2, release: 0.1 });
    this.playTone(660, 0.12, now + 0.1, "sawtooth", { attack: 0.01, decay: 0.08, sustain: 0.2, release: 0.1 });
  }

  private scheduleLoop() {
    if (!this.ctx || !this.master || !this.active) return;
    const tempo = 0.18; // seconds per 16th note
    const pattern = this.buildPattern();
    let t = this.ctx.currentTime + 0.05;

    // Build ~8 seconds of loop, then reschedule.
    const duration = 8;
    const steps = Math.floor(duration / tempo);

    for (let i = 0; i < steps; i++) {
      const stepTime = t + i * tempo;
      const step = pattern[i % pattern.length];
      if (!step) continue;

      if (step.bass) {
        this.playTone(step.bass, tempo * 0.95, stepTime, "square", {
          attack: 0.005,
          decay: 0.04,
          sustain: 0.3,
          release: 0.04,
        });
      }
      if (step.lead) {
        this.playTone(step.lead, tempo * 0.85, stepTime, "square", {
          attack: 0.005,
          decay: 0.03,
          sustain: 0.25,
          release: 0.05,
        });
      }
      if (step.noise) {
        this.playNoise(tempo * 0.4, stepTime);
      }
    }

    const id = window.setTimeout(() => {
      if (this.active) this.scheduleLoop();
    }, duration * 1000 - 100);
    this.loopTimeouts.push(id);
  }

  private buildPattern(): Step[] {
    // Tense minor-key arpeggio with driving bass.
    const bassLine: number[] = [110, 110, 130, 110, 98, 98, 110, 98];
    const leadLine: number[][] = [
      [440, 523, 659],
      [440, 523, 659],
      [466, 554, 698],
      [440, 523, 659],
      [392, 466, 587],
      [392, 466, 587],
      [415, 494, 622],
      [392, 466, 587],
    ];
    const steps: Step[] = [];
    for (let bar = 0; bar < 8; bar++) {
      for (let beat = 0; beat < 4; beat++) {
        const bassIndex = (bar * 2 + Math.floor(beat / 2)) % bassLine.length;
        const chordIndex = bar % leadLine.length;
        const bass = bassLine[bassIndex];
        const chord = leadLine[chordIndex];
        if (!bass || !chord) continue;
        steps.push({ bass, lead: chord[beat % 3], noise: beat === 1 || beat === 3 });
        steps.push({ bass, lead: chord[(beat + 1) % 3] });
        steps.push({ bass, lead: chord[(beat + 2) % 3] });
        steps.push({ bass, lead: chord[beat % 3], noise: beat === 3 });
      }
    }
    return steps;
  }

  private playTone(
    freq: number,
    duration: number,
    when: number,
    type: OscillatorType,
    env: Envelope,
  ) {
    if (!this.ctx || !this.master) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    osc.connect(gain);
    gain.connect(this.master);

    const now = when;
    const { attack, decay, sustain, release } = env;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.25, now + attack);
    gain.gain.linearRampToValueAtTime(0.25 * sustain, now + attack + decay);
    gain.gain.setValueAtTime(0.25 * sustain, now + duration - release);
    gain.gain.linearRampToValueAtTime(0, now + duration);

    osc.start(now);
    osc.stop(now + duration + 0.05);

    this.loopOscillators.push(osc);
    this.loopGains.push(gain);
  }

  private playNoise(duration: number, when: number) {
    if (!this.ctx || !this.master) return;
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const src = this.ctx.createBufferSource();
    src.buffer = buffer;
    const gain = this.ctx.createGain();
    // Lowpass-ish noise via simple gain envelope.
    gain.gain.setValueAtTime(0.15, when);
    gain.gain.exponentialRampToValueAtTime(0.01, when + duration);
    src.connect(gain);
    gain.connect(this.master);
    src.start(when);
    src.stop(when + duration);
    this.loopGains.push(gain);
  }
}

export const chiptune = new ChiptuneEngine();
