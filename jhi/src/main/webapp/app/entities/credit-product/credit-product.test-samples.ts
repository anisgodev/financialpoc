import { ICreditProduct, NewCreditProduct } from './credit-product.model';

export const sampleWithRequiredData: ICreditProduct = {
  id: 'df8a5733-b560-4718-94c5-2700184345c3',
  name: 'payment Bedfordshire copying',
};

export const sampleWithPartialData: ICreditProduct = {
  id: 'b725d452-530b-41c3-9c1a-83535cc07da2',
  name: 'deposit',
};

export const sampleWithFullData: ICreditProduct = {
  id: '4c2f1c49-35ad-4380-9059-80eac440804c',
  name: 'value-added invoice',
};

export const sampleWithNewData: NewCreditProduct = {
  name: 'transmitter hacking',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
