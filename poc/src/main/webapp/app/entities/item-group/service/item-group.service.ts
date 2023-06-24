import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IItemGroup, NewItemGroup } from '../item-group.model';

export type PartialUpdateItemGroup = Partial<IItemGroup> & Pick<IItemGroup, 'id'>;

export type EntityResponseType = HttpResponse<IItemGroup>;
export type EntityArrayResponseType = HttpResponse<IItemGroup[]>;

@Injectable({ providedIn: 'root' })
export class ItemGroupService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/item-groups');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(itemGroup: NewItemGroup): Observable<EntityResponseType> {
    return this.http.post<IItemGroup>(this.resourceUrl, itemGroup, { observe: 'response' });
  }

  update(itemGroup: IItemGroup): Observable<EntityResponseType> {
    return this.http.put<IItemGroup>(`${this.resourceUrl}/${this.getItemGroupIdentifier(itemGroup)}`, itemGroup, { observe: 'response' });
  }

  partialUpdate(itemGroup: PartialUpdateItemGroup): Observable<EntityResponseType> {
    return this.http.patch<IItemGroup>(`${this.resourceUrl}/${this.getItemGroupIdentifier(itemGroup)}`, itemGroup, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IItemGroup>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IItemGroup[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getItemGroupIdentifier(itemGroup: Pick<IItemGroup, 'id'>): number {
    return itemGroup.id;
  }

  compareItemGroup(o1: Pick<IItemGroup, 'id'> | null, o2: Pick<IItemGroup, 'id'> | null): boolean {
    return o1 && o2 ? this.getItemGroupIdentifier(o1) === this.getItemGroupIdentifier(o2) : o1 === o2;
  }

  addItemGroupToCollectionIfMissing<Type extends Pick<IItemGroup, 'id'>>(
    itemGroupCollection: Type[],
    ...itemGroupsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const itemGroups: Type[] = itemGroupsToCheck.filter(isPresent);
    if (itemGroups.length > 0) {
      const itemGroupCollectionIdentifiers = itemGroupCollection.map(itemGroupItem => this.getItemGroupIdentifier(itemGroupItem)!);
      const itemGroupsToAdd = itemGroups.filter(itemGroupItem => {
        const itemGroupIdentifier = this.getItemGroupIdentifier(itemGroupItem);
        if (itemGroupCollectionIdentifiers.includes(itemGroupIdentifier)) {
          return false;
        }
        itemGroupCollectionIdentifiers.push(itemGroupIdentifier);
        return true;
      });
      return [...itemGroupsToAdd, ...itemGroupCollection];
    }
    return itemGroupCollection;
  }
}
