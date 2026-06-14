export type MidnightSound =
  | "alarm"
  | "bell"
  | "cctv-freeze"
  | "damage-reputation"
  | "damage-safety"
  | "damage-sanity"
  | "knock"
  | "phone-connected"
  | "phone-dead-air"
  | "phone-dial"
  | "phone-ring"
  | "scanner-error"
  | "scanner-pass"
  | "stamp";

const soundFiles: Record<MidnightSound, string> = {
  alarm: "/assets/midnight-registry/audio/alarm.wav",
  bell: "/assets/midnight-registry/audio/bell.wav",
  "cctv-freeze": "/assets/midnight-registry/audio/cctv-freeze.wav",
  "damage-reputation": "/assets/midnight-registry/audio/damage-reputation.wav",
  "damage-safety": "/assets/midnight-registry/audio/damage-safety.wav",
  "damage-sanity": "/assets/midnight-registry/audio/damage-sanity.wav",
  knock: "/assets/midnight-registry/audio/knock.wav",
  "phone-connected": "/assets/midnight-registry/audio/phone-connected.wav",
  "phone-dead-air": "/assets/midnight-registry/audio/phone-dead-air.wav",
  "phone-dial": "/assets/midnight-registry/audio/phone-dial.wav",
  "phone-ring": "/assets/midnight-registry/audio/phone-ring.wav",
  "scanner-error": "/assets/midnight-registry/audio/scanner-error.wav",
  "scanner-pass": "/assets/midnight-registry/audio/scanner-pass.wav",
  stamp: "/assets/midnight-registry/audio/stamp.wav",
};

export const rainAmbienceFile = "/assets/midnight-registry/audio/rain-loop.wav";

export function playMidnightSound(sound: MidnightSound, enabled: boolean, volume = 0.42) {
  if (!enabled || typeof window === "undefined") return;
  const audio = new Audio(soundFiles[sound]);
  audio.volume = volume;
  void audio.play().catch(() => {
    // Browser autoplay policies may reject non-user-initiated playback.
  });
}
