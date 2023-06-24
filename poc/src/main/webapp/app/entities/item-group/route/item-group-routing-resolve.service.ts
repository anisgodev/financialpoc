import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IItemGroup } from '../item-group.model';
import { ItemGroupService } from '../service/item-group.service';

@Injectable({ providedIn: 'root' })
export class ItemGroupRoutingResolveService implements Resolve<IItemGroup | null> {
  constructor(protected service: ItemGroupService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IItemGroup | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((itemGroup: HttpResponse<IItemGroup>) => {
          if (itemGroup.body) {
            return of(itemGroup.body);
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
