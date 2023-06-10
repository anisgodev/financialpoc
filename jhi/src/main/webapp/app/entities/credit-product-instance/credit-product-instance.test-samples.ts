import { ICreditProductInstance, NewCreditProductInstance } from './credit-product-instance.model';

export const sampleWithRequiredData: ICreditProductInstance = {
  id: 'b9ea9caa-23d0-4a87-9e25-0c40a878d9cd',
  name: 'Towels copy',
};

export const sampleWithPartialData: ICreditProductInstance = {
  id: 'd325b38d-cf06-4eed-a3ca-c16916cbfc34',
  name: 'Buckinghamshire bleeding-edge circuit',
};

export const sampleWithFullData: ICreditProductInstance = {
  id: 'e099f79c-7e57-409e-98e2-e201dbbceedd',
  name: 'architectures open-source',
};

export const sampleWithNewData: NewCreditProductInstance = {
  name: 'Handcrafted',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
