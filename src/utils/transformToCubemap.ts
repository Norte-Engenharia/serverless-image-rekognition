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

export async function transformToCubemap(imageBuffer: Buffer, faceSize = 1024): Promise<Buffer> {
  const { data, info } = await sharp(imageBuffer)
    .raw()
    .ensureAlpha()
    .toBuffer({ resolveWithObject: true });

  const readWidth = info.width;
  const readHeight = info.height;
  const readData = new Uint8ClampedArray(data);

  const writeData = new Uint8ClampedArray(faceSize * faceSize * 4);
  const orientation = orientations["pz"]; 
  const cube: any = {};

  for (let x = 0; x < faceSize; x++) {
    for (let y = 0; y < faceSize; y++) {
      const to = 4 * (y * faceSize + x);
      writeData[to + 3] = 255; 

      orientation(
        cube,
        (2 * (x + 0.5) / faceSize - 1),
        (2 * (y + 0.5) / faceSize - 1)
      );

      const r = Math.sqrt(cube.x * cube.x + cube.y * cube.y + cube.z * cube.z);
      const lon = mod(Math.atan2(cube.y, cube.x), 2 * Math.PI);
      const lat = Math.acos(cube.z / r);

      const srcX = readWidth * lon / (Math.PI * 2);
      const srcY = readHeight * lat / Math.PI;

      const nearestX = Math.max(0, Math.min(readWidth - 1, Math.round(srcX)));
      const nearestY = Math.max(0, Math.min(readHeight - 1, Math.round(srcY)));

      const srcIndex = 4 * (nearestY * readWidth + nearestX);

      writeData[to]     = readData[srcIndex];
      writeData[to + 1] = readData[srcIndex + 1];
      writeData[to + 2] = readData[srcIndex + 2];
    }
  }

  return sharp(Buffer.from(writeData), {
    raw: { width: faceSize, height: faceSize, channels: 4 }
  }).jpeg().toBuffer();
}
