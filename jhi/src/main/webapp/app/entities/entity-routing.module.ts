import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'business-model',
        data: { pageTitle: 'accpdesignerApp.businessModel.home.title' },
        loadChildren: () => import('./business-model/business-model.module').then(m => m.BusinessModelModule),
      },
      {
        path: 'business-rule',
        data: { pageTitle: 'accpdesignerApp.businessRule.home.title' },
        loadChildren: () => import('./business-rule/business-rule.module').then(m => m.BusinessRuleModule),
      },
      {
        path: 'business-rule-condition',
        data: { pageTitle: 'accpdesignerApp.businessRuleCondition.home.title' },
        loadChildren: () => import('./business-rule-condition/business-rule-condition.module').then(m => m.BusinessRuleConditionModule),
      },
      {
        path: 'credit-product',
        data: { pageTitle: 'accpdesignerApp.creditProduct.home.title' },
        loadChildren: () => import('./credit-product/credit-product.module').then(m => m.CreditProductModule),
      },
      {
        path: 'credit-product-instance',
        data: { pageTitle: 'accpdesignerApp.creditProductInstance.home.title' },
        loadChildren: () => import('./credit-product-instance/credit-product-instance.module').then(m => m.CreditProductInstanceModule),
      },
      {
        path: 'simulation',
        data: { pageTitle: 'accpdesignerApp.simulation.home.title' },
        loadChildren: () => import('./simulation/simulation.module').then(m => m.SimulationModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
