import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../eligibility-condition.test-samples';

import { EligibilityConditionFormService } from './eligibility-condition-form.service';

describe('EligibilityCondition Form Service', () => {
  let service: EligibilityConditionFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EligibilityConditionFormService);
  });

  describe('Service methods', () => {
    describe('createEligibilityConditionFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createEligibilityConditionFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            applyLevelEnum: expect.any(Object),
            condition: expect.any(Object),
            itemFeature: expect.any(Object),
            productRepositoryItem: expect.any(Object),
            itemGroup: expect.any(Object),
          })
        );
      });

      it('passing IEligibilityCondition should create a new form with FormGroup', () => {
        const formGroup = service.createEligibilityConditionFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            applyLevelEnum: expect.any(Object),
            condition: expect.any(Object),
            itemFeature: expect.any(Object),
            productRepositoryItem: expect.any(Object),
            itemGroup: expect.any(Object),
          })
        );
      });
    });

    describe('getEligibilityCondition', () => {
      it('should return NewEligibilityCondition for default EligibilityCondition initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createEligibilityConditionFormGroup(sampleWithNewData);

        const eligibilityCondition = service.getEligibilityCondition(formGroup) as any;

        expect(eligibilityCondition).toMatchObject(sampleWithNewData);
      });

      it('should return NewEligibilityCondition for empty EligibilityCondition initial value', () => {
        const formGroup = service.createEligibilityConditionFormGroup();

        const eligibilityCondition = service.getEligibilityCondition(formGroup) as any;

        expect(eligibilityCondition).toMatchObject({});
      });

      it('should return IEligibilityCondition', () => {
        const formGroup = service.createEligibilityConditionFormGroup(sampleWithRequiredData);

        const eligibilityCondition = service.getEligibilityCondition(formGroup) as any;

        expect(eligibilityCondition).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IEligibilityCondition should not enable id FormControl', () => {
        const formGroup = service.createEligibilityConditionFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewEligibilityCondition should disable id FormControl', () => {
        const formGroup = service.createEligibilityConditionFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
