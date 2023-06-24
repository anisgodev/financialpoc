import { IProductItemType } from 'app/entities/product-item-type/product-item-type.model';
import { ProductItemCategoryEnum } from 'app/entities/enumerations/product-item-category-enum.model';
import { ProductItemStateEnum } from 'app/entities/enumerations/product-item-state-enum.model';

export interface IProductRepositoryItem {
  id: number;
  name?: string | null;
  description?: string | null;
  productItemCategoryEnum?: ProductItemCategoryEnum | null;
  itemStage?: ProductItemStateEnum | null;
  productItemType?: Pick<IProductItemType, 'id'> | null;
}

export type NewProductRepositoryItem = Omit<IProductRepositoryItem, 'id'> & { id: null };
