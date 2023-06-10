import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IBusinessModel } from '../business-model.model';
import { BusinessModelService } from '../service/business-model.service';

@Injectable({ providedIn: 'root' })
export class BusinessModelRoutingResolveService implements Resolve<IBusinessModel | null> {
  constructor(protected service: BusinessModelService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IBusinessModel | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((businessModel: HttpResponse<IBusinessModel>) => {
          if (businessModel.body) {
            return of(businessModel.body);
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
