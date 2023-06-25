import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IExpectedValue } from '../expected-value.model';
import { ExpectedValueService } from '../service/expected-value.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './expected-value-delete-dialog.component.html',
})
export class ExpectedValueDeleteDialogComponent {
  expectedValue?: IExpectedValue;

  constructor(protected expectedValueService: ExpectedValueService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.expectedValueService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
