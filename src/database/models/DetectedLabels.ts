import { Schema, model as Model } from 'mongoose';

const DetectedLabelsSchema = new Schema({
  photoId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'photos'
  },
  Labels: {
    type: 'array'
  },
  OrientationCorrection: {
    type: 'string'
  },
  LabelModelVersion: {
    type: 'string'
  },
  ImageProperties: {
    type: 'object'
  }

}, { timestamps: true });

DetectedLabelsSchema.index({ photoId: 1 }, { unique: true });

export default Model('detectedLabels', DetectedLabelsSchema);
