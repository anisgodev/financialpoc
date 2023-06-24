import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IParameterDefType, NewParameterDefType } from '../parameter-def-type.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IParameterDefType for edit and NewParameterDefTypeFormGroupInput for create.
 */
type ParameterDefTypeFormGroupInput = IParameterDefType | PartialWithRequiredKeyOf<NewParameterDefType>;

type ParameterDefTypeFormDefaults = Pick<NewParameterDefType, 'id'>;

type ParameterDefTypeFormGroupContent = {
  id: FormControl<IParameterDefType['id'] | NewParameterDefType['id']>;
  fieldName: FormControl<IParameterDefType['fieldName']>;
  label: FormControl<IParameterDefType['label']>;
  parameterGroupEnum: FormControl<IParameterDefType['parameterGroupEnum']>;
};

export type ParameterDefTypeFormGroup = FormGroup<ParameterDefTypeFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ParameterDefTypeFormService {
  createParameterDefTypeFormGroup(parameterDefType: ParameterDefTypeFormGroupInput = { id: null }): ParameterDefTypeFormGroup {
    const parameterDefTypeRawValue = {
      ...this.getFormDefaults(),
      ...parameterDefType,
    };
    return new FormGroup<ParameterDefTypeFormGroupContent>({
      id: new FormControl(
        { value: parameterDefTypeRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      fieldName: new FormControl(parameterDefTypeRawValue.fieldName),
      label: new FormControl(parameterDefTypeRawValue.label),
      parameterGroupEnum: new FormControl(parameterDefTypeRawValue.parameterGroupEnum),
    });
  }

  getParameterDefType(form: ParameterDefTypeFormGroup): IParameterDefType | NewParameterDefType {
    return form.getRawValue() as IParameterDefType | NewParameterDefType;
  }

  resetForm(form: ParameterDefTypeFormGroup, parameterDefType: ParameterDefTypeFormGroupInput): void {
    const parameterDefTypeRawValue = { ...this.getFormDefaults(), ...parameterDefType };
    form.reset(
      {
        ...parameterDefTypeRawValue,
        id: { value: parameterDefTypeRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ParameterDefTypeFormDefaults {
    return {
      id: null,
    };
  }
}
