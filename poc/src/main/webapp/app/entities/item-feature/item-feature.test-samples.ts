import { IItemFeature, NewItemFeature } from './item-feature.model';

export const sampleWithRequiredData: IItemFeature = {
  id: 79819,
};

export const sampleWithPartialData: IItemFeature = {
  id: 24029,
  featureName: 'Rustic copy',
};

export const sampleWithFullData: IItemFeature = {
  id: 60718,
  featureName: 'Uzbekistan upward-trending',
  featureLabel: 'Executive',
};

export const sampleWithNewData: NewItemFeature = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
