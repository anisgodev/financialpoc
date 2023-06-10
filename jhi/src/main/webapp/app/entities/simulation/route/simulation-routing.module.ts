import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SimulationComponent } from '../list/simulation.component';
import { SimulationDetailComponent } from '../detail/simulation-detail.component';
import { SimulationUpdateComponent } from '../update/simulation-update.component';
import { SimulationRoutingResolveService } from './simulation-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const simulationRoute: Routes = [
  {
    path: '',
    component: SimulationComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SimulationDetailComponent,
    resolve: {
      simulation: SimulationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SimulationUpdateComponent,
    resolve: {
      simulation: SimulationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SimulationUpdateComponent,
    resolve: {
      simulation: SimulationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(simulationRoute)],
  exports: [RouterModule],
})
export class SimulationRoutingModule {}
