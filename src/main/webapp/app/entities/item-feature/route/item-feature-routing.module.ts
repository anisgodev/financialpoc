import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ItemFeatureComponent } from '../list/item-feature.component';
import { ItemFeatureDetailComponent } from '../detail/item-feature-detail.component';
import { ItemFeatureUpdateComponent } from '../update/item-feature-update.component';
import { ItemFeatureRoutingResolveService } from './item-feature-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const itemFeatureRoute: Routes = [
  {
    path: '',
    component: ItemFeatureComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ItemFeatureDetailComponent,
    resolve: {
      itemFeature: ItemFeatureRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ItemFeatureUpdateComponent,
    resolve: {
      itemFeature: ItemFeatureRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ItemFeatureUpdateComponent,
    resolve: {
      itemFeature: ItemFeatureRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(itemFeatureRoute)],
  exports: [RouterModule],
})
export class ItemFeatureRoutingModule {}
