import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IItemGroup, NewItemGroup } from '../item-group.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IItemGroup for edit and NewItemGroupFormGroupInput for create.
 */
type ItemGroupFormGroupInput = IItemGroup | PartialWithRequiredKeyOf<NewItemGroup>;

type ItemGroupFormDefaults = Pick<NewItemGroup, 'id'>;

type ItemGroupFormGroupContent = {
  id: FormControl<IItemGroup['id'] | NewItemGroup['id']>;
  itemGroupName: FormControl<IItemGroup['itemGroupName']>;
  itemGroupDescription: FormControl<IItemGroup['itemGroupDescription']>;
};

export type ItemGroupFormGroup = FormGroup<ItemGroupFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ItemGroupFormService {
  createItemGroupFormGroup(itemGroup: ItemGroupFormGroupInput = { id: null }): ItemGroupFormGroup {
    const itemGroupRawValue = {
      ...this.getFormDefaults(),
      ...itemGroup,
    };
    return new FormGroup<ItemGroupFormGroupContent>({
      id: new FormControl(
        { value: itemGroupRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      itemGroupName: new FormControl(itemGroupRawValue.itemGroupName),
      itemGroupDescription: new FormControl(itemGroupRawValue.itemGroupDescription),
    });
  }

  getItemGroup(form: ItemGroupFormGroup): IItemGroup | NewItemGroup {
    return form.getRawValue() as IItemGroup | NewItemGroup;
  }

  resetForm(form: ItemGroupFormGroup, itemGroup: ItemGroupFormGroupInput): void {
    const itemGroupRawValue = { ...this.getFormDefaults(), ...itemGroup };
    form.reset(
      {
        ...itemGroupRawValue,
        id: { value: itemGroupRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ItemGroupFormDefaults {
    return {
      id: null,
    };
  }
}
