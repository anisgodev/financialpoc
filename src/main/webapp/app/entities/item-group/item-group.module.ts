import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ItemGroupComponent } from './list/item-group.component';
import { ItemGroupDetailComponent } from './detail/item-group-detail.component';
import { ItemGroupUpdateComponent } from './update/item-group-update.component';
import { ItemGroupDeleteDialogComponent } from './delete/item-group-delete-dialog.component';
import { ItemGroupRoutingModule } from './route/item-group-routing.module';

@NgModule({
  imports: [SharedModule, ItemGroupRoutingModule],
  declarations: [ItemGroupComponent, ItemGroupDetailComponent, ItemGroupUpdateComponent, ItemGroupDeleteDialogComponent],
})
export class ItemGroupModule {}
