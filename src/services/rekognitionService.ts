import { Rekognition } from "aws-sdk";
import { DetectLabelsResponse } from "aws-sdk/clients/rekognition";
import { IRekognitionService } from "./types/rekognitionService";
import { readFile } from "fs/promises";
import { join } from "path";

export default class RekognitionService implements IRekognitionService{
    rekoSvc: Rekognition;

    constructor() {
        this.rekoSvc = new Rekognition(process.env.IS_LOCAL ? {
          region:'us-east-1'
        }: undefined);
    }
  
    async detectImageLabels(buffer: Buffer): Promise<DetectLabelsResponse> {      
      const result = process.env.IS_LOCAL === "true" 
        ? JSON.parse(await readFile(join(__dirname, '..', "fakeResponse.json"), 'utf-8')) as DetectLabelsResponse
        : await this.rekoSvc
          .detectLabels({
            Image: {
              Bytes: buffer,
            },
          })
          .promise();

      return result;
    }
}