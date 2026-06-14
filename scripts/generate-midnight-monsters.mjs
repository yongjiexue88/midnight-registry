import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const outDir = path.join(process.cwd(), "public/assets/midnight-registry/monsters");
fs.mkdirSync(outDir, { recursive: true });

const width = 512;
const height = 768;
const stages = ["normal", "reveal_1", "reveal_2", "exposed"];
const monsters = [
  "failed_mimic",
  "parasite_bloom",
  "structure_breaker",
  "hollow_echo",
  "adaptive_collector",
  "frontdesk_replacement",
];

const crcTable = new Uint32Array(256).map((_, index) => {
  let value = index;
  for (let bit = 0; bit < 8; bit += 1) {
    value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
  }
  return value >>> 0;
});

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBuffer = Buffer.from(type);
  const output = Buffer.alloc(12 + data.length);
  output.writeUInt32BE(data.length, 0);
  typeBuffer.copy(output, 4);
  data.copy(output, 8);
  output.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])), 8 + data.length);
  return output;
}

function writePng(filePath, pixels, imageWidth = width, imageHeight = height) {
  const raw = Buffer.alloc((imageWidth * 4 + 1) * imageHeight);
  for (let y = 0; y < imageHeight; y += 1) {
    const rowStart = y * (imageWidth * 4 + 1);
    raw[rowStart] = 0;
    pixels.copy(raw, rowStart + 1, y * imageWidth * 4, (y + 1) * imageWidth * 4);
  }
  const header = Buffer.alloc(13);
  header.writeUInt32BE(imageWidth, 0);
  header.writeUInt32BE(imageHeight, 4);
  header[8] = 8;
  header[9] = 6;
  header[10] = 0;
  header[11] = 0;
  header[12] = 0;
  fs.writeFileSync(
    filePath,
    Buffer.concat([
      Buffer.from("89504e470d0a1a0a", "hex"),
      chunk("IHDR", header),
      chunk("IDAT", zlib.deflateSync(raw, { level: 9 })),
      chunk("IEND", Buffer.alloc(0)),
    ]),
  );
}

function rgba(hex, alpha = 255) {
  const normalized = hex.replace("#", "");
  return [
    parseInt(normalized.slice(0, 2), 16),
    parseInt(normalized.slice(2, 4), 16),
    parseInt(normalized.slice(4, 6), 16),
    alpha,
  ];
}

function createCanvas(imageWidth = width, imageHeight = height) {
  return Buffer.alloc(imageWidth * imageHeight * 4);
}

function blendPixel(pixels, x, y, color, imageWidth = width, imageHeight = height) {
  if (x < 0 || y < 0 || x >= imageWidth || y >= imageHeight) return;
  const offset = (Math.floor(y) * imageWidth + Math.floor(x)) * 4;
  const alpha = color[3] / 255;
  pixels[offset] = Math.round(color[0] * alpha + pixels[offset] * (1 - alpha));
  pixels[offset + 1] = Math.round(color[1] * alpha + pixels[offset + 1] * (1 - alpha));
  pixels[offset + 2] = Math.round(color[2] * alpha + pixels[offset + 2] * (1 - alpha));
  pixels[offset + 3] = Math.min(255, Math.round(color[3] + pixels[offset + 3] * (1 - alpha)));
}

function rect(pixels, x, y, w, h, color, imageWidth = width, imageHeight = height) {
  for (let yy = Math.max(0, y); yy < Math.min(imageHeight, y + h); yy += 1) {
    for (let xx = Math.max(0, x); xx < Math.min(imageWidth, x + w); xx += 1) {
      blendPixel(pixels, xx, yy, color, imageWidth, imageHeight);
    }
  }
}

function ellipse(pixels, cx, cy, rx, ry, color, imageWidth = width, imageHeight = height) {
  for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y += 1) {
    for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x += 1) {
      const dx = (x - cx) / rx;
      const dy = (y - cy) / ry;
      if (dx * dx + dy * dy <= 1) blendPixel(pixels, x, y, color, imageWidth, imageHeight);
    }
  }
}

function line(pixels, x1, y1, x2, y2, color, thickness = 4, imageWidth = width, imageHeight = height) {
  const steps = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1));
  for (let i = 0; i <= steps; i += 1) {
    const t = i / Math.max(1, steps);
    const x = x1 + (x2 - x1) * t;
    const y = y1 + (y2 - y1) * t;
    ellipse(pixels, x, y, thickness, thickness, color, imageWidth, imageHeight);
  }
}

