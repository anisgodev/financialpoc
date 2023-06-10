import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IBusinessRuleCondition, NewBusinessRuleCondition } from '../business-rule-condition.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IBusinessRuleCondition for edit and NewBusinessRuleConditionFormGroupInput for create.
 */
type BusinessRuleConditionFormGroupInput = IBusinessRuleCondition | PartialWithRequiredKeyOf<NewBusinessRuleCondition>;

type BusinessRuleConditionFormDefaults = Pick<NewBusinessRuleCondition, 'id'>;

type BusinessRuleConditionFormGroupContent = {
  id: FormControl<IBusinessRuleCondition['id'] | NewBusinessRuleCondition['id']>;
  field: FormControl<IBusinessRuleCondition['field']>;
  value: FormControl<IBusinessRuleCondition['value']>;
  operator: FormControl<IBusinessRuleCondition['operator']>;
};

export type BusinessRuleConditionFormGroup = FormGroup<BusinessRuleConditionFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class BusinessRuleConditionFormService {
  createBusinessRuleConditionFormGroup(
    businessRuleCondition: BusinessRuleConditionFormGroupInput = { id: null }
  ): BusinessRuleConditionFormGroup {
    const businessRuleConditionRawValue = {
      ...this.getFormDefaults(),
      ...businessRuleCondition,
    };
    return new FormGroup<BusinessRuleConditionFormGroupContent>({
      id: new FormControl(
        { value: businessRuleConditionRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      field: new FormControl(businessRuleConditionRawValue.field, {
        validators: [Validators.required],
      }),
      value: new FormControl(businessRuleConditionRawValue.value, {
        validators: [Validators.required],
      }),
      operator: new FormControl(businessRuleConditionRawValue.operator, {
        validators: [Validators.required],
      }),
    });
  }

  getBusinessRuleCondition(form: BusinessRuleConditionFormGroup): IBusinessRuleCondition | NewBusinessRuleCondition {
    return form.getRawValue() as IBusinessRuleCondition | NewBusinessRuleCondition;
  }

  resetForm(form: BusinessRuleConditionFormGroup, businessRuleCondition: BusinessRuleConditionFormGroupInput): void {
    const businessRuleConditionRawValue = { ...this.getFormDefaults(), ...businessRuleCondition };
    form.reset(
      {
        ...businessRuleConditionRawValue,
        id: { value: businessRuleConditionRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): BusinessRuleConditionFormDefaults {
    return {
      id: null,
    };
  }
}
