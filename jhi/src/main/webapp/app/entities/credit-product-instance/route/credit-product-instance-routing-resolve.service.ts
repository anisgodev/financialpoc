import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICreditProductInstance } from '../credit-product-instance.model';
import { CreditProductInstanceService } from '../service/credit-product-instance.service';

@Injectable({ providedIn: 'root' })
export class CreditProductInstanceRoutingResolveService implements Resolve<ICreditProductInstance | null> {
  constructor(protected service: CreditProductInstanceService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICreditProductInstance | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((creditProductInstance: HttpResponse<ICreditProductInstance>) => {
          if (creditProductInstance.body) {
            return of(creditProductInstance.body);
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
