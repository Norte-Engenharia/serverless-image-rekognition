import Rekognition, { DetectLabelsResponse } from "aws-sdk/clients/rekognition";

export interface IRekognitionService {
    rekoSvc: Rekognition;
    detectImageLabels(buffer: Buffer): Promise<DetectLabelsResponse>;
}
