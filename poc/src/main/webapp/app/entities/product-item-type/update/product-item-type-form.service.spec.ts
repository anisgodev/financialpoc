import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../product-item-type.test-samples';

import { ProductItemTypeFormService } from './product-item-type-form.service';

describe('ProductItemType Form Service', () => {
  let service: ProductItemTypeFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductItemTypeFormService);
  });

  describe('Service methods', () => {
    describe('createProductItemTypeFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createProductItemTypeFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            productItemCategory: expect.any(Object),
            typeName: expect.any(Object),
            stateEnum: expect.any(Object),
          })
        );
      });

      it('passing IProductItemType should create a new form with FormGroup', () => {
        const formGroup = service.createProductItemTypeFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            productItemCategory: expect.any(Object),
            typeName: expect.any(Object),
            stateEnum: expect.any(Object),
          })
        );
      });
    });

    describe('getProductItemType', () => {
      it('should return NewProductItemType for default ProductItemType initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createProductItemTypeFormGroup(sampleWithNewData);

        const productItemType = service.getProductItemType(formGroup) as any;

        expect(productItemType).toMatchObject(sampleWithNewData);
      });

      it('should return NewProductItemType for empty ProductItemType initial value', () => {
        const formGroup = service.createProductItemTypeFormGroup();

        const productItemType = service.getProductItemType(formGroup) as any;

        expect(productItemType).toMatchObject({});
      });

      it('should return IProductItemType', () => {
        const formGroup = service.createProductItemTypeFormGroup(sampleWithRequiredData);

        const productItemType = service.getProductItemType(formGroup) as any;

        expect(productItemType).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IProductItemType should not enable id FormControl', () => {
        const formGroup = service.createProductItemTypeFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewProductItemType should disable id FormControl', () => {
        const formGroup = service.createProductItemTypeFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
