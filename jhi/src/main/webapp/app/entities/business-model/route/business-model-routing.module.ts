import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { BusinessModelComponent } from '../list/business-model.component';
import { BusinessModelDetailComponent } from '../detail/business-model-detail.component';
import { BusinessModelUpdateComponent } from '../update/business-model-update.component';
import { BusinessModelRoutingResolveService } from './business-model-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const businessModelRoute: Routes = [
  {
    path: '',
    component: BusinessModelComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: BusinessModelDetailComponent,
    resolve: {
      businessModel: BusinessModelRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: BusinessModelUpdateComponent,
    resolve: {
      businessModel: BusinessModelRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: BusinessModelUpdateComponent,
    resolve: {
      businessModel: BusinessModelRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(businessModelRoute)],
  exports: [RouterModule],
})
export class BusinessModelRoutingModule {}
