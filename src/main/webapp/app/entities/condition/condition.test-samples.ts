import { ICondition, NewCondition } from './condition.model';

export const sampleWithRequiredData: ICondition = {
  id: 6098,
};

export const sampleWithPartialData: ICondition = {
  id: 16057,
};

export const sampleWithFullData: ICondition = {
  id: 22170,
  operator: 'hard copying',
};

export const sampleWithNewData: NewCondition = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
