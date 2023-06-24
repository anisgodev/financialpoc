import { ICondition } from 'app/entities/condition/condition.model';
import { IItemFeature } from 'app/entities/item-feature/item-feature.model';
import { IProductRepositoryItem } from 'app/entities/product-repository-item/product-repository-item.model';
import { IItemGroup } from 'app/entities/item-group/item-group.model';
import { ApplyLevelEnum } from 'app/entities/enumerations/apply-level-enum.model';

export interface IEligibilityCondition {
  id: number;
  applyLevelEnum?: ApplyLevelEnum | null;
  condition?: Pick<ICondition, 'id'> | null;
  itemFeature?: Pick<IItemFeature, 'id'> | null;
  productRepositoryItem?: Pick<IProductRepositoryItem, 'id'> | null;
  itemGroup?: Pick<IItemGroup, 'id'> | null;
}

export type NewEligibilityCondition = Omit<IEligibilityCondition, 'id'> & { id: null };
