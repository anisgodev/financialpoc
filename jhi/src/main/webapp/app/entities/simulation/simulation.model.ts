import { ICreditProduct } from 'app/entities/credit-product/credit-product.model';

export interface ISimulation {
  id: string;
  name?: string | null;
  creditProduct?: Pick<ICreditProduct, 'id'> | null;
}

export type NewSimulation = Omit<ISimulation, 'id'> & { id: null };
