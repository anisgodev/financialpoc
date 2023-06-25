import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ProductRepositoryItemComponent } from './list/product-repository-item.component';
import { ProductRepositoryItemDetailComponent } from './detail/product-repository-item-detail.component';
import { ProductRepositoryItemUpdateComponent } from './update/product-repository-item-update.component';
import { ProductRepositoryItemDeleteDialogComponent } from './delete/product-repository-item-delete-dialog.component';
import { ProductRepositoryItemRoutingModule } from './route/product-repository-item-routing.module';

@NgModule({
  imports: [SharedModule, ProductRepositoryItemRoutingModule],
  declarations: [
    ProductRepositoryItemComponent,
    ProductRepositoryItemDetailComponent,
    ProductRepositoryItemUpdateComponent,
    ProductRepositoryItemDeleteDialogComponent,
  ],
})
export class ProductRepositoryItemModule {}
