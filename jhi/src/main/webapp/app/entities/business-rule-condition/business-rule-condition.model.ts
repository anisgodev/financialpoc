import { OperatorEnum } from 'app/entities/enumerations/operator-enum.model';

export interface IBusinessRuleCondition {
  id: string;
  field?: string | null;
  value?: string | null;
  operator?: OperatorEnum | null;
}

export type NewBusinessRuleCondition = Omit<IBusinessRuleCondition, 'id'> & { id: null };
