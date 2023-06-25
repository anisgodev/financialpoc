import { ProductItemCategoryEnum } from 'app/entities/enumerations/product-item-category-enum.model';
import { StateEnum } from 'app/entities/enumerations/state-enum.model';

import { IProductItemType, NewProductItemType } from './product-item-type.model';

export const sampleWithRequiredData: IProductItemType = {
  id: 27680,
};

export const sampleWithPartialData: IProductItemType = {
  id: 56039,
  productItemCategory: ProductItemCategoryEnum['PRODUCT'],
  typeName: 'Granite SCSI Pants',
};

export const sampleWithFullData: IProductItemType = {
  id: 11596,
  productItemCategory: ProductItemCategoryEnum['SERVICE'],
  typeName: 'Cambridgeshire parsing monitor',
  stateEnum: StateEnum['RESTRICTED'],
};

export const sampleWithNewData: NewProductItemType = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
