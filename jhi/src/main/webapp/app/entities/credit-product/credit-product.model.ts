import { IBusinessModel } from 'app/entities/business-model/business-model.model';
import { IBusinessRule } from 'app/entities/business-rule/business-rule.model';

export interface ICreditProduct {
  id: string;
  name?: string | null;
  businessModels?: Pick<IBusinessModel, 'id'> | null;
  rules?: Pick<IBusinessRule, 'id'> | null;
}

export type NewCreditProduct = Omit<ICreditProduct, 'id'> & { id: null };
