import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ParameterDefTypeComponent } from './list/parameter-def-type.component';
import { ParameterDefTypeDetailComponent } from './detail/parameter-def-type-detail.component';
import { ParameterDefTypeUpdateComponent } from './update/parameter-def-type-update.component';
import { ParameterDefTypeDeleteDialogComponent } from './delete/parameter-def-type-delete-dialog.component';
import { ParameterDefTypeRoutingModule } from './route/parameter-def-type-routing.module';

@NgModule({
  imports: [SharedModule, ParameterDefTypeRoutingModule],
  declarations: [
    ParameterDefTypeComponent,
    ParameterDefTypeDetailComponent,
    ParameterDefTypeUpdateComponent,
    ParameterDefTypeDeleteDialogComponent,
  ],
})
export class ParameterDefTypeModule {}
