import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CreditProductComponent } from '../list/credit-product.component';
import { CreditProductDetailComponent } from '../detail/credit-product-detail.component';
import { CreditProductUpdateComponent } from '../update/credit-product-update.component';
import { CreditProductRoutingResolveService } from './credit-product-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const creditProductRoute: Routes = [
  {
    path: '',
    component: CreditProductComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CreditProductDetailComponent,
    resolve: {
      creditProduct: CreditProductRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CreditProductUpdateComponent,
    resolve: {
      creditProduct: CreditProductRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CreditProductUpdateComponent,
    resolve: {
      creditProduct: CreditProductRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(creditProductRoute)],
  exports: [RouterModule],
})
export class CreditProductRoutingModule {}
