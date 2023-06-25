import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IItemFeature, NewItemFeature } from '../item-feature.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IItemFeature for edit and NewItemFeatureFormGroupInput for create.
 */
type ItemFeatureFormGroupInput = IItemFeature | PartialWithRequiredKeyOf<NewItemFeature>;

type ItemFeatureFormDefaults = Pick<NewItemFeature, 'id'>;

type ItemFeatureFormGroupContent = {
  id: FormControl<IItemFeature['id'] | NewItemFeature['id']>;
  featureName: FormControl<IItemFeature['featureName']>;
  featureLabel: FormControl<IItemFeature['featureLabel']>;
  productRepositoryItem: FormControl<IItemFeature['productRepositoryItem']>;
};

export type ItemFeatureFormGroup = FormGroup<ItemFeatureFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ItemFeatureFormService {
  createItemFeatureFormGroup(itemFeature: ItemFeatureFormGroupInput = { id: null }): ItemFeatureFormGroup {
    const itemFeatureRawValue = {
      ...this.getFormDefaults(),
      ...itemFeature,
    };
    return new FormGroup<ItemFeatureFormGroupContent>({
      id: new FormControl(
        { value: itemFeatureRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      featureName: new FormControl(itemFeatureRawValue.featureName),
      featureLabel: new FormControl(itemFeatureRawValue.featureLabel),
      productRepositoryItem: new FormControl(itemFeatureRawValue.productRepositoryItem),
    });
  }

  getItemFeature(form: ItemFeatureFormGroup): IItemFeature | NewItemFeature {
    return form.getRawValue() as IItemFeature | NewItemFeature;
  }

  resetForm(form: ItemFeatureFormGroup, itemFeature: ItemFeatureFormGroupInput): void {
    const itemFeatureRawValue = { ...this.getFormDefaults(), ...itemFeature };
    form.reset(
      {
        ...itemFeatureRawValue,
        id: { value: itemFeatureRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ItemFeatureFormDefaults {
    return {
      id: null,
    };
  }
}
