import { ISimulation, NewSimulation } from './simulation.model';

export const sampleWithRequiredData: ISimulation = {
  id: 'd7f6007d-6be5-4d50-91b3-bf77b00878a4',
  name: 'input navigating',
};

export const sampleWithPartialData: ISimulation = {
  id: '78164144-0975-4090-a979-f0cc9dada784',
  name: 'withdrawal payment',
};

export const sampleWithFullData: ISimulation = {
  id: 'de831b53-dc81-45a1-b6da-b32c1b8299da',
  name: 'Small',
};

export const sampleWithNewData: NewSimulation = {
  name: 'Concrete Chief alliance',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
