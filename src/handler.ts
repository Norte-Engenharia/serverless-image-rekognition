'use strict';
import { HandlerDependencies,  Event } from './types';
import { getImageBuffer } from './utils/getImageBuffer';
import RekognitionService from './services/rekognitionService';

class Handler {
  private rekoSvc: RekognitionService;

  constructor({ rekoSvc }: HandlerDependencies) {
    this.rekoSvc = rekoSvc;
  }


  async main(event: Event): Promise<{ statusCode: number; body: string }> {
    try {
      const { imageUrl } = event.queryStringParameters;

      const imgBuffer = await getImageBuffer(imageUrl);
      const result = await this.rekoSvc.detectImageLabels(imgBuffer);

      return {
        statusCode: 200,
        body: JSON.stringify(result),
      };
    } catch (error:any) {
      console.error('ERROR->', error.stack);
      return {
        statusCode: 500,
        body: 'Internal Server Error!',
      };
    }
  }
}

const rekognitionService = new RekognitionService();

const handler = new Handler({
  rekoSvc: rekognitionService
});

export const main = handler.main.bind(handler);