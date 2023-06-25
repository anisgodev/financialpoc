import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IProductRepositoryItem } from '../product-repository-item.model';
import { ProductRepositoryItemService } from '../service/product-repository-item.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './product-repository-item-delete-dialog.component.html',
})
export class ProductRepositoryItemDeleteDialogComponent {
  productRepositoryItem?: IProductRepositoryItem;

  constructor(protected productRepositoryItemService: ProductRepositoryItemService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.productRepositoryItemService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
