import { ParameterTypeEnum } from 'app/entities/enumerations/parameter-type-enum.model';
import { ParameterStateEnum } from 'app/entities/enumerations/parameter-state-enum.model';

import { IParameter, NewParameter } from './parameter.model';

export const sampleWithRequiredData: IParameter = {
  id: 1739,
};

export const sampleWithPartialData: IParameter = {
  id: 38187,
  parameterStateEnum: ParameterStateEnum['ACTIVE'],
};

export const sampleWithFullData: IParameter = {
  id: 65930,
  type: ParameterTypeEnum['Date'],
  parameterStateEnum: ParameterStateEnum['DRAFT'],
};

export const sampleWithNewData: NewParameter = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
