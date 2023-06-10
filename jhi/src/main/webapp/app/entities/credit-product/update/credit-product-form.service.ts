import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ICreditProduct, NewCreditProduct } from '../credit-product.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICreditProduct for edit and NewCreditProductFormGroupInput for create.
 */
type CreditProductFormGroupInput = ICreditProduct | PartialWithRequiredKeyOf<NewCreditProduct>;

type CreditProductFormDefaults = Pick<NewCreditProduct, 'id'>;

type CreditProductFormGroupContent = {
  id: FormControl<ICreditProduct['id'] | NewCreditProduct['id']>;
  name: FormControl<ICreditProduct['name']>;
  businessModels: FormControl<ICreditProduct['businessModels']>;
  rules: FormControl<ICreditProduct['rules']>;
};

export type CreditProductFormGroup = FormGroup<CreditProductFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CreditProductFormService {
  createCreditProductFormGroup(creditProduct: CreditProductFormGroupInput = { id: null }): CreditProductFormGroup {
    const creditProductRawValue = {
      ...this.getFormDefaults(),
      ...creditProduct,
    };
    return new FormGroup<CreditProductFormGroupContent>({
      id: new FormControl(
        { value: creditProductRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(creditProductRawValue.name, {
        validators: [Validators.required],
      }),
      businessModels: new FormControl(creditProductRawValue.businessModels),
      rules: new FormControl(creditProductRawValue.rules),
    });
  }

  getCreditProduct(form: CreditProductFormGroup): ICreditProduct | NewCreditProduct {
    return form.getRawValue() as ICreditProduct | NewCreditProduct;
  }

  resetForm(form: CreditProductFormGroup, creditProduct: CreditProductFormGroupInput): void {
    const creditProductRawValue = { ...this.getFormDefaults(), ...creditProduct };
    form.reset(
      {
        ...creditProductRawValue,
        id: { value: creditProductRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): CreditProductFormDefaults {
    return {
      id: null,
    };
  }
}
