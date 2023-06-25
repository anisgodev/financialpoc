import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IEligibilityCondition, NewEligibilityCondition } from '../eligibility-condition.model';

export type PartialUpdateEligibilityCondition = Partial<IEligibilityCondition> & Pick<IEligibilityCondition, 'id'>;

export type EntityResponseType = HttpResponse<IEligibilityCondition>;
export type EntityArrayResponseType = HttpResponse<IEligibilityCondition[]>;

@Injectable({ providedIn: 'root' })
export class EligibilityConditionService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/eligibility-conditions');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(eligibilityCondition: NewEligibilityCondition): Observable<EntityResponseType> {
    return this.http.post<IEligibilityCondition>(this.resourceUrl, eligibilityCondition, { observe: 'response' });
  }

  update(eligibilityCondition: IEligibilityCondition): Observable<EntityResponseType> {
    return this.http.put<IEligibilityCondition>(
      `${this.resourceUrl}/${this.getEligibilityConditionIdentifier(eligibilityCondition)}`,
      eligibilityCondition,
      { observe: 'response' }
    );
  }

  partialUpdate(eligibilityCondition: PartialUpdateEligibilityCondition): Observable<EntityResponseType> {
    return this.http.patch<IEligibilityCondition>(
      `${this.resourceUrl}/${this.getEligibilityConditionIdentifier(eligibilityCondition)}`,
      eligibilityCondition,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IEligibilityCondition>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IEligibilityCondition[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getEligibilityConditionIdentifier(eligibilityCondition: Pick<IEligibilityCondition, 'id'>): number {
    return eligibilityCondition.id;
  }

  compareEligibilityCondition(o1: Pick<IEligibilityCondition, 'id'> | null, o2: Pick<IEligibilityCondition, 'id'> | null): boolean {
    return o1 && o2 ? this.getEligibilityConditionIdentifier(o1) === this.getEligibilityConditionIdentifier(o2) : o1 === o2;
  }

  addEligibilityConditionToCollectionIfMissing<Type extends Pick<IEligibilityCondition, 'id'>>(
    eligibilityConditionCollection: Type[],
    ...eligibilityConditionsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const eligibilityConditions: Type[] = eligibilityConditionsToCheck.filter(isPresent);
    if (eligibilityConditions.length > 0) {
      const eligibilityConditionCollectionIdentifiers = eligibilityConditionCollection.map(
        eligibilityConditionItem => this.getEligibilityConditionIdentifier(eligibilityConditionItem)!
      );
      const eligibilityConditionsToAdd = eligibilityConditions.filter(eligibilityConditionItem => {
        const eligibilityConditionIdentifier = this.getEligibilityConditionIdentifier(eligibilityConditionItem);
        if (eligibilityConditionCollectionIdentifiers.includes(eligibilityConditionIdentifier)) {
          return false;
        }
        eligibilityConditionCollectionIdentifiers.push(eligibilityConditionIdentifier);
        return true;
      });
      return [...eligibilityConditionsToAdd, ...eligibilityConditionCollection];
    }
    return eligibilityConditionCollection;
  }
}
