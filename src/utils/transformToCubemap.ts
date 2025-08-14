// utils/transformToCubemap.ts
import sharp from "sharp";

/**
 * Transforma uma imagem equiretangular (360°) em um cubemap.
 * @param imageBuffer - Buffer da imagem equiretangular (360°)
 * @param faceSize - Tamanho final do lado da face (padrão 1024px)
 * @returns Buffer da face de trás
 */
export async function transformToCubemap(
  imageBuffer: Buffer,
  faceSize = 1024
): Promise<Buffer> {
  // Lê metadados para saber largura e altura originais
  const { width, height } = await sharp(imageBuffer).metadata();
  if (!width || !height) {
    throw new Error("Não foi possível obter dimensões da imagem.");
  }

  // Cada face do cubemap ocupa 90° => 1/4 da largura total
  const faceWidth = width / 4;
  const faceHeight = height / 2;

  // A face "trás" começa no meio da imagem (180°)
  const left = faceWidth * 2; // posição horizontal da face "trás"
  const top = faceHeight / 2; // centraliza verticalmente

  // Recorta a área e redimensiona para faceSize x faceSize
  const backFaceBuffer = await sharp(imageBuffer)
    .extract({
      left: Math.round(left),
      top: Math.round(top),
      width: Math.round(faceWidth),
      height: Math.round(faceHeight),
    })
    .resize(faceSize, faceSize)
    .toBuffer();

  return backFaceBuffer;
}
