import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IProductRepositoryItem } from '../product-repository-item.model';
import { ProductRepositoryItemService } from '../service/product-repository-item.service';

@Injectable({ providedIn: 'root' })
export class ProductRepositoryItemRoutingResolveService implements Resolve<IProductRepositoryItem | null> {
  constructor(protected service: ProductRepositoryItemService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IProductRepositoryItem | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((productRepositoryItem: HttpResponse<IProductRepositoryItem>) => {
          if (productRepositoryItem.body) {
            return of(productRepositoryItem.body);
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
