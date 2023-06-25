import { ProductItemCategoryEnum } from 'app/entities/enumerations/product-item-category-enum.model';
import { StateEnum } from 'app/entities/enumerations/state-enum.model';

export interface IProductItemType {
  id: number;
  productItemCategory?: ProductItemCategoryEnum | null;
  typeName?: string | null;
  stateEnum?: StateEnum | null;
}

export type NewProductItemType = Omit<IProductItemType, 'id'> & { id: null };
