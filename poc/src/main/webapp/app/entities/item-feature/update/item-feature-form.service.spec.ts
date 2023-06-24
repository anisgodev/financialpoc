import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../item-feature.test-samples';

import { ItemFeatureFormService } from './item-feature-form.service';

describe('ItemFeature Form Service', () => {
  let service: ItemFeatureFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItemFeatureFormService);
  });

  describe('Service methods', () => {
    describe('createItemFeatureFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createItemFeatureFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            featureName: expect.any(Object),
            featureLabel: expect.any(Object),
            productRepositoryItem: expect.any(Object),
          })
        );
      });

      it('passing IItemFeature should create a new form with FormGroup', () => {
        const formGroup = service.createItemFeatureFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            featureName: expect.any(Object),
            featureLabel: expect.any(Object),
            productRepositoryItem: expect.any(Object),
          })
        );
      });
    });

    describe('getItemFeature', () => {
      it('should return NewItemFeature for default ItemFeature initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createItemFeatureFormGroup(sampleWithNewData);

        const itemFeature = service.getItemFeature(formGroup) as any;

        expect(itemFeature).toMatchObject(sampleWithNewData);
      });

      it('should return NewItemFeature for empty ItemFeature initial value', () => {
        const formGroup = service.createItemFeatureFormGroup();

        const itemFeature = service.getItemFeature(formGroup) as any;

        expect(itemFeature).toMatchObject({});
      });

      it('should return IItemFeature', () => {
        const formGroup = service.createItemFeatureFormGroup(sampleWithRequiredData);

        const itemFeature = service.getItemFeature(formGroup) as any;

        expect(itemFeature).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IItemFeature should not enable id FormControl', () => {
        const formGroup = service.createItemFeatureFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewItemFeature should disable id FormControl', () => {
        const formGroup = service.createItemFeatureFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
