import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICreditProduct, NewCreditProduct } from '../credit-product.model';

export type PartialUpdateCreditProduct = Partial<ICreditProduct> & Pick<ICreditProduct, 'id'>;

export type EntityResponseType = HttpResponse<ICreditProduct>;
export type EntityArrayResponseType = HttpResponse<ICreditProduct[]>;

@Injectable({ providedIn: 'root' })
export class CreditProductService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/credit-products');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(creditProduct: NewCreditProduct): Observable<EntityResponseType> {
    return this.http.post<ICreditProduct>(this.resourceUrl, creditProduct, { observe: 'response' });
  }

  update(creditProduct: ICreditProduct): Observable<EntityResponseType> {
    return this.http.put<ICreditProduct>(`${this.resourceUrl}/${this.getCreditProductIdentifier(creditProduct)}`, creditProduct, {
      observe: 'response',
    });
  }

  partialUpdate(creditProduct: PartialUpdateCreditProduct): Observable<EntityResponseType> {
    return this.http.patch<ICreditProduct>(`${this.resourceUrl}/${this.getCreditProductIdentifier(creditProduct)}`, creditProduct, {
      observe: 'response',
    });
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<ICreditProduct>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICreditProduct[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCreditProductIdentifier(creditProduct: Pick<ICreditProduct, 'id'>): string {
    return creditProduct.id;
  }

  compareCreditProduct(o1: Pick<ICreditProduct, 'id'> | null, o2: Pick<ICreditProduct, 'id'> | null): boolean {
    return o1 && o2 ? this.getCreditProductIdentifier(o1) === this.getCreditProductIdentifier(o2) : o1 === o2;
  }

  addCreditProductToCollectionIfMissing<Type extends Pick<ICreditProduct, 'id'>>(
    creditProductCollection: Type[],
    ...creditProductsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const creditProducts: Type[] = creditProductsToCheck.filter(isPresent);
    if (creditProducts.length > 0) {
      const creditProductCollectionIdentifiers = creditProductCollection.map(
        creditProductItem => this.getCreditProductIdentifier(creditProductItem)!
      );
      const creditProductsToAdd = creditProducts.filter(creditProductItem => {
        const creditProductIdentifier = this.getCreditProductIdentifier(creditProductItem);
        if (creditProductCollectionIdentifiers.includes(creditProductIdentifier)) {
          return false;
        }
        creditProductCollectionIdentifiers.push(creditProductIdentifier);
        return true;
      });
      return [...creditProductsToAdd, ...creditProductCollection];
    }
    return creditProductCollection;
  }
}
