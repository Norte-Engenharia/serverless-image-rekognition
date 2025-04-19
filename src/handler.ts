'use strict';
import { HandlerDependencies, Event } from './types';
import RekognitionService from './services/rekognitionService';
import { getImageBufferFromUrl } from './utils/getImageBufferFromUrl';

class Handler {
  private rekoSvc: RekognitionService;

  constructor({ rekoSvc }: HandlerDependencies) {
    this.rekoSvc = rekoSvc;
  }

  async main(event: Event): Promise<{ statusCode: number; body: string }> {
    try {
      const records = event.Records || [];
      if (records.length === 0) {
        throw new Error('No records found in the SQS event');
      }

      const { imageUrl } = JSON.parse(records[0].body);

      if (!imageUrl) {
        throw new Error('imageUrl is missing in the SQS message body');
      }

      const imgBuffer = await getImageBufferFromUrl(imageUrl);
      const result = await this.rekoSvc.detectImageLabels(imgBuffer);

      return {
        statusCode: 200,
        body: JSON.stringify(result),
      };
    } catch (error: any) {
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
  rekoSvc: rekognitionService,
});

export const main = handler.main.bind(handler);