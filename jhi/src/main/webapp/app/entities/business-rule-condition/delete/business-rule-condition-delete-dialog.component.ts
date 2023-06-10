import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IBusinessRuleCondition } from '../business-rule-condition.model';
import { BusinessRuleConditionService } from '../service/business-rule-condition.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './business-rule-condition-delete-dialog.component.html',
})
export class BusinessRuleConditionDeleteDialogComponent {
  businessRuleCondition?: IBusinessRuleCondition;

  constructor(protected businessRuleConditionService: BusinessRuleConditionService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.businessRuleConditionService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
