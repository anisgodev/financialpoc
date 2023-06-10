import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IBusinessModel, NewBusinessModel } from '../business-model.model';

export type PartialUpdateBusinessModel = Partial<IBusinessModel> & Pick<IBusinessModel, 'id'>;

export type EntityResponseType = HttpResponse<IBusinessModel>;
export type EntityArrayResponseType = HttpResponse<IBusinessModel[]>;

@Injectable({ providedIn: 'root' })
export class BusinessModelService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/business-models');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(businessModel: NewBusinessModel): Observable<EntityResponseType> {
    return this.http.post<IBusinessModel>(this.resourceUrl, businessModel, { observe: 'response' });
  }

  update(businessModel: IBusinessModel): Observable<EntityResponseType> {
    return this.http.put<IBusinessModel>(`${this.resourceUrl}/${this.getBusinessModelIdentifier(businessModel)}`, businessModel, {
      observe: 'response',
    });
  }

  partialUpdate(businessModel: PartialUpdateBusinessModel): Observable<EntityResponseType> {
    return this.http.patch<IBusinessModel>(`${this.resourceUrl}/${this.getBusinessModelIdentifier(businessModel)}`, businessModel, {
      observe: 'response',
    });
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<IBusinessModel>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IBusinessModel[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getBusinessModelIdentifier(businessModel: Pick<IBusinessModel, 'id'>): string {
    return businessModel.id;
  }

  compareBusinessModel(o1: Pick<IBusinessModel, 'id'> | null, o2: Pick<IBusinessModel, 'id'> | null): boolean {
    return o1 && o2 ? this.getBusinessModelIdentifier(o1) === this.getBusinessModelIdentifier(o2) : o1 === o2;
  }

  addBusinessModelToCollectionIfMissing<Type extends Pick<IBusinessModel, 'id'>>(
    businessModelCollection: Type[],
    ...businessModelsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const businessModels: Type[] = businessModelsToCheck.filter(isPresent);
    if (businessModels.length > 0) {
      const businessModelCollectionIdentifiers = businessModelCollection.map(
        businessModelItem => this.getBusinessModelIdentifier(businessModelItem)!
      );
      const businessModelsToAdd = businessModels.filter(businessModelItem => {
        const businessModelIdentifier = this.getBusinessModelIdentifier(businessModelItem);
        if (businessModelCollectionIdentifiers.includes(businessModelIdentifier)) {
          return false;
        }
        businessModelCollectionIdentifiers.push(businessModelIdentifier);
        return true;
      });
      return [...businessModelsToAdd, ...businessModelCollection];
    }
    return businessModelCollection;
  }
}
