import { ApplyLevelEnum } from 'app/entities/enumerations/apply-level-enum.model';

import { IEligibilityCondition, NewEligibilityCondition } from './eligibility-condition.model';

export const sampleWithRequiredData: IEligibilityCondition = {
  id: 19783,
};

export const sampleWithPartialData: IEligibilityCondition = {
  id: 67843,
  applyLevelEnum: ApplyLevelEnum['ITEM'],
};

export const sampleWithFullData: IEligibilityCondition = {
  id: 90202,
  applyLevelEnum: ApplyLevelEnum['ITEM'],
};

export const sampleWithNewData: NewEligibilityCondition = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
