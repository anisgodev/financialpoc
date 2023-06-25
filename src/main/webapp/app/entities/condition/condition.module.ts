import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ConditionComponent } from './list/condition.component';
import { ConditionDetailComponent } from './detail/condition-detail.component';
import { ConditionUpdateComponent } from './update/condition-update.component';
import { ConditionDeleteDialogComponent } from './delete/condition-delete-dialog.component';
import { ConditionRoutingModule } from './route/condition-routing.module';

@NgModule({
  imports: [SharedModule, ConditionRoutingModule],
  declarations: [ConditionComponent, ConditionDetailComponent, ConditionUpdateComponent, ConditionDeleteDialogComponent],
})
export class ConditionModule {}
