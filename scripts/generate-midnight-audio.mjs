import fs from "node:fs";
import path from "node:path";

const sampleRate = 22050;
const outDir = path.join(process.cwd(), "public/assets/midnight-registry/audio");
fs.mkdirSync(outDir, { recursive: true });

function clampSample(value) {
  return Math.max(-1, Math.min(1, value));
}

function sine(frequency, time, phase = 0) {
  return Math.sin(Math.PI * 2 * frequency * time + phase);
}

function noise(index, seed = 1) {
  const value = Math.sin((index + 1) * (12.9898 + seed * 0.731)) * 43758.5453;
  return (value - Math.floor(value)) * 2 - 1;
}

function envelope(time, duration, attack = 0.01, release = 0.12) {
  const inGain = Math.min(1, time / Math.max(attack, 0.001));
  const outGain = Math.min(1, (duration - time) / Math.max(release, 0.001));
  return Math.max(0, Math.min(inGain, outGain));
}

function render(duration, generator) {
  const count = Math.ceil(duration * sampleRate);
  const samples = new Float32Array(count);
  for (let index = 0; index < count; index += 1) {
    samples[index] = clampSample(generator(index / sampleRate, index, duration));
  }
  return samples;
}

function mix(...tracks) {
  const count = Math.max(...tracks.map((track) => track.length));
  const output = new Float32Array(count);
  for (const track of tracks) {
    for (let index = 0; index < track.length; index += 1) {
      output[index] += track[index] / tracks.length;
    }
  }
  return output;
}

function writeWav(name, samples) {
  const dataSize = samples.length * 2;
  const buffer = Buffer.alloc(44 + dataSize);
  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);
  for (let index = 0; index < samples.length; index += 1) {
    buffer.writeInt16LE(Math.round(clampSample(samples[index]) * 32767), 44 + index * 2);
  }
  fs.writeFileSync(path.join(outDir, name), buffer);
}

const bell = mix(
  render(1.2, (time, _index, duration) => sine(880, time) * Math.exp(-4.2 * time) * envelope(time, duration)),
  render(1.2, (time) => sine(1320, time) * 0.55 * Math.exp(-5 * time)),
);
const knock = render(0.7, (time, index) => {
  const strikes = [0.04, 0.25, 0.47];
  return strikes.reduce((sum, start) => {
    const local = time - start;
    if (local < 0 || local > 0.08) return sum;
    return sum + noise(index, 4) * Math.exp(-42 * local) * 0.9;
  }, 0);
});
const phoneRing = render(1.35, (time, _index, duration) => {
  const active = (time < 0.42 || (time > 0.62 && time < 1.04)) ? 1 : 0;
  return active * (sine(440, time) + sine(480, time)) * 0.32 * envelope(time, duration, 0.02, 0.08);
});
const phoneDial = render(0.8, (time, _index, duration) => (
  (sine(350, time) + sine(440, time)) * 0.22 * envelope(time, duration, 0.02, 0.08)
));
const phoneConnected = render(0.45, (time, _index, duration) => (
  (sine(660, time) * 0.45 + sine(990, time) * 0.2) * envelope(time, duration, 0.01, 0.18)
));
const phoneDeadAir = render(1.5, (time, index, duration) => (
  (noise(index, 9) * 0.16 + sine(54, time) * 0.16) * envelope(time, duration, 0.08, 0.2)
));
const scannerPass = render(0.55, (time, _index, duration) => {
  const frequency = 420 + time * 900;
  return sine(frequency, time) * 0.36 * envelope(time, duration, 0.01, 0.15);
});
const scannerError = render(0.65, (time, _index, duration) => {
  const gate = Math.floor(time * 18) % 2 === 0 ? 1 : 0.2;
  return sine(150, time) * gate * 0.52 * envelope(time, duration, 0.01, 0.1);
});
const cctvFreeze = render(0.45, (time, index, duration) => (
  (noise(index, 7) * Math.exp(-8 * time) + sine(80, time) * 0.2) * envelope(time, duration, 0.005, 0.08)
));
const stamp = render(0.42, (time, index) => {
  const impact = noise(index, 11) * Math.exp(-55 * time);
  const desk = sine(92, time) * Math.exp(-12 * time);
  return impact * 0.9 + desk * 0.38;
});
const alarm = render(1.25, (time, _index, duration) => (
  sine(720 + Math.sin(time * 8) * 70, time) * 0.42 * envelope(time, duration, 0.02, 0.08)
));
const damageSafety = render(0.9, (time, _index, duration) => (
  (sine(68, time) + sine(92, time) * 0.5) * 0.45 * envelope(time, duration, 0.01, 0.2)
));
const damageReputation = render(0.85, (time, _index, duration) => {
  const gate = time < 0.25 || (time > 0.38 && time < 0.62) ? 1 : 0;
  return sine(520, time) * gate * 0.34 * envelope(time, duration, 0.01, 0.08);
});
const damageSanity = render(1.05, (time, index, duration) => (
  (noise(index, 19) * 0.2 + sine(44 + time * 18, time) * 0.28) * envelope(time, duration, 0.04, 0.2)
));
const rainLoop = render(6, (time, index, duration) => {
  const hiss = noise(index, 23) * 0.2;
  const drops = Math.max(0, sine(7.3, time + noise(index, 3) * 0.02)) ** 12 * 0.18;
  return (hiss + drops) * envelope(time, duration, 0.25, 0.25);
});

for (const [name, samples] of Object.entries({
  "alarm.wav": alarm,
  "bell.wav": bell,
  "cctv-freeze.wav": cctvFreeze,
  "damage-reputation.wav": damageReputation,
  "damage-safety.wav": damageSafety,
  "damage-sanity.wav": damageSanity,
  "knock.wav": knock,
  "phone-connected.wav": phoneConnected,
  "phone-dead-air.wav": phoneDeadAir,
  "phone-dial.wav": phoneDial,
  "phone-ring.wav": phoneRing,
  "rain-loop.wav": rainLoop,
  "scanner-error.wav": scannerError,
  "scanner-pass.wav": scannerPass,
  "stamp.wav": stamp,
})) {
  writeWav(name, samples);
}

console.log(`Generated ${Object.keys(fs.readdirSync(outDir)).length} Midnight Registry audio files in ${outDir}.`);
