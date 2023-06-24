import { IItemGroup, NewItemGroup } from './item-group.model';

export const sampleWithRequiredData: IItemGroup = {
  id: 54660,
};

export const sampleWithPartialData: IItemGroup = {
  id: 10666,
  itemGroupName: 'Greece',
};

export const sampleWithFullData: IItemGroup = {
  id: 54132,
  itemGroupName: 'up',
  itemGroupDescription: 'connect Rustic',
};

export const sampleWithNewData: NewItemGroup = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
