import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CreditProductInstanceComponent } from './list/credit-product-instance.component';
import { CreditProductInstanceDetailComponent } from './detail/credit-product-instance-detail.component';
import { CreditProductInstanceUpdateComponent } from './update/credit-product-instance-update.component';
import { CreditProductInstanceDeleteDialogComponent } from './delete/credit-product-instance-delete-dialog.component';
import { CreditProductInstanceRoutingModule } from './route/credit-product-instance-routing.module';

@NgModule({
  imports: [SharedModule, CreditProductInstanceRoutingModule],
  declarations: [
    CreditProductInstanceComponent,
    CreditProductInstanceDetailComponent,
    CreditProductInstanceUpdateComponent,
    CreditProductInstanceDeleteDialogComponent,
  ],
})
export class CreditProductInstanceModule {}
