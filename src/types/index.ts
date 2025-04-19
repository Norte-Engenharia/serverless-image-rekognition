import { AWSError, Request } from "aws-sdk";
import { TranslateTextRequest, TranslateTextResponse } from "aws-sdk/clients/translate";
import RekognitionService from "../services/rekognitionService";

export  interface TranslatorService {
    translateText(params: TranslateTextRequest): Request<TranslateTextResponse, AWSError>;
  }
  
export  interface HandlerDependencies {
    rekoSvc: RekognitionService;
  }
  
export interface Event {
    Records: {
      body: string;
    }[];
    // queryStringParameters: {
    //   imageUrl: string;
    // };
}