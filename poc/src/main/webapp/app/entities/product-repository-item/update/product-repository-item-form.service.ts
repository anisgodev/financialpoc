import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IProductRepositoryItem, NewProductRepositoryItem } from '../product-repository-item.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IProductRepositoryItem for edit and NewProductRepositoryItemFormGroupInput for create.
 */
type ProductRepositoryItemFormGroupInput = IProductRepositoryItem | PartialWithRequiredKeyOf<NewProductRepositoryItem>;

type ProductRepositoryItemFormDefaults = Pick<NewProductRepositoryItem, 'id'>;

type ProductRepositoryItemFormGroupContent = {
  id: FormControl<IProductRepositoryItem['id'] | NewProductRepositoryItem['id']>;
  name: FormControl<IProductRepositoryItem['name']>;
  description: FormControl<IProductRepositoryItem['description']>;
  productItemCategoryEnum: FormControl<IProductRepositoryItem['productItemCategoryEnum']>;
  itemStage: FormControl<IProductRepositoryItem['itemStage']>;
  productItemType: FormControl<IProductRepositoryItem['productItemType']>;
};

export type ProductRepositoryItemFormGroup = FormGroup<ProductRepositoryItemFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ProductRepositoryItemFormService {
  createProductRepositoryItemFormGroup(
    productRepositoryItem: ProductRepositoryItemFormGroupInput = { id: null }
  ): ProductRepositoryItemFormGroup {
    const productRepositoryItemRawValue = {
      ...this.getFormDefaults(),
      ...productRepositoryItem,
    };
    return new FormGroup<ProductRepositoryItemFormGroupContent>({
      id: new FormControl(
        { value: productRepositoryItemRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(productRepositoryItemRawValue.name),
      description: new FormControl(productRepositoryItemRawValue.description),
      productItemCategoryEnum: new FormControl(productRepositoryItemRawValue.productItemCategoryEnum),
      itemStage: new FormControl(productRepositoryItemRawValue.itemStage),
      productItemType: new FormControl(productRepositoryItemRawValue.productItemType),
    });
  }

  getProductRepositoryItem(form: ProductRepositoryItemFormGroup): IProductRepositoryItem | NewProductRepositoryItem {
    return form.getRawValue() as IProductRepositoryItem | NewProductRepositoryItem;
  }

  resetForm(form: ProductRepositoryItemFormGroup, productRepositoryItem: ProductRepositoryItemFormGroupInput): void {
    const productRepositoryItemRawValue = { ...this.getFormDefaults(), ...productRepositoryItem };
    form.reset(
      {
        ...productRepositoryItemRawValue,
        id: { value: productRepositoryItemRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ProductRepositoryItemFormDefaults {
    return {
      id: null,
    };
  }
}
