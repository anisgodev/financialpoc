import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../business-model.test-samples';

import { BusinessModelFormService } from './business-model-form.service';

describe('BusinessModel Form Service', () => {
  let service: BusinessModelFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BusinessModelFormService);
  });

  describe('Service methods', () => {
    describe('createBusinessModelFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createBusinessModelFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            type: expect.any(Object),
            category: expect.any(Object),
            relatedBusinessModels: expect.any(Object),
          })
        );
      });

      it('passing IBusinessModel should create a new form with FormGroup', () => {
        const formGroup = service.createBusinessModelFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            type: expect.any(Object),
            category: expect.any(Object),
            relatedBusinessModels: expect.any(Object),
          })
        );
      });
    });

    describe('getBusinessModel', () => {
      it('should return NewBusinessModel for default BusinessModel initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createBusinessModelFormGroup(sampleWithNewData);

        const businessModel = service.getBusinessModel(formGroup) as any;

        expect(businessModel).toMatchObject(sampleWithNewData);
      });

      it('should return NewBusinessModel for empty BusinessModel initial value', () => {
        const formGroup = service.createBusinessModelFormGroup();

        const businessModel = service.getBusinessModel(formGroup) as any;

        expect(businessModel).toMatchObject({});
      });

      it('should return IBusinessModel', () => {
        const formGroup = service.createBusinessModelFormGroup(sampleWithRequiredData);

        const businessModel = service.getBusinessModel(formGroup) as any;

        expect(businessModel).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IBusinessModel should not enable id FormControl', () => {
        const formGroup = service.createBusinessModelFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewBusinessModel should disable id FormControl', () => {
        const formGroup = service.createBusinessModelFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
