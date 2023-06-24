import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IParameterDefType } from '../parameter-def-type.model';
import { ParameterDefTypeService } from '../service/parameter-def-type.service';

@Injectable({ providedIn: 'root' })
export class ParameterDefTypeRoutingResolveService implements Resolve<IParameterDefType | null> {
  constructor(protected service: ParameterDefTypeService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IParameterDefType | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((parameterDefType: HttpResponse<IParameterDefType>) => {
          if (parameterDefType.body) {
            return of(parameterDefType.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
