import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ExpectedValueComponent } from './list/expected-value.component';
import { ExpectedValueDetailComponent } from './detail/expected-value-detail.component';
import { ExpectedValueUpdateComponent } from './update/expected-value-update.component';
import { ExpectedValueDeleteDialogComponent } from './delete/expected-value-delete-dialog.component';
import { ExpectedValueRoutingModule } from './route/expected-value-routing.module';

@NgModule({
  imports: [SharedModule, ExpectedValueRoutingModule],
  declarations: [ExpectedValueComponent, ExpectedValueDetailComponent, ExpectedValueUpdateComponent, ExpectedValueDeleteDialogComponent],
})
export class ExpectedValueModule {}
