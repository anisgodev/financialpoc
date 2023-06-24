import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ItemFeatureComponent } from './list/item-feature.component';
import { ItemFeatureDetailComponent } from './detail/item-feature-detail.component';
import { ItemFeatureUpdateComponent } from './update/item-feature-update.component';
import { ItemFeatureDeleteDialogComponent } from './delete/item-feature-delete-dialog.component';
import { ItemFeatureRoutingModule } from './route/item-feature-routing.module';

@NgModule({
  imports: [SharedModule, ItemFeatureRoutingModule],
  declarations: [ItemFeatureComponent, ItemFeatureDetailComponent, ItemFeatureUpdateComponent, ItemFeatureDeleteDialogComponent],
})
export class ItemFeatureModule {}
