import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ItemGroupComponent } from '../list/item-group.component';
import { ItemGroupDetailComponent } from '../detail/item-group-detail.component';
import { ItemGroupUpdateComponent } from '../update/item-group-update.component';
import { ItemGroupRoutingResolveService } from './item-group-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const itemGroupRoute: Routes = [
  {
    path: '',
    component: ItemGroupComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ItemGroupDetailComponent,
    resolve: {
      itemGroup: ItemGroupRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ItemGroupUpdateComponent,
    resolve: {
      itemGroup: ItemGroupRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ItemGroupUpdateComponent,
    resolve: {
      itemGroup: ItemGroupRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(itemGroupRoute)],
  exports: [RouterModule],
})
export class ItemGroupRoutingModule {}
