import { ParameterTypeEnum } from 'app/entities/enumerations/parameter-type-enum.model';

import { IExpectedValue, NewExpectedValue } from './expected-value.model';

export const sampleWithRequiredData: IExpectedValue = {
  id: 36593,
};

export const sampleWithPartialData: IExpectedValue = {
  id: 39805,
  parameterTypeEnum: ParameterTypeEnum['LOCALDATETIME'],
};

export const sampleWithFullData: IExpectedValue = {
  id: 16037,
  parameterTypeEnum: ParameterTypeEnum['BIGINTEGER'],
  value: 'Designer',
};

export const sampleWithNewData: NewExpectedValue = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
