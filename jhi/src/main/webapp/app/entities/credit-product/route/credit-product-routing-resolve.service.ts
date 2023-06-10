import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICreditProduct } from '../credit-product.model';
import { CreditProductService } from '../service/credit-product.service';

@Injectable({ providedIn: 'root' })
export class CreditProductRoutingResolveService implements Resolve<ICreditProduct | null> {
  constructor(protected service: CreditProductService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICreditProduct | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((creditProduct: HttpResponse<ICreditProduct>) => {
          if (creditProduct.body) {
            return of(creditProduct.body);
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
