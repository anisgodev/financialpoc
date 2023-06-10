import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { BusinessModelComponent } from './list/business-model.component';
import { BusinessModelDetailComponent } from './detail/business-model-detail.component';
import { BusinessModelUpdateComponent } from './update/business-model-update.component';
import { BusinessModelDeleteDialogComponent } from './delete/business-model-delete-dialog.component';
import { BusinessModelRoutingModule } from './route/business-model-routing.module';

@NgModule({
  imports: [SharedModule, BusinessModelRoutingModule],
  declarations: [BusinessModelComponent, BusinessModelDetailComponent, BusinessModelUpdateComponent, BusinessModelDeleteDialogComponent],
})
export class BusinessModelModule {}
