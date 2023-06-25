import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IParameterDefType, NewParameterDefType } from '../parameter-def-type.model';

export type PartialUpdateParameterDefType = Partial<IParameterDefType> & Pick<IParameterDefType, 'id'>;

export type EntityResponseType = HttpResponse<IParameterDefType>;
export type EntityArrayResponseType = HttpResponse<IParameterDefType[]>;

@Injectable({ providedIn: 'root' })
export class ParameterDefTypeService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/parameter-def-types');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(parameterDefType: NewParameterDefType): Observable<EntityResponseType> {
    return this.http.post<IParameterDefType>(this.resourceUrl, parameterDefType, { observe: 'response' });
  }

  update(parameterDefType: IParameterDefType): Observable<EntityResponseType> {
    return this.http.put<IParameterDefType>(
      `${this.resourceUrl}/${this.getParameterDefTypeIdentifier(parameterDefType)}`,
      parameterDefType,
      { observe: 'response' }
    );
  }

  partialUpdate(parameterDefType: PartialUpdateParameterDefType): Observable<EntityResponseType> {
    return this.http.patch<IParameterDefType>(
      `${this.resourceUrl}/${this.getParameterDefTypeIdentifier(parameterDefType)}`,
      parameterDefType,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IParameterDefType>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IParameterDefType[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getParameterDefTypeIdentifier(parameterDefType: Pick<IParameterDefType, 'id'>): number {
    return parameterDefType.id;
  }

  compareParameterDefType(o1: Pick<IParameterDefType, 'id'> | null, o2: Pick<IParameterDefType, 'id'> | null): boolean {
    return o1 && o2 ? this.getParameterDefTypeIdentifier(o1) === this.getParameterDefTypeIdentifier(o2) : o1 === o2;
  }

  addParameterDefTypeToCollectionIfMissing<Type extends Pick<IParameterDefType, 'id'>>(
    parameterDefTypeCollection: Type[],
    ...parameterDefTypesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const parameterDefTypes: Type[] = parameterDefTypesToCheck.filter(isPresent);
    if (parameterDefTypes.length > 0) {
      const parameterDefTypeCollectionIdentifiers = parameterDefTypeCollection.map(
        parameterDefTypeItem => this.getParameterDefTypeIdentifier(parameterDefTypeItem)!
      );
      const parameterDefTypesToAdd = parameterDefTypes.filter(parameterDefTypeItem => {
        const parameterDefTypeIdentifier = this.getParameterDefTypeIdentifier(parameterDefTypeItem);
        if (parameterDefTypeCollectionIdentifiers.includes(parameterDefTypeIdentifier)) {
          return false;
        }
        parameterDefTypeCollectionIdentifiers.push(parameterDefTypeIdentifier);
        return true;
      });
      return [...parameterDefTypesToAdd, ...parameterDefTypeCollection];
    }
    return parameterDefTypeCollection;
  }
}
