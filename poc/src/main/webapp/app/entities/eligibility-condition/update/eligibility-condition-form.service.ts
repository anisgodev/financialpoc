import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IEligibilityCondition, NewEligibilityCondition } from '../eligibility-condition.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IEligibilityCondition for edit and NewEligibilityConditionFormGroupInput for create.
 */
type EligibilityConditionFormGroupInput = IEligibilityCondition | PartialWithRequiredKeyOf<NewEligibilityCondition>;

type EligibilityConditionFormDefaults = Pick<NewEligibilityCondition, 'id'>;

type EligibilityConditionFormGroupContent = {
  id: FormControl<IEligibilityCondition['id'] | NewEligibilityCondition['id']>;
  applyLevelEnum: FormControl<IEligibilityCondition['applyLevelEnum']>;
  condition: FormControl<IEligibilityCondition['condition']>;
  itemFeature: FormControl<IEligibilityCondition['itemFeature']>;
  productRepositoryItem: FormControl<IEligibilityCondition['productRepositoryItem']>;
  itemGroup: FormControl<IEligibilityCondition['itemGroup']>;
};

export type EligibilityConditionFormGroup = FormGroup<EligibilityConditionFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class EligibilityConditionFormService {
  createEligibilityConditionFormGroup(
    eligibilityCondition: EligibilityConditionFormGroupInput = { id: null }
  ): EligibilityConditionFormGroup {
    const eligibilityConditionRawValue = {
      ...this.getFormDefaults(),
      ...eligibilityCondition,
    };
    return new FormGroup<EligibilityConditionFormGroupContent>({
      id: new FormControl(
        { value: eligibilityConditionRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      applyLevelEnum: new FormControl(eligibilityConditionRawValue.applyLevelEnum),
      condition: new FormControl(eligibilityConditionRawValue.condition),
      itemFeature: new FormControl(eligibilityConditionRawValue.itemFeature),
      productRepositoryItem: new FormControl(eligibilityConditionRawValue.productRepositoryItem),
      itemGroup: new FormControl(eligibilityConditionRawValue.itemGroup),
    });
  }

  getEligibilityCondition(form: EligibilityConditionFormGroup): IEligibilityCondition | NewEligibilityCondition {
    return form.getRawValue() as IEligibilityCondition | NewEligibilityCondition;
  }

  resetForm(form: EligibilityConditionFormGroup, eligibilityCondition: EligibilityConditionFormGroupInput): void {
    const eligibilityConditionRawValue = { ...this.getFormDefaults(), ...eligibilityCondition };
    form.reset(
      {
        ...eligibilityConditionRawValue,
        id: { value: eligibilityConditionRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): EligibilityConditionFormDefaults {
    return {
      id: null,
    };
  }
}
