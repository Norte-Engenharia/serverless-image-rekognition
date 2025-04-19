'use strict';
import Handler from './handler';
import RekognitionService from './services/rekognitionService';


const rekognitionService = new RekognitionService();

const handler = new Handler({
  rekoSvc: rekognitionService,
});

export const main = handler.main.bind(handler);