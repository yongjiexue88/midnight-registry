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

function tone(duration, frequency, gain = 0.36, attack = 0.01, release = 0.12) {
  return render(duration, (time, _index, total) => sine(frequency, time) * gain * envelope(time, total, attack, release));
}

function hit(duration, seed, low = 92, gain = 0.8) {
  return render(duration, (time, index) => {
    const impact = noise(index, seed) * Math.exp(-55 * time);
    const body = sine(low, time) * Math.exp(-12 * time);
    return impact * gain + body * 0.38;
  });
}

function gatedTone(duration, frequency, gateRate, gain = 0.38) {
  return render(duration, (time, _index, total) => {
    const gate = Math.floor(time * gateRate) % 2 === 0 ? 1 : 0.18;
    return sine(frequency, time) * gate * gain * envelope(time, total, 0.01, 0.1);
  });
}

function hiss(duration, seed, gain = 0.16, low = 54) {
  return render(duration, (time, index, total) => (
    (noise(index, seed) * gain + sine(low, time) * gain * 0.8) * envelope(time, total, 0.08, 0.2)
  ));
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

const rainLoop = render(6, (time, index, duration) => {
  const hissLayer = noise(index, 23) * 0.2;
  const drops = Math.max(0, sine(7.3, time + noise(index, 3) * 0.02)) ** 12 * 0.18;
  return (hissLayer + drops) * envelope(time, duration, 0.25, 0.25);
});
const officeHum = mix(
  tone(6, 58, 0.18, 0.25, 0.25),
  render(6, (time, index, total) => (noise(index, 31) * 0.06 + sine(120, time) * 0.05) * envelope(time, total, 0.25, 0.25)),
);
const bell = mix(tone(1.2, 880, 0.48), tone(1.2, 1320, 0.24, 0.01, 0.2));
const uiClick = hit(0.12, 2, 240, 0.42);
const docOpen = mix(hit(0.32, 12, 180, 0.35), hiss(0.32, 13, 0.08, 95));
const docFlip = render(0.38, (time, index, total) => (noise(index, 14) * (1 - time / total) * 0.24) * envelope(time, total, 0.01, 0.08));
const evidenceSave = mix(hit(0.28, 15, 260, 0.48), tone(0.28, 740, 0.12));
const phonePickup = mix(hit(0.34, 16, 160, 0.36), tone(0.34, 420, 0.12));
const phoneRing = render(1.35, (time, _index, duration) => {
  const active = time < 0.42 || (time > 0.62 && time < 1.04) ? 1 : 0;
  return active * (sine(440, time) + sine(480, time)) * 0.32 * envelope(time, duration, 0.02, 0.08);
});
const phoneDial = mix(tone(0.8, 350, 0.22), tone(0.8, 440, 0.18));
const phoneConnect = mix(tone(0.45, 660, 0.45, 0.01, 0.18), tone(0.45, 990, 0.2, 0.01, 0.18));
const phoneDead = hiss(1.5, 9, 0.16, 54);
const phoneDuplicateVoice = mix(hiss(1.2, 44, 0.12, 62), gatedTone(1.2, 310, 9, 0.18), tone(1.2, 155, 0.12, 0.03, 0.18));
const scannerStart = mix(tone(0.48, 240, 0.2), render(0.48, (time, _index, total) => sine(420 + time * 500, time) * 0.22 * envelope(time, total, 0.01, 0.12)));
const scannerPass = render(0.55, (time, _index, duration) => sine(420 + time * 900, time) * 0.36 * envelope(time, duration, 0.01, 0.15));
const scannerFail = gatedTone(0.65, 150, 18, 0.52);
const scannerFakePass = mix(scannerPass, render(0.55, (time, _index, duration) => sine(820 - time * 520, time) * 0.08 * envelope(time, duration, 0.05, 0.1)));
const cctvSwitch = mix(hit(0.2, 7, 110, 0.42), hiss(0.28, 8, 0.2, 80));
const cctvFreeze = mix(hiss(0.45, 7, 0.22, 80), hit(0.22, 17, 70, 0.28));
const cctvSnapshot = mix(hit(0.28, 18, 210, 0.34), tone(0.28, 620, 0.1));
const cctvGlitch = mix(gatedTone(0.6, 90, 24, 0.32), hiss(0.6, 45, 0.18, 48));
const stampAllow = mix(hit(0.42, 11, 92, 0.9), tone(0.42, 520, 0.08));
const stampReject = mix(hit(0.48, 21, 70, 0.92), tone(0.48, 190, 0.14));
const stampSecurity = mix(hit(0.5, 22, 58, 0.96), gatedTone(0.5, 620, 10, 0.18));
const stampWait = mix(hit(0.36, 23, 120, 0.55), tone(0.72, 260, 0.12));
const doorUnlock = mix(hit(0.42, 24, 150, 0.42), tone(0.42, 360, 0.12));
const doorLock = mix(hit(0.48, 25, 80, 0.58), tone(0.48, 190, 0.12));
const securityAlarm = render(1.25, (time, _index, duration) => sine(720 + Math.sin(time * 8) * 70, time) * 0.42 * envelope(time, duration, 0.02, 0.08));
const wrongDecision = mix(gatedTone(0.8, 96, 12, 0.38), hiss(0.8, 26, 0.12, 41));
const correctDecision = mix(tone(0.55, 520, 0.18), tone(0.55, 780, 0.11));
const visitorKnockNormal = render(0.7, (time, index) => [0.04, 0.25, 0.47].reduce((sum, start) => {
  const local = time - start;
  return local < 0 || local > 0.08 ? sum : sum + noise(index, 4) * Math.exp(-42 * local) * 0.9;
}, 0));
const visitorKnockWrong = render(0.85, (time, index) => [0.04, 0.18, 0.51].reduce((sum, start) => {
  const local = time - start;
  return local < 0 || local > 0.12 ? sum : sum + noise(index, 34) * Math.exp(-28 * local) * 0.82;
}, 0));
const visitorBreath = mix(hiss(1.2, 35, 0.08, 48), tone(1.2, 74, 0.08, 0.1, 0.18));
const visitorLeave = mix(hit(0.4, 36, 130, 0.26), render(0.9, (time, index, total) => noise(index, 37) * 0.08 * (1 - time / total) * envelope(time, total, 0.02, 0.18)));
const paperInkMove = mix(hiss(0.75, 38, 0.12, 82), tone(0.75, 112, 0.1));
const archiveGlitch = mix(gatedTone(0.82, 130, 16, 0.28), hiss(0.82, 39, 0.14, 45));
const mirrorGlitch = mix(gatedTone(0.72, 250, 19, 0.18), tone(0.72, 96, 0.2));
const duplicateWhisper = mix(hiss(1.0, 40, 0.13, 66), tone(1.0, 132, 0.08));
const noShadow = mix(tone(0.7, 52, 0.24), hiss(0.7, 41, 0.1, 39));
const damageSafety = mix(tone(0.9, 68, 0.45), tone(0.9, 92, 0.22));
const damageReputation = gatedTone(0.85, 520, 7, 0.34);
const damageSanity = mix(hiss(1.05, 19, 0.2, 44), render(1.05, (time, _index, total) => sine(44 + time * 18, time) * 0.28 * envelope(time, total, 0.04, 0.2)));
const fleshTwitch = mix(hit(0.32, 51, 64, 0.38), gatedTone(0.32, 180, 20, 0.18));
const skinCrack = mix(hit(0.48, 52, 110, 0.45), hiss(0.48, 53, 0.16, 92));
const boneShift = mix(hit(0.62, 54, 58, 0.5), gatedTone(0.62, 96, 11, 0.18));
const wetBreath = mix(visitorBreath, hiss(1.0, 55, 0.16, 43));
const hollowVoice = mix(phoneDuplicateVoice, noShadow);
const parasitePulse = mix(tone(0.9, 48, 0.24, 0.05, 0.2), gatedTone(0.9, 86, 5, 0.18));
const glassTouch = mix(hit(0.22, 56, 320, 0.18), tone(0.22, 920, 0.08));
const glassImpactSoft = mix(hit(0.36, 57, 180, 0.5), tone(0.36, 260, 0.1));
const containmentLock = mix(doorLock, tone(0.7, 72, 0.2));
const uvLightOn = mix(tone(0.55, 1180, 0.16), hiss(0.55, 58, 0.06, 260));
const sprayCleanse = mix(hiss(0.85, 59, 0.22, 180), tone(0.85, 340, 0.08));

const soundDesign = {
  "rain_loop.wav": rainLoop,
  "rain-loop.wav": rainLoop,
  "office_hum_loop.wav": officeHum,
  "shift_bell.wav": bell,
  "bell.wav": bell,
  "ui_click.wav": uiClick,
  "doc_open.wav": docOpen,
  "doc_flip.wav": docFlip,
  "evidence_save.wav": evidenceSave,
  "phone_pickup.wav": phonePickup,
  "phone_dial.wav": phoneDial,
  "phone_ring.wav": phoneRing,
  "phone_connect.wav": phoneConnect,
  "phone_dead.wav": phoneDead,
  "phone_duplicate_voice.wav": phoneDuplicateVoice,
  "phone-dial.wav": phoneDial,
  "phone-ring.wav": phoneRing,
  "phone-connected.wav": phoneConnect,
  "phone-dead-air.wav": phoneDead,
  "scanner_start.wav": scannerStart,
  "scanner_pass.wav": scannerPass,
  "scanner_fail.wav": scannerFail,
  "scanner_fake_pass.wav": scannerFakePass,
  "scanner-pass.wav": scannerPass,
  "scanner-error.wav": scannerFail,
  "cctv_switch.wav": cctvSwitch,
  "cctv_freeze.wav": cctvFreeze,
  "cctv_snapshot.wav": cctvSnapshot,
  "cctv_glitch.wav": cctvGlitch,
  "cctv-freeze.wav": cctvFreeze,
  "stamp_allow.wav": stampAllow,
  "stamp_reject.wav": stampReject,
  "stamp_security.wav": stampSecurity,
  "stamp_wait.wav": stampWait,
  "stamp.wav": stampAllow,
  "door_unlock.wav": doorUnlock,
  "door_lock.wav": doorLock,
  "security_alarm.wav": securityAlarm,
  "alarm.wav": securityAlarm,
  "wrong_decision.wav": wrongDecision,
  "correct_decision.wav": correctDecision,
  "visitor_knock_normal.wav": visitorKnockNormal,
  "visitor_knock_wrong.wav": visitorKnockWrong,
  "visitor_breath.wav": visitorBreath,
  "visitor_leave.wav": visitorLeave,
  "knock.wav": visitorKnockNormal,
  "paper_ink_move.wav": paperInkMove,
  "archive_glitch.wav": archiveGlitch,
  "mirror_glitch.wav": mirrorGlitch,
  "duplicate_whisper.wav": duplicateWhisper,
  "no_shadow.wav": noShadow,
  "safety_damage.wav": damageSafety,
  "reputation_damage.wav": damageReputation,
  "sanity_damage.wav": damageSanity,
  "damage-safety.wav": damageSafety,
  "damage-reputation.wav": damageReputation,
  "damage-sanity.wav": damageSanity,
  "flesh_twitch.wav": fleshTwitch,
  "skin_crack.wav": skinCrack,
  "bone_shift.wav": boneShift,
  "wet_breath.wav": wetBreath,
  "hollow_voice.wav": hollowVoice,
  "parasite_pulse.wav": parasitePulse,
  "glass_touch.wav": glassTouch,
  "glass_impact_soft.wav": glassImpactSoft,
  "containment_lock.wav": containmentLock,
  "uv_light_on.wav": uvLightOn,
  "spray_cleanse.wav": sprayCleanse,
};

for (const [name, samples] of Object.entries(soundDesign)) {
  writeWav(name, samples);
}

console.log(`Generated ${Object.keys(soundDesign).length} Midnight Registry audio files in ${outDir}.`);
