import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IBusinessRuleCondition, NewBusinessRuleCondition } from '../business-rule-condition.model';

export type PartialUpdateBusinessRuleCondition = Partial<IBusinessRuleCondition> & Pick<IBusinessRuleCondition, 'id'>;

export type EntityResponseType = HttpResponse<IBusinessRuleCondition>;
export type EntityArrayResponseType = HttpResponse<IBusinessRuleCondition[]>;

@Injectable({ providedIn: 'root' })
export class BusinessRuleConditionService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/business-rule-conditions');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(businessRuleCondition: NewBusinessRuleCondition): Observable<EntityResponseType> {
    return this.http.post<IBusinessRuleCondition>(this.resourceUrl, businessRuleCondition, { observe: 'response' });
  }

  update(businessRuleCondition: IBusinessRuleCondition): Observable<EntityResponseType> {
    return this.http.put<IBusinessRuleCondition>(
      `${this.resourceUrl}/${this.getBusinessRuleConditionIdentifier(businessRuleCondition)}`,
      businessRuleCondition,
      { observe: 'response' }
    );
  }

  partialUpdate(businessRuleCondition: PartialUpdateBusinessRuleCondition): Observable<EntityResponseType> {
    return this.http.patch<IBusinessRuleCondition>(
      `${this.resourceUrl}/${this.getBusinessRuleConditionIdentifier(businessRuleCondition)}`,
      businessRuleCondition,
      { observe: 'response' }
    );
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<IBusinessRuleCondition>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IBusinessRuleCondition[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getBusinessRuleConditionIdentifier(businessRuleCondition: Pick<IBusinessRuleCondition, 'id'>): string {
    return businessRuleCondition.id;
  }

  compareBusinessRuleCondition(o1: Pick<IBusinessRuleCondition, 'id'> | null, o2: Pick<IBusinessRuleCondition, 'id'> | null): boolean {
    return o1 && o2 ? this.getBusinessRuleConditionIdentifier(o1) === this.getBusinessRuleConditionIdentifier(o2) : o1 === o2;
  }

  addBusinessRuleConditionToCollectionIfMissing<Type extends Pick<IBusinessRuleCondition, 'id'>>(
    businessRuleConditionCollection: Type[],
    ...businessRuleConditionsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const businessRuleConditions: Type[] = businessRuleConditionsToCheck.filter(isPresent);
    if (businessRuleConditions.length > 0) {
      const businessRuleConditionCollectionIdentifiers = businessRuleConditionCollection.map(
        businessRuleConditionItem => this.getBusinessRuleConditionIdentifier(businessRuleConditionItem)!
      );
      const businessRuleConditionsToAdd = businessRuleConditions.filter(businessRuleConditionItem => {
        const businessRuleConditionIdentifier = this.getBusinessRuleConditionIdentifier(businessRuleConditionItem);
        if (businessRuleConditionCollectionIdentifiers.includes(businessRuleConditionIdentifier)) {
          return false;
        }
        businessRuleConditionCollectionIdentifiers.push(businessRuleConditionIdentifier);
        return true;
      });
      return [...businessRuleConditionsToAdd, ...businessRuleConditionCollection];
    }
    return businessRuleConditionCollection;
  }
}
