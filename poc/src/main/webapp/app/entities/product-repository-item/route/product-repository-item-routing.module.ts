import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ProductRepositoryItemComponent } from '../list/product-repository-item.component';
import { ProductRepositoryItemDetailComponent } from '../detail/product-repository-item-detail.component';
import { ProductRepositoryItemUpdateComponent } from '../update/product-repository-item-update.component';
import { ProductRepositoryItemRoutingResolveService } from './product-repository-item-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const productRepositoryItemRoute: Routes = [
  {
    path: '',
    component: ProductRepositoryItemComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ProductRepositoryItemDetailComponent,
    resolve: {
      productRepositoryItem: ProductRepositoryItemRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ProductRepositoryItemUpdateComponent,
    resolve: {
      productRepositoryItem: ProductRepositoryItemRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ProductRepositoryItemUpdateComponent,
    resolve: {
      productRepositoryItem: ProductRepositoryItemRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(productRepositoryItemRoute)],
  exports: [RouterModule],
})
export class ProductRepositoryItemRoutingModule {}
