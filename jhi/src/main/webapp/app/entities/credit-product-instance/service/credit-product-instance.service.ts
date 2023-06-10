import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICreditProductInstance, NewCreditProductInstance } from '../credit-product-instance.model';

export type PartialUpdateCreditProductInstance = Partial<ICreditProductInstance> & Pick<ICreditProductInstance, 'id'>;

export type EntityResponseType = HttpResponse<ICreditProductInstance>;
export type EntityArrayResponseType = HttpResponse<ICreditProductInstance[]>;

@Injectable({ providedIn: 'root' })
export class CreditProductInstanceService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/credit-product-instances');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(creditProductInstance: NewCreditProductInstance): Observable<EntityResponseType> {
    return this.http.post<ICreditProductInstance>(this.resourceUrl, creditProductInstance, { observe: 'response' });
  }

  update(creditProductInstance: ICreditProductInstance): Observable<EntityResponseType> {
    return this.http.put<ICreditProductInstance>(
      `${this.resourceUrl}/${this.getCreditProductInstanceIdentifier(creditProductInstance)}`,
      creditProductInstance,
      { observe: 'response' }
    );
  }

  partialUpdate(creditProductInstance: PartialUpdateCreditProductInstance): Observable<EntityResponseType> {
    return this.http.patch<ICreditProductInstance>(
      `${this.resourceUrl}/${this.getCreditProductInstanceIdentifier(creditProductInstance)}`,
      creditProductInstance,
      { observe: 'response' }
    );
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<ICreditProductInstance>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICreditProductInstance[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCreditProductInstanceIdentifier(creditProductInstance: Pick<ICreditProductInstance, 'id'>): string {
    return creditProductInstance.id;
  }

  compareCreditProductInstance(o1: Pick<ICreditProductInstance, 'id'> | null, o2: Pick<ICreditProductInstance, 'id'> | null): boolean {
    return o1 && o2 ? this.getCreditProductInstanceIdentifier(o1) === this.getCreditProductInstanceIdentifier(o2) : o1 === o2;
  }

  addCreditProductInstanceToCollectionIfMissing<Type extends Pick<ICreditProductInstance, 'id'>>(
    creditProductInstanceCollection: Type[],
    ...creditProductInstancesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const creditProductInstances: Type[] = creditProductInstancesToCheck.filter(isPresent);
    if (creditProductInstances.length > 0) {
      const creditProductInstanceCollectionIdentifiers = creditProductInstanceCollection.map(
        creditProductInstanceItem => this.getCreditProductInstanceIdentifier(creditProductInstanceItem)!
      );
      const creditProductInstancesToAdd = creditProductInstances.filter(creditProductInstanceItem => {
        const creditProductInstanceIdentifier = this.getCreditProductInstanceIdentifier(creditProductInstanceItem);
        if (creditProductInstanceCollectionIdentifiers.includes(creditProductInstanceIdentifier)) {
          return false;
        }
        creditProductInstanceCollectionIdentifiers.push(creditProductInstanceIdentifier);
        return true;
      });
      return [...creditProductInstancesToAdd, ...creditProductInstanceCollection];
    }
    return creditProductInstanceCollection;
  }
}
