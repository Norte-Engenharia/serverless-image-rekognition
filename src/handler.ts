'use strict';
import { HandlerDependencies, Event } from './types';
import RekognitionService from './services/rekognitionService';

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

      const results = await Promise.all(
        records.map(async (record) => {
          try {
            const { imageBase64 } = JSON.parse(record.body);

            if (!imageBase64) {
              throw new Error('imageBase64 is missing in the SQS message body');
            }

            const imgBuffer = Buffer.from(imageBase64, 'base64');
            const result = await this.rekoSvc.detectImageLabels(imgBuffer);

            return { success: true, result };
          } catch (error: any) {
            console.error('Error processing record:', error.stack);
            return { success: false, error: error.message };
          }
        })
      );

      return {
        statusCode: 200,
        body: JSON.stringify(results),
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