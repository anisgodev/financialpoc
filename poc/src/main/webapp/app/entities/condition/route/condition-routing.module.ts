import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ConditionComponent } from '../list/condition.component';
import { ConditionDetailComponent } from '../detail/condition-detail.component';
import { ConditionUpdateComponent } from '../update/condition-update.component';
import { ConditionRoutingResolveService } from './condition-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const conditionRoute: Routes = [
  {
    path: '',
    component: ConditionComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ConditionDetailComponent,
    resolve: {
      condition: ConditionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ConditionUpdateComponent,
    resolve: {
      condition: ConditionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ConditionUpdateComponent,
    resolve: {
      condition: ConditionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(conditionRoute)],
  exports: [RouterModule],
})
export class ConditionRoutingModule {}
