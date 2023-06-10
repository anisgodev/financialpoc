import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IBusinessModel } from '../business-model.model';
import { BusinessModelService } from '../service/business-model.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './business-model-delete-dialog.component.html',
})
export class BusinessModelDeleteDialogComponent {
  businessModel?: IBusinessModel;

  constructor(protected businessModelService: BusinessModelService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.businessModelService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
