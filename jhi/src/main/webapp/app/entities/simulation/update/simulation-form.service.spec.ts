import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../simulation.test-samples';

import { SimulationFormService } from './simulation-form.service';

describe('Simulation Form Service', () => {
  let service: SimulationFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SimulationFormService);
  });

  describe('Service methods', () => {
    describe('createSimulationFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createSimulationFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            creditProduct: expect.any(Object),
          })
        );
      });

      it('passing ISimulation should create a new form with FormGroup', () => {
        const formGroup = service.createSimulationFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            creditProduct: expect.any(Object),
          })
        );
      });
    });

    describe('getSimulation', () => {
      it('should return NewSimulation for default Simulation initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createSimulationFormGroup(sampleWithNewData);

        const simulation = service.getSimulation(formGroup) as any;

        expect(simulation).toMatchObject(sampleWithNewData);
      });

      it('should return NewSimulation for empty Simulation initial value', () => {
        const formGroup = service.createSimulationFormGroup();

        const simulation = service.getSimulation(formGroup) as any;

        expect(simulation).toMatchObject({});
      });

      it('should return ISimulation', () => {
        const formGroup = service.createSimulationFormGroup(sampleWithRequiredData);

        const simulation = service.getSimulation(formGroup) as any;

        expect(simulation).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ISimulation should not enable id FormControl', () => {
        const formGroup = service.createSimulationFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewSimulation should disable id FormControl', () => {
        const formGroup = service.createSimulationFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
