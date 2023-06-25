import { ParameterGroupEnum } from 'app/entities/enumerations/parameter-group-enum.model';

import { IParameterDefType, NewParameterDefType } from './parameter-def-type.model';

export const sampleWithRequiredData: IParameterDefType = {
  id: 53061,
};

export const sampleWithPartialData: IParameterDefType = {
  id: 65605,
  label: 'experiences Account interactive',
};

export const sampleWithFullData: IParameterDefType = {
  id: 27407,
  fieldName: 'bypassing Administrator Concrete',
  label: 'exploit Marketing',
  parameterGroupEnum: ParameterGroupEnum['NUMERIC'],
};

export const sampleWithNewData: NewParameterDefType = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
