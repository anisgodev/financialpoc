import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../credit-product-instance.test-samples';

import { CreditProductInstanceFormService } from './credit-product-instance-form.service';

describe('CreditProductInstance Form Service', () => {
  let service: CreditProductInstanceFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreditProductInstanceFormService);
  });

  describe('Service methods', () => {
    describe('createCreditProductInstanceFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createCreditProductInstanceFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            simulations: expect.any(Object),
          })
        );
      });

      it('passing ICreditProductInstance should create a new form with FormGroup', () => {
        const formGroup = service.createCreditProductInstanceFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            simulations: expect.any(Object),
          })
        );
      });
    });

    describe('getCreditProductInstance', () => {
      it('should return NewCreditProductInstance for default CreditProductInstance initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createCreditProductInstanceFormGroup(sampleWithNewData);

        const creditProductInstance = service.getCreditProductInstance(formGroup) as any;

        expect(creditProductInstance).toMatchObject(sampleWithNewData);
      });

      it('should return NewCreditProductInstance for empty CreditProductInstance initial value', () => {
        const formGroup = service.createCreditProductInstanceFormGroup();

        const creditProductInstance = service.getCreditProductInstance(formGroup) as any;

        expect(creditProductInstance).toMatchObject({});
      });

      it('should return ICreditProductInstance', () => {
        const formGroup = service.createCreditProductInstanceFormGroup(sampleWithRequiredData);

        const creditProductInstance = service.getCreditProductInstance(formGroup) as any;

        expect(creditProductInstance).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ICreditProductInstance should not enable id FormControl', () => {
        const formGroup = service.createCreditProductInstanceFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewCreditProductInstance should disable id FormControl', () => {
        const formGroup = service.createCreditProductInstanceFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
