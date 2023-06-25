import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IEligibilityCondition } from '../eligibility-condition.model';
import { EligibilityConditionService } from '../service/eligibility-condition.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './eligibility-condition-delete-dialog.component.html',
})
export class EligibilityConditionDeleteDialogComponent {
  eligibilityCondition?: IEligibilityCondition;

  constructor(protected eligibilityConditionService: EligibilityConditionService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.eligibilityConditionService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
