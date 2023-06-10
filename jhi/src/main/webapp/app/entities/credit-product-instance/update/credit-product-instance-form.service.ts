import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ICreditProductInstance, NewCreditProductInstance } from '../credit-product-instance.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICreditProductInstance for edit and NewCreditProductInstanceFormGroupInput for create.
 */
type CreditProductInstanceFormGroupInput = ICreditProductInstance | PartialWithRequiredKeyOf<NewCreditProductInstance>;

type CreditProductInstanceFormDefaults = Pick<NewCreditProductInstance, 'id'>;

type CreditProductInstanceFormGroupContent = {
  id: FormControl<ICreditProductInstance['id'] | NewCreditProductInstance['id']>;
  name: FormControl<ICreditProductInstance['name']>;
  simulations: FormControl<ICreditProductInstance['simulations']>;
};

export type CreditProductInstanceFormGroup = FormGroup<CreditProductInstanceFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CreditProductInstanceFormService {
  createCreditProductInstanceFormGroup(
    creditProductInstance: CreditProductInstanceFormGroupInput = { id: null }
  ): CreditProductInstanceFormGroup {
    const creditProductInstanceRawValue = {
      ...this.getFormDefaults(),
      ...creditProductInstance,
    };
    return new FormGroup<CreditProductInstanceFormGroupContent>({
      id: new FormControl(
        { value: creditProductInstanceRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(creditProductInstanceRawValue.name, {
        validators: [Validators.required],
      }),
      simulations: new FormControl(creditProductInstanceRawValue.simulations),
    });
  }

  getCreditProductInstance(form: CreditProductInstanceFormGroup): ICreditProductInstance | NewCreditProductInstance {
    return form.getRawValue() as ICreditProductInstance | NewCreditProductInstance;
  }

  resetForm(form: CreditProductInstanceFormGroup, creditProductInstance: CreditProductInstanceFormGroupInput): void {
    const creditProductInstanceRawValue = { ...this.getFormDefaults(), ...creditProductInstance };
    form.reset(
      {
        ...creditProductInstanceRawValue,
        id: { value: creditProductInstanceRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): CreditProductInstanceFormDefaults {
    return {
      id: null,
    };
  }
}