function glow(pixels, cx, cy, radius, color) {
  for (let r = radius; r > 0; r -= 8) {
    const alpha = Math.max(10, Math.round((r / radius) * color[3] * 0.32));
    ellipse(pixels, cx, cy, r, r, [color[0], color[1], color[2], alpha]);
  }
}

function baseHuman(pixels, palette, stageIndex) {
  const coat = rgba(palette.coat, 225);
  const skin = rgba(palette.skin, 235);
  const shadow = rgba("#07090c", 170);
  ellipse(pixels, 256, 714, 132, 24, shadow);
  rect(pixels, 188, 284, 136, 332, coat);
  ellipse(pixels, 256, 276, 76, 86, coat);
  ellipse(pixels, 256, 184, 64, 72, skin);
  rect(pixels, 230, 232, 52, 58, skin);
  line(pixels, 196, 310, 148 - stageIndex * 6, 548 + stageIndex * 12, coat, 22);
  line(pixels, 316, 310, 366 + stageIndex * 6, 548 + stageIndex * 12, coat, 22);
  line(pixels, 224, 604, 206, 708, coat, 24);
  line(pixels, 288, 604, 306, 708, coat, 24);
  ellipse(pixels, 236, 182, 6, 8, rgba("#0d141a", 210));
  ellipse(pixels, 278, 182, 6, 8, rgba("#0d141a", 210));
  line(pixels, 238, 216, 278, 216, rgba("#25120f", 210), 3);
}

function drawMonster(kind, stageIndex) {
  const pixels = createCanvas();
  const palette = {
    failed_mimic: { coat: "#403544", skin: "#d0b6a4", accent: "#ff6d74" },
    parasite_bloom: { coat: "#263a35", skin: "#c4b098", accent: "#77d46c" },
    structure_breaker: { coat: "#30333c", skin: "#c8b6a2", accent: "#e0d084" },
    hollow_echo: { coat: "#202938", skin: "#bcc7d3", accent: "#72d6ff" },
    adaptive_collector: { coat: "#3b3141", skin: "#c4a99b", accent: "#edc270" },
    frontdesk_replacement: { coat: "#1d2831", skin: "#c8b6a0", accent: "#ff4d56" },
  }[kind];

  glow(pixels, 256, 420, 210, rgba(palette.accent, stageIndex === 0 ? 32 : 58));
  baseHuman(pixels, palette, stageIndex);

  const accent = rgba(palette.accent, 210);
  const dark = rgba("#050709", 225);
  if (kind === "failed_mimic") {
    line(pixels, 256, 126, 250 - stageIndex * 8, 238 + stageIndex * 24, accent, 2 + stageIndex);
    line(pixels, 216, 210, 296, 216 + stageIndex * 6, dark, 3 + stageIndex);
    if (stageIndex >= 2) ellipse(pixels, 256, 224, 52 + stageIndex * 10, 12 + stageIndex * 5, dark);
    if (stageIndex === 3) {
      ellipse(pixels, 256, 184, 38, 45, rgba("#c9c0bb", 205));
      line(pixels, 210, 380, 302, 426, accent, 5);
    }
  }

  if (kind === "parasite_bloom") {
    for (let i = 0; i < 5 + stageIndex * 3; i += 1) {
      const angle = (Math.PI * 2 * i) / (5 + stageIndex * 3);
      line(pixels, 256, 354, 256 + Math.cos(angle) * (24 + stageIndex * 18), 354 + Math.sin(angle) * (16 + stageIndex * 18), accent, 3);
    }
    ellipse(pixels, 256, 354, 22 + stageIndex * 12, 14 + stageIndex * 7, rgba("#111b12", 230));
    if (stageIndex >= 2) {
      line(pixels, 224, 250, 206, 178, accent, 3);
      line(pixels, 288, 252, 310, 178, accent, 3);
    }
  }

  if (kind === "structure_breaker") {
    line(pixels, 150, 430, 82 - stageIndex * 18, 640, rgba(palette.coat, 220), 16);
    line(pixels, 362, 430, 444 + stageIndex * 18, 640, rgba(palette.coat, 220), 16);
    if (stageIndex >= 2) {
      line(pixels, 226, 604, 170, 690, accent, 7);
      line(pixels, 288, 604, 346, 690, accent, 7);
      line(pixels, 256, 140, 310, 96, rgba(palette.skin, 215), 16);
    }
  }

  if (kind === "hollow_echo") {
    ellipse(pixels, 256, 190, 40 + stageIndex * 8, 46 + stageIndex * 8, dark);
    ellipse(pixels, 236, 180, 8, 8, rgba("#72d6ff", 170));
    ellipse(pixels, 278, 180, 8, 8, rgba("#72d6ff", 80));
    if (stageIndex >= 1) {
      line(pixels, 170, 280, 342, 280, rgba("#72d6ff", 110), 2);
      line(pixels, 168, 300, 340, 300, rgba("#72d6ff", 80), 2);
    }
    if (stageIndex === 3) rect(pixels, 222, 320, 68, 210, rgba("#050709", 180));
  }

  if (kind === "adaptive_collector") {
    rect(pixels, 188, 342, 64, 88, rgba("#643c34", 180));
    rect(pixels, 260, 440, 64, 98, rgba("#2f4a52", 190));
    line(pixels, 210, 332, 306, 506, accent, 3);
    if (stageIndex >= 2) {
      ellipse(pixels, 226, 184, 30, 38, rgba("#d0b6a4", 165));
      ellipse(pixels, 290, 184, 30, 38, rgba("#b9c5d2", 160));
      line(pixels, 188, 306, 142, 240, rgba("#111111", 200), 14);
    }
  }

  if (kind === "frontdesk_replacement") {
    rect(pixels, 210, 338, 92, 126, rgba("#d8d0bb", 130));
    for (let i = 0; i < 4 + stageIndex; i += 1) {
      line(pixels, 214, 350 + i * 20, 298, 340 + i * 22, rgba("#5a1e22", 145), 2);
    }
    rect(pixels, 230, 290, 52, 22, rgba("#edc270", 170));
    if (stageIndex >= 2) {
      line(pixels, 206, 154, 306, 232, accent, 3);
      ellipse(pixels, 256, 214, 64, 12, dark);
    }
    if (stageIndex === 3) {
      rect(pixels, 188, 392, 136, 118, rgba("#08090b", 190));
      line(pixels, 188, 452, 324, 452, accent, 5);
    }
  }

  if (stageIndex > 0) {
    for (let i = 0; i < stageIndex * 10; i += 1) {
      const x = 120 + ((i * 53) % 272);
      const y = 110 + ((i * 97) % 520);
      line(pixels, x, y, x + 18, y + 2, rgba(palette.accent, 60), 1);
    }
  }

  return pixels;
}

