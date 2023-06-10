import { ISimulation } from 'app/entities/simulation/simulation.model';

export interface ICreditProductInstance {
  id: string;
  name?: string | null;
  simulations?: Pick<ISimulation, 'id'> | null;
}

export type NewCreditProductInstance = Omit<ICreditProductInstance, 'id'> & { id: null };
