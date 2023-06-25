import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../parameter-def-type.test-samples';

import { ParameterDefTypeFormService } from './parameter-def-type-form.service';

describe('ParameterDefType Form Service', () => {
  let service: ParameterDefTypeFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParameterDefTypeFormService);
  });

  describe('Service methods', () => {
    describe('createParameterDefTypeFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createParameterDefTypeFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            fieldName: expect.any(Object),
            label: expect.any(Object),
            parameterGroupEnum: expect.any(Object),
          })
        );
      });

      it('passing IParameterDefType should create a new form with FormGroup', () => {
        const formGroup = service.createParameterDefTypeFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            fieldName: expect.any(Object),
            label: expect.any(Object),
            parameterGroupEnum: expect.any(Object),
          })
        );
      });
    });

    describe('getParameterDefType', () => {
      it('should return NewParameterDefType for default ParameterDefType initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createParameterDefTypeFormGroup(sampleWithNewData);

        const parameterDefType = service.getParameterDefType(formGroup) as any;

        expect(parameterDefType).toMatchObject(sampleWithNewData);
      });

      it('should return NewParameterDefType for empty ParameterDefType initial value', () => {
        const formGroup = service.createParameterDefTypeFormGroup();

        const parameterDefType = service.getParameterDefType(formGroup) as any;

        expect(parameterDefType).toMatchObject({});
      });

      it('should return IParameterDefType', () => {
        const formGroup = service.createParameterDefTypeFormGroup(sampleWithRequiredData);

        const parameterDefType = service.getParameterDefType(formGroup) as any;

        expect(parameterDefType).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IParameterDefType should not enable id FormControl', () => {
        const formGroup = service.createParameterDefTypeFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewParameterDefType should disable id FormControl', () => {
        const formGroup = service.createParameterDefTypeFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
