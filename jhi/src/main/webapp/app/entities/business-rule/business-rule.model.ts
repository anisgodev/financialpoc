import { IBusinessRuleCondition } from 'app/entities/business-rule-condition/business-rule-condition.model';
import { BusinessProcess } from 'app/entities/enumerations/business-process.model';

export interface IBusinessRule {
  id: string;
  name?: string | null;
  businessProcess?: BusinessProcess | null;
  conditions?: Pick<IBusinessRuleCondition, 'id'> | null;
}

export type NewBusinessRule = Omit<IBusinessRule, 'id'> & { id: null };
