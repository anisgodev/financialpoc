import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ProductItemTypeComponent } from '../list/product-item-type.component';
import { ProductItemTypeDetailComponent } from '../detail/product-item-type-detail.component';
import { ProductItemTypeUpdateComponent } from '../update/product-item-type-update.component';
import { ProductItemTypeRoutingResolveService } from './product-item-type-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const productItemTypeRoute: Routes = [
  {
    path: '',
    component: ProductItemTypeComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ProductItemTypeDetailComponent,
    resolve: {
      productItemType: ProductItemTypeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ProductItemTypeUpdateComponent,
    resolve: {
      productItemType: ProductItemTypeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ProductItemTypeUpdateComponent,
    resolve: {
      productItemType: ProductItemTypeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(productItemTypeRoute)],
  exports: [RouterModule],
})
export class ProductItemTypeRoutingModule {}
