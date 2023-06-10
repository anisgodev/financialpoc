import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IBusinessModel, NewBusinessModel } from '../business-model.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IBusinessModel for edit and NewBusinessModelFormGroupInput for create.
 */
type BusinessModelFormGroupInput = IBusinessModel | PartialWithRequiredKeyOf<NewBusinessModel>;

type BusinessModelFormDefaults = Pick<NewBusinessModel, 'id'>;

type BusinessModelFormGroupContent = {
  id: FormControl<IBusinessModel['id'] | NewBusinessModel['id']>;
  name: FormControl<IBusinessModel['name']>;
  type: FormControl<IBusinessModel['type']>;
  category: FormControl<IBusinessModel['category']>;
  relatedBusinessModels: FormControl<IBusinessModel['relatedBusinessModels']>;
};

export type BusinessModelFormGroup = FormGroup<BusinessModelFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class BusinessModelFormService {
  createBusinessModelFormGroup(businessModel: BusinessModelFormGroupInput = { id: null }): BusinessModelFormGroup {
    const businessModelRawValue = {
      ...this.getFormDefaults(),
      ...businessModel,
    };
    return new FormGroup<BusinessModelFormGroupContent>({
      id: new FormControl(
        { value: businessModelRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(businessModelRawValue.name, {
        validators: [Validators.required],
      }),
      type: new FormControl(businessModelRawValue.type, {
        validators: [Validators.required],
      }),
      category: new FormControl(businessModelRawValue.category, {
        validators: [Validators.required],
      }),
      relatedBusinessModels: new FormControl(businessModelRawValue.relatedBusinessModels),
    });
  }

  getBusinessModel(form: BusinessModelFormGroup): IBusinessModel | NewBusinessModel {
    return form.getRawValue() as IBusinessModel | NewBusinessModel;
  }

  resetForm(form: BusinessModelFormGroup, businessModel: BusinessModelFormGroupInput): void {
    const businessModelRawValue = { ...this.getFormDefaults(), ...businessModel };
    form.reset(
      {
        ...businessModelRawValue,
        id: { value: businessModelRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): BusinessModelFormDefaults {
    return {
      id: null,
    };
  }
}
