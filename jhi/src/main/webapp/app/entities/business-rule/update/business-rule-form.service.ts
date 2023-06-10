import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IBusinessRule, NewBusinessRule } from '../business-rule.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IBusinessRule for edit and NewBusinessRuleFormGroupInput for create.
 */
type BusinessRuleFormGroupInput = IBusinessRule | PartialWithRequiredKeyOf<NewBusinessRule>;

type BusinessRuleFormDefaults = Pick<NewBusinessRule, 'id'>;

type BusinessRuleFormGroupContent = {
  id: FormControl<IBusinessRule['id'] | NewBusinessRule['id']>;
  name: FormControl<IBusinessRule['name']>;
  businessProcess: FormControl<IBusinessRule['businessProcess']>;
  conditions: FormControl<IBusinessRule['conditions']>;
};

export type BusinessRuleFormGroup = FormGroup<BusinessRuleFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class BusinessRuleFormService {
  createBusinessRuleFormGroup(businessRule: BusinessRuleFormGroupInput = { id: null }): BusinessRuleFormGroup {
    const businessRuleRawValue = {
      ...this.getFormDefaults(),
      ...businessRule,
    };
    return new FormGroup<BusinessRuleFormGroupContent>({
      id: new FormControl(
        { value: businessRuleRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(businessRuleRawValue.name, {
        validators: [Validators.required],
      }),
      businessProcess: new FormControl(businessRuleRawValue.businessProcess, {
        validators: [Validators.required],
      }),
      conditions: new FormControl(businessRuleRawValue.conditions),
    });
  }

  getBusinessRule(form: BusinessRuleFormGroup): IBusinessRule | NewBusinessRule {
    return form.getRawValue() as IBusinessRule | NewBusinessRule;
  }

  resetForm(form: BusinessRuleFormGroup, businessRule: BusinessRuleFormGroupInput): void {
    const businessRuleRawValue = { ...this.getFormDefaults(), ...businessRule };
    form.reset(
      {
        ...businessRuleRawValue,
        id: { value: businessRuleRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): BusinessRuleFormDefaults {
    return {
      id: null,
    };
  }
}
