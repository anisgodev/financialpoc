import { ParameterType } from 'app/entities/enumerations/parameter-type.model';
import { BusinessProcess } from 'app/entities/enumerations/business-process.model';

export interface IBusinessModel {
  id: string;
  name?: string | null;
  type?: ParameterType | null;
  category?: BusinessProcess | null;
  relatedBusinessModels?: Pick<IBusinessModel, 'id'> | null;
}

export type NewBusinessModel = Omit<IBusinessModel, 'id'> & { id: null };
