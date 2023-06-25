import { IProductRepositoryItem } from 'app/entities/product-repository-item/product-repository-item.model';

export interface IItemFeature {
  id: number;
  featureName?: string | null;
  featureLabel?: string | null;
  productRepositoryItem?: Pick<IProductRepositoryItem, 'id'> | null;
}

export type NewItemFeature = Omit<IItemFeature, 'id'> & { id: null };
