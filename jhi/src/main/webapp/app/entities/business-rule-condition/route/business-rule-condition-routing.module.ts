import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { BusinessRuleConditionComponent } from '../list/business-rule-condition.component';
import { BusinessRuleConditionDetailComponent } from '../detail/business-rule-condition-detail.component';
import { BusinessRuleConditionUpdateComponent } from '../update/business-rule-condition-update.component';
import { BusinessRuleConditionRoutingResolveService } from './business-rule-condition-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const businessRuleConditionRoute: Routes = [
  {
    path: '',
    component: BusinessRuleConditionComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: BusinessRuleConditionDetailComponent,
    resolve: {
      businessRuleCondition: BusinessRuleConditionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: BusinessRuleConditionUpdateComponent,
    resolve: {
      businessRuleCondition: BusinessRuleConditionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: BusinessRuleConditionUpdateComponent,
    resolve: {
      businessRuleCondition: BusinessRuleConditionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(businessRuleConditionRoute)],
  exports: [RouterModule],
})
export class BusinessRuleConditionRoutingModule {}
