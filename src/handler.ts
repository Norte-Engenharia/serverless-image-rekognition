'use strict';
import { HandlerDependencies, Event } from './types';
import RekognitionService from './services/rekognitionService';
import { getImageBufferFromUrl } from './utils/getImageBufferFromUrl';
import mongoose from 'mongoose';
import DetectedLabels from './database/models/DetectedLabels';

export default class Handler {
  private rekoSvc: RekognitionService;

  constructor({ rekoSvc }: HandlerDependencies) {
    this.rekoSvc = rekoSvc;
  }

  private async ensureDbConnection(): Promise<void> {
    if (mongoose.connection.readyState === 0) {
      try {
        await mongoose.connect(String(process.env.MONGODB_URI));
        console.log('Connected to MongoDB');
      } catch (err) {
        console.error('Failed to connect to MongoDB', err);
        throw new Error('Database connection failed');
      }
    }
  }

  async main(event: Event): Promise<{ statusCode: number; body: string }> {
    try {
      const records = event.Records || [];
      console.log("count", records.length);
      if (records.length === 0) {
        throw new Error('No records found in the SQS event');
      }

      await this.ensureDbConnection();

      const results = await Promise.all(
        records.map(async (record) => {
          try {
            const { imageUrl, projectId, photoId } = JSON.parse(record.body);
            console.log({ imageUrl, projectId, photoId });

            const existingLabels = await DetectedLabels.findOne({ photoId });
            if (existingLabels) {
              console.log(`Labels already detected for photoId: ${photoId}`);
              return { success: true, result: existingLabels };
            }

            if (!imageUrl) {
              throw new Error('imageUrl is missing in the SQS message body');
            }

            const imgBuffer = await getImageBufferFromUrl(imageUrl);
            const result = await this.rekoSvc.detectImageLabels(imgBuffer);

            const detectedLabels = new DetectedLabels({
              photoId,
              Labels: result.Labels,
              OrientationCorrection: result.OrientationCorrection,
              LabelModelVersion: result.LabelModelVersion,
              ImageProperties: result.ImageProperties,
            });
            await detectedLabels.save();

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