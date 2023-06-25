import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'eligibility-condition',
        data: { pageTitle: 'myApp.eligibilityCondition.home.title' },
        loadChildren: () => import('./eligibility-condition/eligibility-condition.module').then(m => m.EligibilityConditionModule),
      },
      {
        path: 'condition',
        data: { pageTitle: 'myApp.condition.home.title' },
        loadChildren: () => import('./condition/condition.module').then(m => m.ConditionModule),
      },
      {
        path: 'parameter-def-type',
        data: { pageTitle: 'myApp.parameterDefType.home.title' },
        loadChildren: () => import('./parameter-def-type/parameter-def-type.module').then(m => m.ParameterDefTypeModule),
      },
      {
        path: 'expected-value',
        data: { pageTitle: 'myApp.expectedValue.home.title' },
        loadChildren: () => import('./expected-value/expected-value.module').then(m => m.ExpectedValueModule),
      },
      {
        path: 'parameter',
        data: { pageTitle: 'myApp.parameter.home.title' },
        loadChildren: () => import('./parameter/parameter.module').then(m => m.ParameterModule),
      },
      {
        path: 'item-feature',
        data: { pageTitle: 'myApp.itemFeature.home.title' },
        loadChildren: () => import('./item-feature/item-feature.module').then(m => m.ItemFeatureModule),
      },
      {
        path: 'product-item-type',
        data: { pageTitle: 'myApp.productItemType.home.title' },
        loadChildren: () => import('./product-item-type/product-item-type.module').then(m => m.ProductItemTypeModule),
      },
      {
        path: 'item-group',
        data: { pageTitle: 'myApp.itemGroup.home.title' },
        loadChildren: () => import('./item-group/item-group.module').then(m => m.ItemGroupModule),
      },
      {
        path: 'product-repository-item',
        data: { pageTitle: 'myApp.productRepositoryItem.home.title' },
        loadChildren: () => import('./product-repository-item/product-repository-item.module').then(m => m.ProductRepositoryItemModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
