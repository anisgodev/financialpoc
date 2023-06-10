import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICreditProduct } from '../credit-product.model';
import { CreditProductService } from '../service/credit-product.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './credit-product-delete-dialog.component.html',
})
export class CreditProductDeleteDialogComponent {
  creditProduct?: ICreditProduct;

  constructor(protected creditProductService: CreditProductService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.creditProductService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
