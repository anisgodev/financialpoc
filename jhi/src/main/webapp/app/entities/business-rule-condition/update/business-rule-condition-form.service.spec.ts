import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../business-rule-condition.test-samples';

import { BusinessRuleConditionFormService } from './business-rule-condition-form.service';

describe('BusinessRuleCondition Form Service', () => {
  let service: BusinessRuleConditionFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BusinessRuleConditionFormService);
  });

  describe('Service methods', () => {
    describe('createBusinessRuleConditionFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createBusinessRuleConditionFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            field: expect.any(Object),
            value: expect.any(Object),
            operator: expect.any(Object),
          })
        );
      });

      it('passing IBusinessRuleCondition should create a new form with FormGroup', () => {
        const formGroup = service.createBusinessRuleConditionFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            field: expect.any(Object),
            value: expect.any(Object),
            operator: expect.any(Object),
          })
        );
      });
    });

    describe('getBusinessRuleCondition', () => {
      it('should return NewBusinessRuleCondition for default BusinessRuleCondition initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createBusinessRuleConditionFormGroup(sampleWithNewData);

        const businessRuleCondition = service.getBusinessRuleCondition(formGroup) as any;

        expect(businessRuleCondition).toMatchObject(sampleWithNewData);
      });

      it('should return NewBusinessRuleCondition for empty BusinessRuleCondition initial value', () => {
        const formGroup = service.createBusinessRuleConditionFormGroup();

        const businessRuleCondition = service.getBusinessRuleCondition(formGroup) as any;

        expect(businessRuleCondition).toMatchObject({});
      });

      it('should return IBusinessRuleCondition', () => {
        const formGroup = service.createBusinessRuleConditionFormGroup(sampleWithRequiredData);

        const businessRuleCondition = service.getBusinessRuleCondition(formGroup) as any;

        expect(businessRuleCondition).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IBusinessRuleCondition should not enable id FormControl', () => {
        const formGroup = service.createBusinessRuleConditionFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewBusinessRuleCondition should disable id FormControl', () => {
        const formGroup = service.createBusinessRuleConditionFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
