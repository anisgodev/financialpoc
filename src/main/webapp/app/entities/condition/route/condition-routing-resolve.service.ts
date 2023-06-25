import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICondition } from '../condition.model';
import { ConditionService } from '../service/condition.service';

@Injectable({ providedIn: 'root' })
export class ConditionRoutingResolveService implements Resolve<ICondition | null> {
  constructor(protected service: ConditionService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICondition | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((condition: HttpResponse<ICondition>) => {
          if (condition.body) {
            return of(condition.body);
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
