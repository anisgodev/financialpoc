import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ISimulation, NewSimulation } from '../simulation.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ISimulation for edit and NewSimulationFormGroupInput for create.
 */
type SimulationFormGroupInput = ISimulation | PartialWithRequiredKeyOf<NewSimulation>;

type SimulationFormDefaults = Pick<NewSimulation, 'id'>;

type SimulationFormGroupContent = {
  id: FormControl<ISimulation['id'] | NewSimulation['id']>;
  name: FormControl<ISimulation['name']>;
  creditProduct: FormControl<ISimulation['creditProduct']>;
};

export type SimulationFormGroup = FormGroup<SimulationFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class SimulationFormService {
  createSimulationFormGroup(simulation: SimulationFormGroupInput = { id: null }): SimulationFormGroup {
    const simulationRawValue = {
      ...this.getFormDefaults(),
      ...simulation,
    };
    return new FormGroup<SimulationFormGroupContent>({
      id: new FormControl(
        { value: simulationRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(simulationRawValue.name, {
        validators: [Validators.required],
      }),
      creditProduct: new FormControl(simulationRawValue.creditProduct),
    });
  }

  getSimulation(form: SimulationFormGroup): ISimulation | NewSimulation {
    return form.getRawValue() as ISimulation | NewSimulation;
  }

  resetForm(form: SimulationFormGroup, simulation: SimulationFormGroupInput): void {
    const simulationRawValue = { ...this.getFormDefaults(), ...simulation };
    form.reset(
      {
        ...simulationRawValue,
        id: { value: simulationRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): SimulationFormDefaults {
    return {
      id: null,
    };
  }
}
