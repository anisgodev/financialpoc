import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IProductRepositoryItem, NewProductRepositoryItem } from '../product-repository-item.model';

export type PartialUpdateProductRepositoryItem = Partial<IProductRepositoryItem> & Pick<IProductRepositoryItem, 'id'>;

export type EntityResponseType = HttpResponse<IProductRepositoryItem>;
export type EntityArrayResponseType = HttpResponse<IProductRepositoryItem[]>;

@Injectable({ providedIn: 'root' })
export class ProductRepositoryItemService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/product-repository-items');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(productRepositoryItem: NewProductRepositoryItem): Observable<EntityResponseType> {
    return this.http.post<IProductRepositoryItem>(this.resourceUrl, productRepositoryItem, { observe: 'response' });
  }

  update(productRepositoryItem: IProductRepositoryItem): Observable<EntityResponseType> {
    return this.http.put<IProductRepositoryItem>(
      `${this.resourceUrl}/${this.getProductRepositoryItemIdentifier(productRepositoryItem)}`,
      productRepositoryItem,
      { observe: 'response' }
    );
  }

  partialUpdate(productRepositoryItem: PartialUpdateProductRepositoryItem): Observable<EntityResponseType> {
    return this.http.patch<IProductRepositoryItem>(
      `${this.resourceUrl}/${this.getProductRepositoryItemIdentifier(productRepositoryItem)}`,
      productRepositoryItem,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IProductRepositoryItem>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IProductRepositoryItem[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getProductRepositoryItemIdentifier(productRepositoryItem: Pick<IProductRepositoryItem, 'id'>): number {
    return productRepositoryItem.id;
  }

  compareProductRepositoryItem(o1: Pick<IProductRepositoryItem, 'id'> | null, o2: Pick<IProductRepositoryItem, 'id'> | null): boolean {
    return o1 && o2 ? this.getProductRepositoryItemIdentifier(o1) === this.getProductRepositoryItemIdentifier(o2) : o1 === o2;
  }

  addProductRepositoryItemToCollectionIfMissing<Type extends Pick<IProductRepositoryItem, 'id'>>(
    productRepositoryItemCollection: Type[],
    ...productRepositoryItemsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const productRepositoryItems: Type[] = productRepositoryItemsToCheck.filter(isPresent);
    if (productRepositoryItems.length > 0) {
      const productRepositoryItemCollectionIdentifiers = productRepositoryItemCollection.map(
        productRepositoryItemItem => this.getProductRepositoryItemIdentifier(productRepositoryItemItem)!
      );
      const productRepositoryItemsToAdd = productRepositoryItems.filter(productRepositoryItemItem => {
        const productRepositoryItemIdentifier = this.getProductRepositoryItemIdentifier(productRepositoryItemItem);
        if (productRepositoryItemCollectionIdentifiers.includes(productRepositoryItemIdentifier)) {
          return false;
        }
        productRepositoryItemCollectionIdentifiers.push(productRepositoryItemIdentifier);
        return true;
      });
      return [...productRepositoryItemsToAdd, ...productRepositoryItemCollection];
    }
    return productRepositoryItemCollection;
  }
}
