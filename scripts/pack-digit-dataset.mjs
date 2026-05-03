import { inflateSync } from "node:zlib";
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const rawRoot = path.join(repoRoot, "data", "digits", "raw");
const outputFile = path.join(repoRoot, "lib", "datasets", "digits.ts");

const labels = Array.from({ length: 10 }, (_, label) => label);
const samplesPerLabel = 6;
const trainSamplesPerLabel = 5;
const expectedWidth = 28;
const expectedHeight = 28;
const pixelCount = expectedWidth * expectedHeight;

const pngSignature = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
]);

const assert = (condition, message) => {
  if (!condition) {
    throw new Error(message);
  }
};

const numericStem = (fileName) => Number.parseInt(path.parse(fileName).name, 10);

const compareNumericFileNames = (left, right) => {
  const leftNumber = numericStem(left);
  const rightNumber = numericStem(right);

  if (leftNumber !== rightNumber) {
    return leftNumber - rightNumber;
  }

  return left.localeCompare(right);
};

const paethPredictor = (left, up, upperLeft) => {
  const p = left + up - upperLeft;
  const pa = Math.abs(p - left);
  const pb = Math.abs(p - up);
  const pc = Math.abs(p - upperLeft);

  if (pa <= pb && pa <= pc) {
    return left;
  }

  if (pb <= pc) {
    return up;
  }

  return upperLeft;
};

const decodeGrayscalePng = (filePath) => {
  const png = readFileSync(filePath);

  assert(
    png.subarray(0, pngSignature.length).equals(pngSignature),
    `${filePath} is not a PNG file.`,
  );

  let offset = pngSignature.length;
  let width = 0;
  let height = 0;
  const idatChunks = [];

  while (offset < png.length) {
    const length = png.readUInt32BE(offset);
    offset += 4;
    const type = png.toString("ascii", offset, offset + 4);
    offset += 4;
    const data = png.subarray(offset, offset + length);
    offset += length;
    offset += 4;

    if (type === "IHDR") {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      const bitDepth = data.readUInt8(8);
      const colorType = data.readUInt8(9);
      const compression = data.readUInt8(10);
      const filter = data.readUInt8(11);
      const interlace = data.readUInt8(12);

      assert(width === expectedWidth, `${filePath} width must be ${expectedWidth}.`);
      assert(
        height === expectedHeight,
        `${filePath} height must be ${expectedHeight}.`,
      );
      assert(bitDepth === 8, `${filePath} must use 8-bit pixels.`);
      assert(colorType === 0, `${filePath} must be grayscale.`);
      assert(compression === 0, `${filePath} has an unsupported compression mode.`);
      assert(filter === 0, `${filePath} has an unsupported filter mode.`);
      assert(interlace === 0, `${filePath} must be non-interlaced.`);
    }

    if (type === "IDAT") {
      idatChunks.push(data);
    }

    if (type === "IEND") {
      break;
    }
  }

  assert(width === expectedWidth && height === expectedHeight, `${filePath} is invalid.`);
  assert(idatChunks.length > 0, `${filePath} has no image data.`);

  const inflated = inflateSync(Buffer.concat(idatChunks));
  const stride = width;
  const expectedInflatedLength = height * (stride + 1);

  assert(
    inflated.length === expectedInflatedLength,
    `${filePath} has unexpected scanline data length.`,
  );

  const pixels = Buffer.alloc(pixelCount);
  let readOffset = 0;

  for (let row = 0; row < height; row += 1) {
    const filterType = inflated.readUInt8(readOffset);
    readOffset += 1;

    for (let column = 0; column < width; column += 1) {
      const rawValue = inflated.readUInt8(readOffset);
      readOffset += 1;

      const index = row * width + column;
      const left = column > 0 ? pixels[index - 1] : 0;
      const up = row > 0 ? pixels[index - width] : 0;
      const upperLeft = row > 0 && column > 0 ? pixels[index - width - 1] : 0;

      if (filterType === 0) {
        pixels[index] = rawValue;
      } else if (filterType === 1) {
        pixels[index] = (rawValue + left) & 0xff;
      } else if (filterType === 2) {
        pixels[index] = (rawValue + up) & 0xff;
      } else if (filterType === 3) {
        pixels[index] = (rawValue + Math.floor((left + up) / 2)) & 0xff;
      } else if (filterType === 4) {
        pixels[index] = (rawValue + paethPredictor(left, up, upperLeft)) & 0xff;
      } else {
        throw new Error(`${filePath} uses unsupported PNG filter ${filterType}.`);
      }
    }
  }

  return pixels;
};

