import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ProductItemTypeComponent } from './list/product-item-type.component';
import { ProductItemTypeDetailComponent } from './detail/product-item-type-detail.component';
import { ProductItemTypeUpdateComponent } from './update/product-item-type-update.component';
import { ProductItemTypeDeleteDialogComponent } from './delete/product-item-type-delete-dialog.component';
import { ProductItemTypeRoutingModule } from './route/product-item-type-routing.module';

@NgModule({
  imports: [SharedModule, ProductItemTypeRoutingModule],
  declarations: [
    ProductItemTypeComponent,
    ProductItemTypeDetailComponent,
    ProductItemTypeUpdateComponent,
    ProductItemTypeDeleteDialogComponent,
  ],
})
export class ProductItemTypeModule {}
