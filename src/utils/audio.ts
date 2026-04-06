/**
 * Audio synthesis for the sorting visualizer.
 *
 * Produces short sine-wave tones whose pitch is proportional to the bar
 * value being acted on. Lower bars play lower tones; taller bars play
 * higher ones. This gives a satisfying auditory feedback while sorting.
 *
 * Uses the Web Audio API directly — no external libraries needed.
 * A single AudioContext is lazily created and reused across tones to
 * avoid hitting the browser's AudioContext limit.
 */
import { BAR_VALUE_MAX, BAR_VALUE_MIN } from "../types/sorting";

let ctx: AudioContext | null = null;

/** Lazily create (or resume) the shared AudioContext. */
function getContext(): AudioContext {
  ctx ??= new AudioContext();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

/** Suspend the audio context — called on unmount to halt audio processing. */
export function suspendAudio(): void {
  void ctx?.suspend();
}

// Frequency range that maps to BAR_VALUE_MIN..BAR_VALUE_MAX
const FREQ_MIN = 150;
const FREQ_MAX = 800;
const TONE_DURATION = 0.08; // seconds — short blip, not a sustained note

/** Linearly map a bar value to a frequency within our audible range. */
function valueToFrequency(value: number): number {
  const t = (value - BAR_VALUE_MIN) / (BAR_VALUE_MAX - BAR_VALUE_MIN);
  return FREQ_MIN + t * (FREQ_MAX - FREQ_MIN);
}

/**
 * Play a brief sine-wave tone for the given bar value.
 * The gain ramps down exponentially so tones don't clip into each other.
 */
export function playTone(value: number): void {
  const audio = getContext();
  const frequency = valueToFrequency(value);
  const now = audio.currentTime;

  const osc = audio.createOscillator();
  const gain = audio.createGain();

  osc.connect(gain);
  gain.connect(audio.destination);

  osc.type = "sine";
  osc.frequency.setValueAtTime(frequency, now);

  // Start audible, then quickly fade to silence
  gain.gain.setValueAtTime(0.15, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + TONE_DURATION);

  osc.start(now);
  osc.stop(now + TONE_DURATION);
}
