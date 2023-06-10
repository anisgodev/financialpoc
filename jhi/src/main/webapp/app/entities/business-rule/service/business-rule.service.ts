import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IBusinessRule, NewBusinessRule } from '../business-rule.model';

export type PartialUpdateBusinessRule = Partial<IBusinessRule> & Pick<IBusinessRule, 'id'>;

export type EntityResponseType = HttpResponse<IBusinessRule>;
export type EntityArrayResponseType = HttpResponse<IBusinessRule[]>;

@Injectable({ providedIn: 'root' })
export class BusinessRuleService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/business-rules');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(businessRule: NewBusinessRule): Observable<EntityResponseType> {
    return this.http.post<IBusinessRule>(this.resourceUrl, businessRule, { observe: 'response' });
  }

  update(businessRule: IBusinessRule): Observable<EntityResponseType> {
    return this.http.put<IBusinessRule>(`${this.resourceUrl}/${this.getBusinessRuleIdentifier(businessRule)}`, businessRule, {
      observe: 'response',
    });
  }

  partialUpdate(businessRule: PartialUpdateBusinessRule): Observable<EntityResponseType> {
    return this.http.patch<IBusinessRule>(`${this.resourceUrl}/${this.getBusinessRuleIdentifier(businessRule)}`, businessRule, {
      observe: 'response',
    });
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<IBusinessRule>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IBusinessRule[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getBusinessRuleIdentifier(businessRule: Pick<IBusinessRule, 'id'>): string {
    return businessRule.id;
  }

  compareBusinessRule(o1: Pick<IBusinessRule, 'id'> | null, o2: Pick<IBusinessRule, 'id'> | null): boolean {
    return o1 && o2 ? this.getBusinessRuleIdentifier(o1) === this.getBusinessRuleIdentifier(o2) : o1 === o2;
  }

  addBusinessRuleToCollectionIfMissing<Type extends Pick<IBusinessRule, 'id'>>(
    businessRuleCollection: Type[],
    ...businessRulesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const businessRules: Type[] = businessRulesToCheck.filter(isPresent);
    if (businessRules.length > 0) {
      const businessRuleCollectionIdentifiers = businessRuleCollection.map(
        businessRuleItem => this.getBusinessRuleIdentifier(businessRuleItem)!
      );
      const businessRulesToAdd = businessRules.filter(businessRuleItem => {
        const businessRuleIdentifier = this.getBusinessRuleIdentifier(businessRuleItem);
        if (businessRuleCollectionIdentifiers.includes(businessRuleIdentifier)) {
          return false;
        }
        businessRuleCollectionIdentifiers.push(businessRuleIdentifier);
        return true;
      });
      return [...businessRulesToAdd, ...businessRuleCollection];
    }
    return businessRuleCollection;
  }
}
