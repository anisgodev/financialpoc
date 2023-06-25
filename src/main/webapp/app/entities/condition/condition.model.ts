import { IParameter } from 'app/entities/parameter/parameter.model';

export interface ICondition {
  id: number;
  operator?: string | null;
  parameter?: Pick<IParameter, 'id'> | null;
}

export type NewCondition = Omit<ICondition, 'id'> & { id: null };
