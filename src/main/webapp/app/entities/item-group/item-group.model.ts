export interface IItemGroup {
  id: number;
  itemGroupName?: string | null;
  itemGroupDescription?: string | null;
}

export type NewItemGroup = Omit<IItemGroup, 'id'> & { id: null };