const toSample = (label, fileName, index) => {
  const relativeSourceFile = path.posix.join(
    "data",
    "digits",
    "raw",
    String(label),
    fileName,
  );
  const pixels = decodeGrayscalePng(path.join(repoRoot, relativeSourceFile));
  const sourceId = path.parse(fileName).name;

  return {
    id: `digit-${label}-${sourceId}`,
    label,
    pixelsBase64: pixels.toString("base64"),
    sourceFile: relativeSourceFile,
    split: index < trainSamplesPerLabel ? "train" : "test",
  };
};

const samples = labels.flatMap((label) => {
  const labelDir = path.join(rawRoot, String(label));
  const pngFiles = readdirSync(labelDir)
    .filter((fileName) => fileName.endsWith(".png"))
    .sort(compareNumericFileNames);

  assert(
    pngFiles.length >= samplesPerLabel,
    `Digit ${label} needs at least ${samplesPerLabel} PNG files.`,
  );

  return pngFiles
    .slice(0, samplesPerLabel)
    .map((fileName, index) => toSample(label, fileName, index));
});

const classRows = labels
  .map((label) => `    { label: ${label}, name: "Digit ${label}" },`)
  .join("\n");

const sampleRows = samples
  .map(
    (sample) => `    {
      id: "${sample.id}",
      label: ${sample.label},
      pixelsBase64: "${sample.pixelsBase64}",
      sourceFile: "${sample.sourceFile}",
      split: "${sample.split}",
    },`,
  )
  .join("\n");

const output = `import type { DigitDataset, DigitImageSample } from "./types";

export const DIGIT_IMAGE_WIDTH = ${expectedWidth};
export const DIGIT_IMAGE_HEIGHT = ${expectedHeight};
export const DIGIT_PIXEL_COUNT = ${pixelCount};

export const MNIST_DIGIT_DATASET = {
  classes: [
${classRows}
  ],
  defaultQueryId: "digit-8-${path.parse(
    samples.find((sample) => sample.label === 8 && sample.split === "test").sourceFile,
  ).name}",
  defaultSettings: {
    k: 5,
    metric: "euclidean",
  },
  id: "mnist-tiny-60",
  image: {
    height: DIGIT_IMAGE_HEIGHT,
    pixelCount: DIGIT_PIXEL_COUNT,
    width: DIGIT_IMAGE_WIDTH,
  },
  kind: "digit-image",
  label: "Tiny embedded digits",
  samples: [
${sampleRows}
  ],
  source:
    "Deterministically packed from data/digits/raw/{0..9}; first six numeric PNG filenames per label, with the sixth held out as a query candidate.",
  summary:
    "Sixty local 28x28 grayscale digit samples for the V0 kNN digit explorer.",
} as const satisfies DigitDataset;

export const DIGIT_TRAINING_SAMPLES = MNIST_DIGIT_DATASET.samples.filter(
  (sample) => sample.split === "train",
);

export const DIGIT_QUERY_SAMPLES = MNIST_DIGIT_DATASET.samples.filter(
  (sample) => sample.split === "test",
);

export function decodeDigitPixels(
  sample: Pick<DigitImageSample, "pixelsBase64">,
): Uint8Array {
  const binary = atob(sample.pixelsBase64);
  const pixels = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    pixels[index] = binary.charCodeAt(index);
  }

  return pixels;
}
`;

mkdirSync(path.dirname(outputFile), { recursive: true });
writeFileSync(outputFile, output);

console.log(
  `Packed ${samples.length} digit samples into ${path.relative(repoRoot, outputFile)}.`,
);
