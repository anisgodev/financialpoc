import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IParameterDefType } from '../parameter-def-type.model';
import { ParameterDefTypeService } from '../service/parameter-def-type.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './parameter-def-type-delete-dialog.component.html',
})
export class ParameterDefTypeDeleteDialogComponent {
  parameterDefType?: IParameterDefType;

  constructor(protected parameterDefTypeService: ParameterDefTypeService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.parameterDefTypeService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
