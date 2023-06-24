import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IProductItemType } from '../product-item-type.model';
import { ProductItemTypeService } from '../service/product-item-type.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './product-item-type-delete-dialog.component.html',
})
export class ProductItemTypeDeleteDialogComponent {
  productItemType?: IProductItemType;

  constructor(protected productItemTypeService: ProductItemTypeService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.productItemTypeService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