function paste(target, source, tx, ty, targetWidth, targetHeight, sourceWidth = width, sourceHeight = height) {
  for (let y = 0; y < sourceHeight; y += 1) {
    for (let x = 0; x < sourceWidth; x += 1) {
      const targetX = tx + x;
      const targetY = ty + y;
      if (targetX < 0 || targetY < 0 || targetX >= targetWidth || targetY >= targetHeight) continue;
      const sourceOffset = (y * sourceWidth + x) * 4;
      const color = [source[sourceOffset], source[sourceOffset + 1], source[sourceOffset + 2], source[sourceOffset + 3]];
      blendPixel(target, targetX, targetY, color, targetWidth, targetHeight);
    }
  }
}

const generated = [];
for (const monster of monsters) {
  for (let stageIndex = 0; stageIndex < stages.length; stageIndex += 1) {
    const stage = stages[stageIndex];
    const pixels = drawMonster(monster, stageIndex);
    const name = `${monster}_${stage}.png`;
    writePng(path.join(outDir, name), pixels);
    generated.push({ name, pixels });
  }
}

const sheetWidth = width * stages.length;
const sheetHeight = height * monsters.length;
const sheet = createCanvas(sheetWidth, sheetHeight);
rect(sheet, 0, 0, sheetWidth, sheetHeight, rgba("#0b1016", 255), sheetWidth, sheetHeight);
for (let row = 0; row < monsters.length; row += 1) {
  for (let column = 0; column < stages.length; column += 1) {
    const item = generated[row * stages.length + column];
    paste(sheet, item.pixels, column * width, row * height, sheetWidth, sheetHeight);
  }
}
writePng(path.join(outDir, "monster-reveal-contact-sheet.png"), sheet, sheetWidth, sheetHeight);

console.log(`Generated ${generated.length} monster reveal PNGs and contact sheet in ${outDir}.`);
