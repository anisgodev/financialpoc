import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IItemGroup } from '../item-group.model';
import { ItemGroupService } from '../service/item-group.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './item-group-delete-dialog.component.html',
})
export class ItemGroupDeleteDialogComponent {
  itemGroup?: IItemGroup;

  constructor(protected itemGroupService: ItemGroupService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.itemGroupService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
