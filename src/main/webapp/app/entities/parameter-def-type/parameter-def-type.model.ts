import { ParameterGroupEnum } from 'app/entities/enumerations/parameter-group-enum.model';

export interface IParameterDefType {
  id: number;
  fieldName?: string | null;
  label?: string | null;
  parameterGroupEnum?: ParameterGroupEnum | null;
}

export type NewParameterDefType = Omit<IParameterDefType, 'id'> & { id: null };
