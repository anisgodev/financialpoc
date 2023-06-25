import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IExpectedValue } from '../expected-value.model';
import { ExpectedValueService } from '../service/expected-value.service';

@Injectable({ providedIn: 'root' })
export class ExpectedValueRoutingResolveService implements Resolve<IExpectedValue | null> {
  constructor(protected service: ExpectedValueService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IExpectedValue | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((expectedValue: HttpResponse<IExpectedValue>) => {
          if (expectedValue.body) {
            return of(expectedValue.body);
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
