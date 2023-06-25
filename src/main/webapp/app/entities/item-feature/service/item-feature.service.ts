import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IItemFeature, NewItemFeature } from '../item-feature.model';

export type PartialUpdateItemFeature = Partial<IItemFeature> & Pick<IItemFeature, 'id'>;

export type EntityResponseType = HttpResponse<IItemFeature>;
export type EntityArrayResponseType = HttpResponse<IItemFeature[]>;

@Injectable({ providedIn: 'root' })
export class ItemFeatureService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/item-features');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(itemFeature: NewItemFeature): Observable<EntityResponseType> {
    return this.http.post<IItemFeature>(this.resourceUrl, itemFeature, { observe: 'response' });
  }

  update(itemFeature: IItemFeature): Observable<EntityResponseType> {
    return this.http.put<IItemFeature>(`${this.resourceUrl}/${this.getItemFeatureIdentifier(itemFeature)}`, itemFeature, {
      observe: 'response',
    });
  }

  partialUpdate(itemFeature: PartialUpdateItemFeature): Observable<EntityResponseType> {
    return this.http.patch<IItemFeature>(`${this.resourceUrl}/${this.getItemFeatureIdentifier(itemFeature)}`, itemFeature, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IItemFeature>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IItemFeature[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getItemFeatureIdentifier(itemFeature: Pick<IItemFeature, 'id'>): number {
    return itemFeature.id;
  }

  compareItemFeature(o1: Pick<IItemFeature, 'id'> | null, o2: Pick<IItemFeature, 'id'> | null): boolean {
    return o1 && o2 ? this.getItemFeatureIdentifier(o1) === this.getItemFeatureIdentifier(o2) : o1 === o2;
  }

  addItemFeatureToCollectionIfMissing<Type extends Pick<IItemFeature, 'id'>>(
    itemFeatureCollection: Type[],
    ...itemFeaturesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const itemFeatures: Type[] = itemFeaturesToCheck.filter(isPresent);
    if (itemFeatures.length > 0) {
      const itemFeatureCollectionIdentifiers = itemFeatureCollection.map(
        itemFeatureItem => this.getItemFeatureIdentifier(itemFeatureItem)!
      );
      const itemFeaturesToAdd = itemFeatures.filter(itemFeatureItem => {
        const itemFeatureIdentifier = this.getItemFeatureIdentifier(itemFeatureItem);
        if (itemFeatureCollectionIdentifiers.includes(itemFeatureIdentifier)) {
          return false;
        }
        itemFeatureCollectionIdentifiers.push(itemFeatureIdentifier);
        return true;
      });
      return [...itemFeaturesToAdd, ...itemFeatureCollection];
    }
    return itemFeatureCollection;
  }
}
