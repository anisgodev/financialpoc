import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IProductItemType, NewProductItemType } from '../product-item-type.model';

export type PartialUpdateProductItemType = Partial<IProductItemType> & Pick<IProductItemType, 'id'>;

export type EntityResponseType = HttpResponse<IProductItemType>;
export type EntityArrayResponseType = HttpResponse<IProductItemType[]>;

@Injectable({ providedIn: 'root' })
export class ProductItemTypeService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/product-item-types');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(productItemType: NewProductItemType): Observable<EntityResponseType> {
    return this.http.post<IProductItemType>(this.resourceUrl, productItemType, { observe: 'response' });
  }

  update(productItemType: IProductItemType): Observable<EntityResponseType> {
    return this.http.put<IProductItemType>(`${this.resourceUrl}/${this.getProductItemTypeIdentifier(productItemType)}`, productItemType, {
      observe: 'response',
    });
  }

  partialUpdate(productItemType: PartialUpdateProductItemType): Observable<EntityResponseType> {
    return this.http.patch<IProductItemType>(`${this.resourceUrl}/${this.getProductItemTypeIdentifier(productItemType)}`, productItemType, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IProductItemType>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IProductItemType[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getProductItemTypeIdentifier(productItemType: Pick<IProductItemType, 'id'>): number {
    return productItemType.id;
  }

  compareProductItemType(o1: Pick<IProductItemType, 'id'> | null, o2: Pick<IProductItemType, 'id'> | null): boolean {
    return o1 && o2 ? this.getProductItemTypeIdentifier(o1) === this.getProductItemTypeIdentifier(o2) : o1 === o2;
  }

  addProductItemTypeToCollectionIfMissing<Type extends Pick<IProductItemType, 'id'>>(
    productItemTypeCollection: Type[],
    ...productItemTypesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const productItemTypes: Type[] = productItemTypesToCheck.filter(isPresent);
    if (productItemTypes.length > 0) {
      const productItemTypeCollectionIdentifiers = productItemTypeCollection.map(
        productItemTypeItem => this.getProductItemTypeIdentifier(productItemTypeItem)!
      );
      const productItemTypesToAdd = productItemTypes.filter(productItemTypeItem => {
        const productItemTypeIdentifier = this.getProductItemTypeIdentifier(productItemTypeItem);
        if (productItemTypeCollectionIdentifiers.includes(productItemTypeIdentifier)) {
          return false;
        }
        productItemTypeCollectionIdentifiers.push(productItemTypeIdentifier);
        return true;
      });
      return [...productItemTypesToAdd, ...productItemTypeCollection];
    }
    return productItemTypeCollection;
  }
}
