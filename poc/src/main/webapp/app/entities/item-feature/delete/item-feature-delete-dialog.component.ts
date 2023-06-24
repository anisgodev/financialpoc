import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IItemFeature } from '../item-feature.model';
import { ItemFeatureService } from '../service/item-feature.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './item-feature-delete-dialog.component.html',
})
export class ItemFeatureDeleteDialogComponent {
  itemFeature?: IItemFeature;

  constructor(protected itemFeatureService: ItemFeatureService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.itemFeatureService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
