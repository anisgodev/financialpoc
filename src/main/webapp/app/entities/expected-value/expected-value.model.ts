import { ParameterTypeEnum } from 'app/entities/enumerations/parameter-type-enum.model';

export interface IExpectedValue {
  id: number;
  parameterTypeEnum?: ParameterTypeEnum | null;
  value?: string | null;
}

export type NewExpectedValue = Omit<IExpectedValue, 'id'> & { id: null };
