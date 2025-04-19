import axios from "axios";

export async function getImageBufferFromUrl(imageUrl: string): Promise<Buffer> {
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
    });

    const buffer = Buffer.from(response.data, 'base64');
    return buffer;
}