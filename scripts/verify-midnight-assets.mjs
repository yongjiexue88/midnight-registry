import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

function pngDimensions(filePath) {
  const buffer = fs.readFileSync(filePath);
  const signature = buffer.subarray(0, 8).toString("hex");
  if (signature !== "89504e470d0a1a0a") {
    throw new Error(`${filePath} is not a PNG file`);
  }
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

function verifyDirectory(relativeDirectory, expectedWidth, expectedHeight, expectedCount) {
  const directory = path.join(root, relativeDirectory);
  const files = fs.readdirSync(directory).filter((file) => file.endsWith(".png")).sort();
  if (files.length !== expectedCount) {
    throw new Error(
      `${relativeDirectory} must contain ${expectedCount} PNG assets, found ${files.length}`,
    );
  }

  const failures = [];
  for (const file of files) {
    const dimensions = pngDimensions(path.join(directory, file));
    if (dimensions.width !== expectedWidth || dimensions.height !== expectedHeight) {
      failures.push(`${file}: ${dimensions.width}x${dimensions.height}`);
    }
  }

  if (failures.length > 0) {
    throw new Error(
      `${relativeDirectory} must use ${expectedWidth}x${expectedHeight} canvases:\n${failures.join("\n")}`,
    );
  }

  return files.length;
}

const characterCount = verifyDirectory(
  "public/assets/midnight-registry/characters",
  512,
  768,
  16,
);
const propCount = verifyDirectory("public/assets/midnight-registry/props", 512, 512, 39);
const cctvCount = verifyDirectory("public/assets/midnight-registry/cctv", 512, 512, 8);

const designSystemPath = path.join(root, "data/midnightRegistryDesignSystem.ts");
const designSystem = fs.readFileSync(designSystemPath, "utf8");
const animationBlock = designSystem
  .split("export const registryAnimationAssets")[1]
  ?.split("export const registryProps")[0];
const animationCount = animationBlock?.match(/\{ id: \d+/g)?.length ?? 0;

if (animationCount !== 56) {
  throw new Error(`Expected 56 reusable animation events, found ${animationCount}`);
}

console.log(
  `Verified ${characterCount} portraits (512x768), ${propCount} props (512x512), ` +
    `${cctvCount} CCTV scenes (512x512), and ${animationCount} animation events.`,
);
