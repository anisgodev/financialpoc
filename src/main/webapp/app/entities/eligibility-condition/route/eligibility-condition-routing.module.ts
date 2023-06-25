import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { EligibilityConditionComponent } from '../list/eligibility-condition.component';
import { EligibilityConditionDetailComponent } from '../detail/eligibility-condition-detail.component';
import { EligibilityConditionUpdateComponent } from '../update/eligibility-condition-update.component';
import { EligibilityConditionRoutingResolveService } from './eligibility-condition-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const eligibilityConditionRoute: Routes = [
  {
    path: '',
    component: EligibilityConditionComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EligibilityConditionDetailComponent,
    resolve: {
      eligibilityCondition: EligibilityConditionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EligibilityConditionUpdateComponent,
    resolve: {
      eligibilityCondition: EligibilityConditionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EligibilityConditionUpdateComponent,
    resolve: {
      eligibilityCondition: EligibilityConditionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(eligibilityConditionRoute)],
  exports: [RouterModule],
})
export class EligibilityConditionRoutingModule {}
