import sharp from "sharp";

function mod(x: number, n: number) {
  return ((x % n) + n) % n;
}

const orientations: Record<string, (out: any, x: number, y: number) => void> = {
  pz: (out, x, y) => { out.x = -1; out.y = -x; out.z = -y; },
  nz: (out, x, y) => { out.x =  1; out.y =  x; out.z = -y; },
  px: (out, x, y) => { out.x =  x; out.y = -1; out.z = -y; },
  nx: (out, x, y) => { out.x = -x; out.y =  1; out.z = -y; },
  py: (out, x, y) => { out.x = -y; out.y = -x; out.z =  1; },
  ny: (out, x, y) => { out.x =  y; out.y = -x; out.z = -1; },
};

let coordMapCache: { xMap: Int32Array; yMap: Int32Array; size: number } | null = null;

function generateCoordMap(faceSize: number, width: number, height: number) {
  const orientation = orientations["pz"];
  const xMap = new Int32Array(faceSize * faceSize);
  const yMap = new Int32Array(faceSize * faceSize);
  const cube: any = {};

  for (let y = 0; y < faceSize; y++) {
    for (let x = 0; x < faceSize; x++) {
      orientation(
        cube,
        (2 * (x + 0.5) / faceSize - 1),
        (2 * (y + 0.5) / faceSize - 1)
      );

      const r = Math.sqrt(cube.x * cube.x + cube.y * cube.y + cube.z * cube.z);
      const lon = mod(Math.atan2(cube.y, cube.x), 2 * Math.PI);
      const lat = Math.acos(cube.z / r);

      const srcX = Math.round(width * lon / (Math.PI * 2));
      const srcY = Math.round(height * lat / Math.PI);

      xMap[y * faceSize + x] = Math.max(0, Math.min(width - 1, srcX));
      yMap[y * faceSize + x] = Math.max(0, Math.min(height - 1, srcY));
    }
  }

  return { xMap, yMap, size: faceSize };
}

export async function transformToCubemap(imageBuffer: Buffer, faceSize = 512): Promise<Buffer> {
  const { data, info } = await sharp(imageBuffer)
    .raw()
    .ensureAlpha()
    .toBuffer({ resolveWithObject: true });

  const readWidth = info.width!;
  const readHeight = info.height!;
  const readData = new Uint8ClampedArray(data);

  if (!coordMapCache || coordMapCache.size !== faceSize) {
    coordMapCache = generateCoordMap(faceSize, readWidth, readHeight);
  }

  const { xMap, yMap } = coordMapCache;

  const writeData = Buffer.allocUnsafe(faceSize * faceSize * 4);

  for (let i = 0; i < faceSize * faceSize; i++) {
    const srcIndex = 4 * (yMap[i] * readWidth + xMap[i]);
    const dstIndex = 4 * i;

    writeData[dstIndex]     = readData[srcIndex];
    writeData[dstIndex + 1] = readData[srcIndex + 1];
    writeData[dstIndex + 2] = readData[srcIndex + 2];
    writeData[dstIndex + 3] = 255;
  }

  return sharp(writeData, {
    raw: { width: faceSize, height: faceSize, channels: 4 }
  }).jpeg().toBuffer();
}

export async function transformImagesBatch(
  imageBuffers: Buffer[],
  faceSize = 512,
  maxParallel = 3
): Promise<Buffer[]> {
  const results: Buffer[] = [];
  let index = 0;

  async function worker() {
    while (index < imageBuffers.length) {
      const i = index++;
      results[i] = await transformToCubemap(imageBuffers[i], faceSize);
    }
  }

  const workers = Array(Math.min(maxParallel, imageBuffers.length))
    .fill(0)
    .map(() => worker());

  await Promise.all(workers);
  return results;
}
