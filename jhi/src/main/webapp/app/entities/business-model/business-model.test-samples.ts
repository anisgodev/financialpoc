import { ParameterType } from 'app/entities/enumerations/parameter-type.model';
import { BusinessProcess } from 'app/entities/enumerations/business-process.model';

import { IBusinessModel, NewBusinessModel } from './business-model.model';

export const sampleWithRequiredData: IBusinessModel = {
  id: '4a163979-89ea-49b5-a891-d5b72f4b3cde',
  name: 'Optimization',
  type: ParameterType['CREDIT_PRODUCT'],
  category: BusinessProcess['SCORING'],
};

export const sampleWithPartialData: IBusinessModel = {
  id: 'b9b3e6f6-64b4-4081-b1db-3906cf20f7af',
  name: 'Gourde Organic Checking',
  type: ParameterType['OBJECT'],
  category: BusinessProcess['SCORING'],
};

export const sampleWithFullData: IBusinessModel = {
  id: 'f1d08fe2-2dc7-4fda-b8fa-7667f432f3c2',
  name: 'Computers',
  type: ParameterType['STRING'],
  category: BusinessProcess['SCORING'],
};

export const sampleWithNewData: NewBusinessModel = {
  name: 'EXE bypass',
  type: ParameterType['STRING'],
  category: BusinessProcess['GRANTING'],
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
