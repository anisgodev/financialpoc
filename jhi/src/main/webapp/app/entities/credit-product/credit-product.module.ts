import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CreditProductComponent } from './list/credit-product.component';
import { CreditProductDetailComponent } from './detail/credit-product-detail.component';
import { CreditProductUpdateComponent } from './update/credit-product-update.component';
import { CreditProductDeleteDialogComponent } from './delete/credit-product-delete-dialog.component';
import { CreditProductRoutingModule } from './route/credit-product-routing.module';

@NgModule({
  imports: [SharedModule, CreditProductRoutingModule],
  declarations: [CreditProductComponent, CreditProductDetailComponent, CreditProductUpdateComponent, CreditProductDeleteDialogComponent],
})
export class CreditProductModule {}
