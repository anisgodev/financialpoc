import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICondition, NewCondition } from '../condition.model';

export type PartialUpdateCondition = Partial<ICondition> & Pick<ICondition, 'id'>;

export type EntityResponseType = HttpResponse<ICondition>;
export type EntityArrayResponseType = HttpResponse<ICondition[]>;

@Injectable({ providedIn: 'root' })
export class ConditionService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/conditions');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(condition: NewCondition): Observable<EntityResponseType> {
    return this.http.post<ICondition>(this.resourceUrl, condition, { observe: 'response' });
  }

  update(condition: ICondition): Observable<EntityResponseType> {
    return this.http.put<ICondition>(`${this.resourceUrl}/${this.getConditionIdentifier(condition)}`, condition, { observe: 'response' });
  }

  partialUpdate(condition: PartialUpdateCondition): Observable<EntityResponseType> {
    return this.http.patch<ICondition>(`${this.resourceUrl}/${this.getConditionIdentifier(condition)}`, condition, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICondition>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICondition[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getConditionIdentifier(condition: Pick<ICondition, 'id'>): number {
    return condition.id;
  }

  compareCondition(o1: Pick<ICondition, 'id'> | null, o2: Pick<ICondition, 'id'> | null): boolean {
    return o1 && o2 ? this.getConditionIdentifier(o1) === this.getConditionIdentifier(o2) : o1 === o2;
  }

  addConditionToCollectionIfMissing<Type extends Pick<ICondition, 'id'>>(
    conditionCollection: Type[],
    ...conditionsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const conditions: Type[] = conditionsToCheck.filter(isPresent);
    if (conditions.length > 0) {
      const conditionCollectionIdentifiers = conditionCollection.map(conditionItem => this.getConditionIdentifier(conditionItem)!);
      const conditionsToAdd = conditions.filter(conditionItem => {
        const conditionIdentifier = this.getConditionIdentifier(conditionItem);
        if (conditionCollectionIdentifiers.includes(conditionIdentifier)) {
          return false;
        }
        conditionCollectionIdentifiers.push(conditionIdentifier);
        return true;
      });
      return [...conditionsToAdd, ...conditionCollection];
    }
    return conditionCollection;
  }
}
