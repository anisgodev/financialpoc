import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../product-repository-item.test-samples';

import { ProductRepositoryItemFormService } from './product-repository-item-form.service';

describe('ProductRepositoryItem Form Service', () => {
  let service: ProductRepositoryItemFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductRepositoryItemFormService);
  });

  describe('Service methods', () => {
    describe('createProductRepositoryItemFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createProductRepositoryItemFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            description: expect.any(Object),
            productItemCategoryEnum: expect.any(Object),
            itemStage: expect.any(Object),
            productItemType: expect.any(Object),
          })
        );
      });

      it('passing IProductRepositoryItem should create a new form with FormGroup', () => {
        const formGroup = service.createProductRepositoryItemFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            description: expect.any(Object),
            productItemCategoryEnum: expect.any(Object),
            itemStage: expect.any(Object),
            productItemType: expect.any(Object),
          })
        );
      });
    });

    describe('getProductRepositoryItem', () => {
      it('should return NewProductRepositoryItem for default ProductRepositoryItem initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createProductRepositoryItemFormGroup(sampleWithNewData);

        const productRepositoryItem = service.getProductRepositoryItem(formGroup) as any;

        expect(productRepositoryItem).toMatchObject(sampleWithNewData);
      });

      it('should return NewProductRepositoryItem for empty ProductRepositoryItem initial value', () => {
        const formGroup = service.createProductRepositoryItemFormGroup();

        const productRepositoryItem = service.getProductRepositoryItem(formGroup) as any;

        expect(productRepositoryItem).toMatchObject({});
      });

      it('should return IProductRepositoryItem', () => {
        const formGroup = service.createProductRepositoryItemFormGroup(sampleWithRequiredData);

        const productRepositoryItem = service.getProductRepositoryItem(formGroup) as any;

        expect(productRepositoryItem).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IProductRepositoryItem should not enable id FormControl', () => {
        const formGroup = service.createProductRepositoryItemFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewProductRepositoryItem should disable id FormControl', () => {
        const formGroup = service.createProductRepositoryItemFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
