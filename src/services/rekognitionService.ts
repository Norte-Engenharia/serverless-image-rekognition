import { Rekognition } from "aws-sdk";
import { DetectLabelsResponse } from "aws-sdk/clients/rekognition";
import { IRekognitionService } from "./types/rekognitionService";

export default class RekognitionService implements IRekognitionService{
    rekoSvc: Rekognition;

    constructor() {
        this.rekoSvc = new Rekognition();
    }
  
    async detectImageLabels(buffer: Buffer): Promise<DetectLabelsResponse> {
      const result = await this.rekoSvc
        .detectLabels({
          Image: {
            Bytes: buffer,
          },
        })
        .promise();
  
      return result;
    }
}