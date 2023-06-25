import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { EligibilityConditionComponent } from './list/eligibility-condition.component';
import { EligibilityConditionDetailComponent } from './detail/eligibility-condition-detail.component';
import { EligibilityConditionUpdateComponent } from './update/eligibility-condition-update.component';
import { EligibilityConditionDeleteDialogComponent } from './delete/eligibility-condition-delete-dialog.component';
import { EligibilityConditionRoutingModule } from './route/eligibility-condition-routing.module';

@NgModule({
  imports: [SharedModule, EligibilityConditionRoutingModule],
  declarations: [
    EligibilityConditionComponent,
    EligibilityConditionDetailComponent,
    EligibilityConditionUpdateComponent,
    EligibilityConditionDeleteDialogComponent,
  ],
})
export class EligibilityConditionModule {}
