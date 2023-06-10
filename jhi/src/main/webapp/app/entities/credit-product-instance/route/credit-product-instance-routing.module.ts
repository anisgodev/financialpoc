import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CreditProductInstanceComponent } from '../list/credit-product-instance.component';
import { CreditProductInstanceDetailComponent } from '../detail/credit-product-instance-detail.component';
import { CreditProductInstanceUpdateComponent } from '../update/credit-product-instance-update.component';
import { CreditProductInstanceRoutingResolveService } from './credit-product-instance-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const creditProductInstanceRoute: Routes = [
  {
    path: '',
    component: CreditProductInstanceComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CreditProductInstanceDetailComponent,
    resolve: {
      creditProductInstance: CreditProductInstanceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CreditProductInstanceUpdateComponent,
    resolve: {
      creditProductInstance: CreditProductInstanceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CreditProductInstanceUpdateComponent,
    resolve: {
      creditProductInstance: CreditProductInstanceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(creditProductInstanceRoute)],
  exports: [RouterModule],
})
export class CreditProductInstanceRoutingModule {}
