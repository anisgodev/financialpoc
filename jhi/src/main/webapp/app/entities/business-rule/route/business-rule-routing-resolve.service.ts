import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IBusinessRule } from '../business-rule.model';
import { BusinessRuleService } from '../service/business-rule.service';

@Injectable({ providedIn: 'root' })
export class BusinessRuleRoutingResolveService implements Resolve<IBusinessRule | null> {
  constructor(protected service: BusinessRuleService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IBusinessRule | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((businessRule: HttpResponse<IBusinessRule>) => {
          if (businessRule.body) {
            return of(businessRule.body);
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
