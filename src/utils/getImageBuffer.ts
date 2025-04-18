import axios from "axios";

export async function getImageBuffer(imageUrl: string): Promise<Buffer> {
    console.log('Downloading image...');
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
    });

    console.log('Buffering image...');
    const buffer = Buffer.from(response.data, 'base64');
    return buffer;
}