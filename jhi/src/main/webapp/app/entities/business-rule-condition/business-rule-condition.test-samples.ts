import { OperatorEnum } from 'app/entities/enumerations/operator-enum.model';

import { IBusinessRuleCondition, NewBusinessRuleCondition } from './business-rule-condition.model';

export const sampleWithRequiredData: IBusinessRuleCondition = {
  id: 'a9169b6b-be28-41dd-abf8-5c55dd674217',
  field: 'Small synthesizing withdrawal',
  value: 'Frozen',
  operator: OperatorEnum['EQUAL_TO'],
};

export const sampleWithPartialData: IBusinessRuleCondition = {
  id: 'a65f1964-7538-4daa-bf9d-a808dd155e4b',
  field: 'connect',
  value: 'Garden',
  operator: OperatorEnum['LESS_THAN'],
};

export const sampleWithFullData: IBusinessRuleCondition = {
  id: '5565b236-049e-426e-b16e-dead099375b6',
  field: 'Cotton',
  value: 'haptic product Account',
  operator: OperatorEnum['EQUAL_TO'],
};

export const sampleWithNewData: NewBusinessRuleCondition = {
  field: 'Florida',
  value: 'interface',
  operator: OperatorEnum['LESS_THAN_OR_EQUAL_TO'],
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
