import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { BusinessRuleComponent } from './list/business-rule.component';
import { BusinessRuleDetailComponent } from './detail/business-rule-detail.component';
import { BusinessRuleUpdateComponent } from './update/business-rule-update.component';
import { BusinessRuleDeleteDialogComponent } from './delete/business-rule-delete-dialog.component';
import { BusinessRuleRoutingModule } from './route/business-rule-routing.module';

@NgModule({
  imports: [SharedModule, BusinessRuleRoutingModule],
  declarations: [BusinessRuleComponent, BusinessRuleDetailComponent, BusinessRuleUpdateComponent, BusinessRuleDeleteDialogComponent],
})
export class BusinessRuleModule {}
