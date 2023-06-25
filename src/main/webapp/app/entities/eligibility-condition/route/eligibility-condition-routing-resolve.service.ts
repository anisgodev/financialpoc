import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEligibilityCondition } from '../eligibility-condition.model';
import { EligibilityConditionService } from '../service/eligibility-condition.service';

@Injectable({ providedIn: 'root' })
export class EligibilityConditionRoutingResolveService implements Resolve<IEligibilityCondition | null> {
  constructor(protected service: EligibilityConditionService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IEligibilityCondition | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((eligibilityCondition: HttpResponse<IEligibilityCondition>) => {
          if (eligibilityCondition.body) {
            return of(eligibilityCondition.body);
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
