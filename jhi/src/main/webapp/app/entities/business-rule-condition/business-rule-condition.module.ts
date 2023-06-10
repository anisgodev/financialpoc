import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { BusinessRuleConditionComponent } from './list/business-rule-condition.component';
import { BusinessRuleConditionDetailComponent } from './detail/business-rule-condition-detail.component';
import { BusinessRuleConditionUpdateComponent } from './update/business-rule-condition-update.component';
import { BusinessRuleConditionDeleteDialogComponent } from './delete/business-rule-condition-delete-dialog.component';
import { BusinessRuleConditionRoutingModule } from './route/business-rule-condition-routing.module';

@NgModule({
  imports: [SharedModule, BusinessRuleConditionRoutingModule],
  declarations: [
    BusinessRuleConditionComponent,
    BusinessRuleConditionDetailComponent,
    BusinessRuleConditionUpdateComponent,
    BusinessRuleConditionDeleteDialogComponent,
  ],
})
export class BusinessRuleConditionModule {}
