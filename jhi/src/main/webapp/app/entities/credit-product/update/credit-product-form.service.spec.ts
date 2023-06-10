import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../credit-product.test-samples';

import { CreditProductFormService } from './credit-product-form.service';

describe('CreditProduct Form Service', () => {
  let service: CreditProductFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreditProductFormService);
  });

  describe('Service methods', () => {
    describe('createCreditProductFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createCreditProductFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            businessModels: expect.any(Object),
            rules: expect.any(Object),
          })
        );
      });

      it('passing ICreditProduct should create a new form with FormGroup', () => {
        const formGroup = service.createCreditProductFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            businessModels: expect.any(Object),
            rules: expect.any(Object),
          })
        );
      });
    });

    describe('getCreditProduct', () => {
      it('should return NewCreditProduct for default CreditProduct initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createCreditProductFormGroup(sampleWithNewData);

        const creditProduct = service.getCreditProduct(formGroup) as any;

        expect(creditProduct).toMatchObject(sampleWithNewData);
      });

      it('should return NewCreditProduct for empty CreditProduct initial value', () => {
        const formGroup = service.createCreditProductFormGroup();

        const creditProduct = service.getCreditProduct(formGroup) as any;

        expect(creditProduct).toMatchObject({});
      });

      it('should return ICreditProduct', () => {
        const formGroup = service.createCreditProductFormGroup(sampleWithRequiredData);

        const creditProduct = service.getCreditProduct(formGroup) as any;

        expect(creditProduct).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ICreditProduct should not enable id FormControl', () => {
        const formGroup = service.createCreditProductFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewCreditProduct should disable id FormControl', () => {
        const formGroup = service.createCreditProductFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
