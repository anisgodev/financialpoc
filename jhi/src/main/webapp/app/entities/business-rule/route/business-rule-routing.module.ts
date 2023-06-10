import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { BusinessRuleComponent } from '../list/business-rule.component';
import { BusinessRuleDetailComponent } from '../detail/business-rule-detail.component';
import { BusinessRuleUpdateComponent } from '../update/business-rule-update.component';
import { BusinessRuleRoutingResolveService } from './business-rule-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const businessRuleRoute: Routes = [
  {
    path: '',
    component: BusinessRuleComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: BusinessRuleDetailComponent,
    resolve: {
      businessRule: BusinessRuleRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: BusinessRuleUpdateComponent,
    resolve: {
      businessRule: BusinessRuleRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: BusinessRuleUpdateComponent,
    resolve: {
      businessRule: BusinessRuleRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(businessRuleRoute)],
  exports: [RouterModule],
})
export class BusinessRuleRoutingModule {}
