import { IParameterDefType } from 'app/entities/parameter-def-type/parameter-def-type.model';
import { IExpectedValue } from 'app/entities/expected-value/expected-value.model';
import { IItemFeature } from 'app/entities/item-feature/item-feature.model';
import { ParameterTypeEnum } from 'app/entities/enumerations/parameter-type-enum.model';
import { ParameterStateEnum } from 'app/entities/enumerations/parameter-state-enum.model';

export interface IParameter {
  id: number;
  type?: ParameterTypeEnum | null;
  parameterStateEnum?: ParameterStateEnum | null;
  parameterDefType?: Pick<IParameterDefType, 'id'> | null;
  expectedValue?: Pick<IExpectedValue, 'id'> | null;
  itemFeature?: Pick<IItemFeature, 'id'> | null;
}

export type NewParameter = Omit<IParameter, 'id'> & { id: null };
