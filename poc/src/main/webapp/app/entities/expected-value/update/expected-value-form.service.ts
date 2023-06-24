import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IExpectedValue, NewExpectedValue } from '../expected-value.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IExpectedValue for edit and NewExpectedValueFormGroupInput for create.
 */
type ExpectedValueFormGroupInput = IExpectedValue | PartialWithRequiredKeyOf<NewExpectedValue>;

type ExpectedValueFormDefaults = Pick<NewExpectedValue, 'id'>;

type ExpectedValueFormGroupContent = {
  id: FormControl<IExpectedValue['id'] | NewExpectedValue['id']>;
  parameterTypeEnum: FormControl<IExpectedValue['parameterTypeEnum']>;
  value: FormControl<IExpectedValue['value']>;
};

export type ExpectedValueFormGroup = FormGroup<ExpectedValueFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ExpectedValueFormService {
  createExpectedValueFormGroup(expectedValue: ExpectedValueFormGroupInput = { id: null }): ExpectedValueFormGroup {
    const expectedValueRawValue = {
      ...this.getFormDefaults(),
      ...expectedValue,
    };
    return new FormGroup<ExpectedValueFormGroupContent>({
      id: new FormControl(
        { value: expectedValueRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      parameterTypeEnum: new FormControl(expectedValueRawValue.parameterTypeEnum),
      value: new FormControl(expectedValueRawValue.value),
    });
  }

  getExpectedValue(form: ExpectedValueFormGroup): IExpectedValue | NewExpectedValue {
    return form.getRawValue() as IExpectedValue | NewExpectedValue;
  }

  resetForm(form: ExpectedValueFormGroup, expectedValue: ExpectedValueFormGroupInput): void {
    const expectedValueRawValue = { ...this.getFormDefaults(), ...expectedValue };
    form.reset(
      {
        ...expectedValueRawValue,
        id: { value: expectedValueRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ExpectedValueFormDefaults {
    return {
      id: null,
    };
  }
}
