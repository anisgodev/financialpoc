import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISimulation, NewSimulation } from '../simulation.model';

export type PartialUpdateSimulation = Partial<ISimulation> & Pick<ISimulation, 'id'>;

export type EntityResponseType = HttpResponse<ISimulation>;
export type EntityArrayResponseType = HttpResponse<ISimulation[]>;

@Injectable({ providedIn: 'root' })
export class SimulationService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/simulations');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(simulation: NewSimulation): Observable<EntityResponseType> {
    return this.http.post<ISimulation>(this.resourceUrl, simulation, { observe: 'response' });
  }

  update(simulation: ISimulation): Observable<EntityResponseType> {
    return this.http.put<ISimulation>(`${this.resourceUrl}/${this.getSimulationIdentifier(simulation)}`, simulation, {
      observe: 'response',
    });
  }

  partialUpdate(simulation: PartialUpdateSimulation): Observable<EntityResponseType> {
    return this.http.patch<ISimulation>(`${this.resourceUrl}/${this.getSimulationIdentifier(simulation)}`, simulation, {
      observe: 'response',
    });
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<ISimulation>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISimulation[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getSimulationIdentifier(simulation: Pick<ISimulation, 'id'>): string {
    return simulation.id;
  }

  compareSimulation(o1: Pick<ISimulation, 'id'> | null, o2: Pick<ISimulation, 'id'> | null): boolean {
    return o1 && o2 ? this.getSimulationIdentifier(o1) === this.getSimulationIdentifier(o2) : o1 === o2;
  }

  addSimulationToCollectionIfMissing<Type extends Pick<ISimulation, 'id'>>(
    simulationCollection: Type[],
    ...simulationsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const simulations: Type[] = simulationsToCheck.filter(isPresent);
    if (simulations.length > 0) {
      const simulationCollectionIdentifiers = simulationCollection.map(simulationItem => this.getSimulationIdentifier(simulationItem)!);
      const simulationsToAdd = simulations.filter(simulationItem => {
        const simulationIdentifier = this.getSimulationIdentifier(simulationItem);
        if (simulationCollectionIdentifiers.includes(simulationIdentifier)) {
          return false;
        }
        simulationCollectionIdentifiers.push(simulationIdentifier);
        return true;
      });
      return [...simulationsToAdd, ...simulationCollection];
    }
    return simulationCollection;
  }
}
