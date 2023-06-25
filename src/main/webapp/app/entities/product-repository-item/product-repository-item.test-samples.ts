import { ProductItemCategoryEnum } from 'app/entities/enumerations/product-item-category-enum.model';
import { ProductItemStateEnum } from 'app/entities/enumerations/product-item-state-enum.model';

import { IProductRepositoryItem, NewProductRepositoryItem } from './product-repository-item.model';

export const sampleWithRequiredData: IProductRepositoryItem = {
  id: 21783,
};

export const sampleWithPartialData: IProductRepositoryItem = {
  id: 63867,
  name: 'artificial analyzer synthesize',
  productItemCategoryEnum: ProductItemCategoryEnum['SERVICE'],
  itemStage: ProductItemStateEnum['INACTIVE'],
};

export const sampleWithFullData: IProductRepositoryItem = {
  id: 25921,
  name: 'Officer Card withdrawal',
  description: 'Soap Yemen',
  productItemCategoryEnum: ProductItemCategoryEnum['SERVICE'],
  itemStage: ProductItemStateEnum['EXPIRED'],
};

export const sampleWithNewData: NewProductRepositoryItem = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
