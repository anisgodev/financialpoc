import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IBusinessRule } from '../business-rule.model';
import { BusinessRuleService } from '../service/business-rule.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './business-rule-delete-dialog.component.html',
})
export class BusinessRuleDeleteDialogComponent {
  businessRule?: IBusinessRule;

  constructor(protected businessRuleService: BusinessRuleService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.businessRuleService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
