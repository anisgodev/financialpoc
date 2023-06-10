import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../business-rule.test-samples';

import { BusinessRuleFormService } from './business-rule-form.service';

describe('BusinessRule Form Service', () => {
  let service: BusinessRuleFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BusinessRuleFormService);
  });

  describe('Service methods', () => {
    describe('createBusinessRuleFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createBusinessRuleFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            businessProcess: expect.any(Object),
            conditions: expect.any(Object),
          })
        );
      });

      it('passing IBusinessRule should create a new form with FormGroup', () => {
        const formGroup = service.createBusinessRuleFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            businessProcess: expect.any(Object),
            conditions: expect.any(Object),
          })
        );
      });
    });

    describe('getBusinessRule', () => {
      it('should return NewBusinessRule for default BusinessRule initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createBusinessRuleFormGroup(sampleWithNewData);

        const businessRule = service.getBusinessRule(formGroup) as any;

        expect(businessRule).toMatchObject(sampleWithNewData);
      });

      it('should return NewBusinessRule for empty BusinessRule initial value', () => {
        const formGroup = service.createBusinessRuleFormGroup();

        const businessRule = service.getBusinessRule(formGroup) as any;

        expect(businessRule).toMatchObject({});
      });

      it('should return IBusinessRule', () => {
        const formGroup = service.createBusinessRuleFormGroup(sampleWithRequiredData);

        const businessRule = service.getBusinessRule(formGroup) as any;

        expect(businessRule).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IBusinessRule should not enable id FormControl', () => {
        const formGroup = service.createBusinessRuleFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewBusinessRule should disable id FormControl', () => {
        const formGroup = service.createBusinessRuleFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
