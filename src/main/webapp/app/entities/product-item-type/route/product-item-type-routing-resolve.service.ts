import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IProductItemType } from '../product-item-type.model';
import { ProductItemTypeService } from '../service/product-item-type.service';

@Injectable({ providedIn: 'root' })
export class ProductItemTypeRoutingResolveService implements Resolve<IProductItemType | null> {
  constructor(protected service: ProductItemTypeService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IProductItemType | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((productItemType: HttpResponse<IProductItemType>) => {
          if (productItemType.body) {
            return of(productItemType.body);
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
