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
const prepCount = verifyDirectory("public/assets/midnight-registry/prep", 512, 512, 10);

const audioDirectory = path.join(root, "public/assets/midnight-registry/audio");
const audioFiles = fs.readdirSync(audioDirectory).filter((file) => file.endsWith(".wav")).sort();
if (audioFiles.length !== 15) {
  throw new Error(`Expected 15 WAV files, found ${audioFiles.length}`);
}
for (const file of audioFiles) {
  const buffer = fs.readFileSync(path.join(audioDirectory, file));
  if (buffer.length <= 44 || buffer.subarray(0, 4).toString("ascii") !== "RIFF") {
    throw new Error(`${file} is not a valid non-empty PCM WAV asset`);
  }
}

const designSystemPath = path.join(root, "data/midnightRegistryDesignSystem.ts");
const designSystem = fs.readFileSync(designSystemPath, "utf8");
const animationBlock = designSystem
  .split("export const registryAnimationAssets")[1]
  ?.split("export const registryProps")[0];
const animationCount = animationBlock?.match(/\{ id: \d+/g)?.length ?? 0;

if (animationCount !== 56) {
  throw new Error(`Expected 56 reusable animation events, found ${animationCount}`);
}

const gameComponent = fs.readFileSync(
  path.join(root, "components/midnight/MidnightRegistryGame.tsx"),
  "utf8",
);
const globalStyles = fs.readFileSync(path.join(root, "styles/globals.css"), "utf8");
const requiredRuntimeMarkers = [
  "registry-objective-panel",
  "registry-case-progress",
  "registry-document-modal",
  "registry-cctv-hotspot",
  "registry-tool-result",
  "registry-result-stamp",
  'recordCaseAction("tool:cctv")',
  'recordCaseAction("save:cctv")',
  'playSound("stamp"',
  "getDecisionEvidenceWarning",
  "tutorialStepsByVisitor",
  "nightExperiences",
];
const missingRuntimeMarkers = requiredRuntimeMarkers.filter(
  (marker) => !gameComponent.includes(marker) && !globalStyles.includes(marker),
);
if (missingRuntimeMarkers.length > 0) {
  throw new Error(`Missing runtime animation/interaction markers:\n${missingRuntimeMarkers.join("\n")}`);
}

console.log(
  `Verified ${characterCount} portraits (512x768), ${propCount} props (512x512), ` +
    `${cctvCount} CCTV scenes (512x512), ${prepCount} prep assets (512x512), ` +
    `${audioFiles.length} WAV effects, ${animationCount} animation events, and runtime triggers.`,
);
