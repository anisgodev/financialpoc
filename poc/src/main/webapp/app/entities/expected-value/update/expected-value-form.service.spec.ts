import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../expected-value.test-samples';

import { ExpectedValueFormService } from './expected-value-form.service';

describe('ExpectedValue Form Service', () => {
  let service: ExpectedValueFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExpectedValueFormService);
  });

  describe('Service methods', () => {
    describe('createExpectedValueFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createExpectedValueFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            parameterTypeEnum: expect.any(Object),
            value: expect.any(Object),
          })
        );
      });

      it('passing IExpectedValue should create a new form with FormGroup', () => {
        const formGroup = service.createExpectedValueFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            parameterTypeEnum: expect.any(Object),
            value: expect.any(Object),
          })
        );
      });
    });

    describe('getExpectedValue', () => {
      it('should return NewExpectedValue for default ExpectedValue initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createExpectedValueFormGroup(sampleWithNewData);

        const expectedValue = service.getExpectedValue(formGroup) as any;

        expect(expectedValue).toMatchObject(sampleWithNewData);
      });

      it('should return NewExpectedValue for empty ExpectedValue initial value', () => {
        const formGroup = service.createExpectedValueFormGroup();

        const expectedValue = service.getExpectedValue(formGroup) as any;

        expect(expectedValue).toMatchObject({});
      });

      it('should return IExpectedValue', () => {
        const formGroup = service.createExpectedValueFormGroup(sampleWithRequiredData);

        const expectedValue = service.getExpectedValue(formGroup) as any;

        expect(expectedValue).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IExpectedValue should not enable id FormControl', () => {
        const formGroup = service.createExpectedValueFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewExpectedValue should disable id FormControl', () => {
        const formGroup = service.createExpectedValueFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
