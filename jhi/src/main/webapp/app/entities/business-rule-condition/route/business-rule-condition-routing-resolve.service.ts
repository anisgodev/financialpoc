import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IBusinessRuleCondition } from '../business-rule-condition.model';
import { BusinessRuleConditionService } from '../service/business-rule-condition.service';

@Injectable({ providedIn: 'root' })
export class BusinessRuleConditionRoutingResolveService implements Resolve<IBusinessRuleCondition | null> {
  constructor(protected service: BusinessRuleConditionService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IBusinessRuleCondition | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((businessRuleCondition: HttpResponse<IBusinessRuleCondition>) => {
          if (businessRuleCondition.body) {
            return of(businessRuleCondition.body);
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
