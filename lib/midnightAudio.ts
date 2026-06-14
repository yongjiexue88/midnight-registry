const audioBase = "/assets/midnight-registry/audio";

const soundFiles = {
  alarm: `${audioBase}/alarm.wav`,
  bell: `${audioBase}/bell.wav`,
  "cctv-freeze": `${audioBase}/cctv-freeze.wav`,
  "cctv-switch": `${audioBase}/cctv-freeze.wav`,
  "cctv-snapshot": `${audioBase}/cctv-freeze.wav`,
  "damage-reputation": `${audioBase}/damage-reputation.wav`,
  "damage-safety": `${audioBase}/damage-safety.wav`,
  "damage-sanity": `${audioBase}/damage-sanity.wav`,
  "doc-flip": `${audioBase}/cctv-freeze.wav`,
  "doc-open": `${audioBase}/cctv-freeze.wav`,
  "door-lock": `${audioBase}/knock.wav`,
  "door-unlock": `${audioBase}/bell.wav`,
  "evidence-save": `${audioBase}/stamp.wav`,
  knock: `${audioBase}/knock.wav`,
  "phone-connected": `${audioBase}/phone-connected.wav`,
  "phone-dead-air": `${audioBase}/phone-dead-air.wav`,
  "phone-dial": `${audioBase}/phone-dial.wav`,
  "phone-ring": `${audioBase}/phone-ring.wav`,
  "scanner-error": `${audioBase}/scanner-error.wav`,
  "scanner-fake-pass": `${audioBase}/scanner-pass.wav`,
  "scanner-pass": `${audioBase}/scanner-pass.wav`,
  "scanner-start": `${audioBase}/phone-dial.wav`,
  "security-alarm": `${audioBase}/alarm.wav`,
  stamp: `${audioBase}/stamp.wav`,
  "stamp-allow": `${audioBase}/stamp.wav`,
  "stamp-reject": `${audioBase}/stamp.wav`,
  "stamp-security": `${audioBase}/alarm.wav`,
  "stamp-wait": `${audioBase}/bell.wav`,
  "correct-decision": `${audioBase}/scanner-pass.wav`,
  "wrong-decision": `${audioBase}/scanner-error.wav`,
  "archive-glitch": `${audioBase}/damage-sanity.wav`,
  "bone-shift": `${audioBase}/knock.wav`,
  "containment-lock": `${audioBase}/knock.wav`,
  "flesh-twitch": `${audioBase}/damage-sanity.wav`,
  "hollow-voice": `${audioBase}/phone-dead-air.wav`,
  "no-shadow": `${audioBase}/phone-dead-air.wav`,
  "parasite-pulse": `${audioBase}/damage-sanity.wav`,
  "spray-cleanse": `${audioBase}/scanner-pass.wav`,
  "uv-light-on": `${audioBase}/scanner-pass.wav`,
  "wet-breath": `${audioBase}/phone-dead-air.wav`,
} as const;

export type MidnightSound = keyof typeof soundFiles;

export const rainAmbienceFile = `${audioBase}/rain-loop.wav`;
export const officeHumAmbienceFile = `${audioBase}/rain-loop.wav`;

export function playMidnightSound(sound: MidnightSound, enabled: boolean, volume = 0.42) {
  if (!enabled || typeof window === "undefined") return;
  const audio = new Audio(soundFiles[sound]);
  audio.volume = volume;
  void audio.play().catch(() => {
    // Browser autoplay policies may reject non-user-initiated playback.
  });
}
