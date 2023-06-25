import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IExpectedValue, NewExpectedValue } from '../expected-value.model';

export type PartialUpdateExpectedValue = Partial<IExpectedValue> & Pick<IExpectedValue, 'id'>;

export type EntityResponseType = HttpResponse<IExpectedValue>;
export type EntityArrayResponseType = HttpResponse<IExpectedValue[]>;

@Injectable({ providedIn: 'root' })
export class ExpectedValueService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/expected-values');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(expectedValue: NewExpectedValue): Observable<EntityResponseType> {
    return this.http.post<IExpectedValue>(this.resourceUrl, expectedValue, { observe: 'response' });
  }

  update(expectedValue: IExpectedValue): Observable<EntityResponseType> {
    return this.http.put<IExpectedValue>(`${this.resourceUrl}/${this.getExpectedValueIdentifier(expectedValue)}`, expectedValue, {
      observe: 'response',
    });
  }

  partialUpdate(expectedValue: PartialUpdateExpectedValue): Observable<EntityResponseType> {
    return this.http.patch<IExpectedValue>(`${this.resourceUrl}/${this.getExpectedValueIdentifier(expectedValue)}`, expectedValue, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IExpectedValue>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IExpectedValue[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getExpectedValueIdentifier(expectedValue: Pick<IExpectedValue, 'id'>): number {
    return expectedValue.id;
  }

  compareExpectedValue(o1: Pick<IExpectedValue, 'id'> | null, o2: Pick<IExpectedValue, 'id'> | null): boolean {
    return o1 && o2 ? this.getExpectedValueIdentifier(o1) === this.getExpectedValueIdentifier(o2) : o1 === o2;
  }

  addExpectedValueToCollectionIfMissing<Type extends Pick<IExpectedValue, 'id'>>(
    expectedValueCollection: Type[],
    ...expectedValuesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const expectedValues: Type[] = expectedValuesToCheck.filter(isPresent);
    if (expectedValues.length > 0) {
      const expectedValueCollectionIdentifiers = expectedValueCollection.map(
        expectedValueItem => this.getExpectedValueIdentifier(expectedValueItem)!
      );
      const expectedValuesToAdd = expectedValues.filter(expectedValueItem => {
        const expectedValueIdentifier = this.getExpectedValueIdentifier(expectedValueItem);
        if (expectedValueCollectionIdentifiers.includes(expectedValueIdentifier)) {
          return false;
        }
        expectedValueCollectionIdentifiers.push(expectedValueIdentifier);
        return true;
      });
      return [...expectedValuesToAdd, ...expectedValueCollection];
    }
    return expectedValueCollection;
  }
}
