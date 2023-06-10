import { BusinessProcess } from 'app/entities/enumerations/business-process.model';

import { IBusinessRule, NewBusinessRule } from './business-rule.model';

export const sampleWithRequiredData: IBusinessRule = {
  id: 'ec376e68-fbaa-4779-ad17-d2a04a1ee01a',
  name: 'Loan',
  businessProcess: BusinessProcess['SCORING'],
};

export const sampleWithPartialData: IBusinessRule = {
  id: '68f20bfd-243e-433d-9528-efe8415ce7ea',
  name: 'Directives',
  businessProcess: BusinessProcess['GRANTING'],
};

export const sampleWithFullData: IBusinessRule = {
  id: '123c95ad-e54d-4223-8a8e-a23de4c4135c',
  name: 'morph Executive Home',
  businessProcess: BusinessProcess['SCORING'],
};

export const sampleWithNewData: NewBusinessRule = {
  name: 'forecast gold',
  businessProcess: BusinessProcess['GRANTING'],
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
