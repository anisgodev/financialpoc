import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ParameterDefTypeComponent } from '../list/parameter-def-type.component';
import { ParameterDefTypeDetailComponent } from '../detail/parameter-def-type-detail.component';
import { ParameterDefTypeUpdateComponent } from '../update/parameter-def-type-update.component';
import { ParameterDefTypeRoutingResolveService } from './parameter-def-type-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const parameterDefTypeRoute: Routes = [
  {
    path: '',
    component: ParameterDefTypeComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ParameterDefTypeDetailComponent,
    resolve: {
      parameterDefType: ParameterDefTypeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ParameterDefTypeUpdateComponent,
    resolve: {
      parameterDefType: ParameterDefTypeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ParameterDefTypeUpdateComponent,
    resolve: {
      parameterDefType: ParameterDefTypeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(parameterDefTypeRoute)],
  exports: [RouterModule],
})
export class ParameterDefTypeRoutingModule {}
