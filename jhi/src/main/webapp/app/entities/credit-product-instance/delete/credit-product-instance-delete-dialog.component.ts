import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICreditProductInstance } from '../credit-product-instance.model';
import { CreditProductInstanceService } from '../service/credit-product-instance.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './credit-product-instance-delete-dialog.component.html',
})
export class CreditProductInstanceDeleteDialogComponent {
  creditProductInstance?: ICreditProductInstance;

  constructor(protected creditProductInstanceService: CreditProductInstanceService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.creditProductInstanceService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
