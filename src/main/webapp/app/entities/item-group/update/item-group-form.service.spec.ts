import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../item-group.test-samples';

import { ItemGroupFormService } from './item-group-form.service';

describe('ItemGroup Form Service', () => {
  let service: ItemGroupFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItemGroupFormService);
  });

  describe('Service methods', () => {
    describe('createItemGroupFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createItemGroupFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            itemGroupName: expect.any(Object),
            itemGroupDescription: expect.any(Object),
          })
        );
      });

      it('passing IItemGroup should create a new form with FormGroup', () => {
        const formGroup = service.createItemGroupFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            itemGroupName: expect.any(Object),
            itemGroupDescription: expect.any(Object),
          })
        );
      });
    });

    describe('getItemGroup', () => {
      it('should return NewItemGroup for default ItemGroup initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createItemGroupFormGroup(sampleWithNewData);

        const itemGroup = service.getItemGroup(formGroup) as any;

        expect(itemGroup).toMatchObject(sampleWithNewData);
      });

      it('should return NewItemGroup for empty ItemGroup initial value', () => {
        const formGroup = service.createItemGroupFormGroup();

        const itemGroup = service.getItemGroup(formGroup) as any;

        expect(itemGroup).toMatchObject({});
      });

      it('should return IItemGroup', () => {
        const formGroup = service.createItemGroupFormGroup(sampleWithRequiredData);

        const itemGroup = service.getItemGroup(formGroup) as any;

        expect(itemGroup).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IItemGroup should not enable id FormControl', () => {
        const formGroup = service.createItemGroupFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewItemGroup should disable id FormControl', () => {
        const formGroup = service.createItemGroupFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
