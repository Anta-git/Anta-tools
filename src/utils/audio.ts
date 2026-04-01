import { BAR_VALUE_MIN, BAR_VALUE_MAX } from "../hooks/useSorting";

let ctx: AudioContext | null = null;

function getContext(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  return ctx;
}

const FREQ_MIN = 150;
const FREQ_MAX = 800;
const TONE_DURATION = 0.08; // seconds

function valueToFrequency(value: number): number {
  const t = (value - BAR_VALUE_MIN) / (BAR_VALUE_MAX - BAR_VALUE_MIN);
  return FREQ_MIN + t * (FREQ_MAX - FREQ_MIN);
}

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

  gain.gain.setValueAtTime(0.15, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + TONE_DURATION);

  osc.start(now);
  osc.stop(now + TONE_DURATION);
}
