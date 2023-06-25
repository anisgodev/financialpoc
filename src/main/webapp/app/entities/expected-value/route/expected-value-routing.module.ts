import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ExpectedValueComponent } from '../list/expected-value.component';
import { ExpectedValueDetailComponent } from '../detail/expected-value-detail.component';
import { ExpectedValueUpdateComponent } from '../update/expected-value-update.component';
import { ExpectedValueRoutingResolveService } from './expected-value-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const expectedValueRoute: Routes = [
  {
    path: '',
    component: ExpectedValueComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ExpectedValueDetailComponent,
    resolve: {
      expectedValue: ExpectedValueRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ExpectedValueUpdateComponent,
    resolve: {
      expectedValue: ExpectedValueRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ExpectedValueUpdateComponent,
    resolve: {
      expectedValue: ExpectedValueRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(expectedValueRoute)],
  exports: [RouterModule],
})
export class ExpectedValueRoutingModule {}
