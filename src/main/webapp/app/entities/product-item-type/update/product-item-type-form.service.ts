import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IProductItemType, NewProductItemType } from '../product-item-type.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IProductItemType for edit and NewProductItemTypeFormGroupInput for create.
 */
type ProductItemTypeFormGroupInput = IProductItemType | PartialWithRequiredKeyOf<NewProductItemType>;

type ProductItemTypeFormDefaults = Pick<NewProductItemType, 'id'>;

type ProductItemTypeFormGroupContent = {
  id: FormControl<IProductItemType['id'] | NewProductItemType['id']>;
  productItemCategory: FormControl<IProductItemType['productItemCategory']>;
  typeName: FormControl<IProductItemType['typeName']>;
  stateEnum: FormControl<IProductItemType['stateEnum']>;
};

export type ProductItemTypeFormGroup = FormGroup<ProductItemTypeFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ProductItemTypeFormService {
  createProductItemTypeFormGroup(productItemType: ProductItemTypeFormGroupInput = { id: null }): ProductItemTypeFormGroup {
    const productItemTypeRawValue = {
      ...this.getFormDefaults(),
      ...productItemType,
    };
    return new FormGroup<ProductItemTypeFormGroupContent>({
      id: new FormControl(
        { value: productItemTypeRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      productItemCategory: new FormControl(productItemTypeRawValue.productItemCategory),
      typeName: new FormControl(productItemTypeRawValue.typeName),
      stateEnum: new FormControl(productItemTypeRawValue.stateEnum),
    });
  }

  getProductItemType(form: ProductItemTypeFormGroup): IProductItemType | NewProductItemType {
    return form.getRawValue() as IProductItemType | NewProductItemType;
  }

  resetForm(form: ProductItemTypeFormGroup, productItemType: ProductItemTypeFormGroupInput): void {
    const productItemTypeRawValue = { ...this.getFormDefaults(), ...productItemType };
    form.reset(
      {
        ...productItemTypeRawValue,
        id: { value: productItemTypeRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ProductItemTypeFormDefaults {
    return {
      id: null,
    };
  }
}
