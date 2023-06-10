import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { BusinessRuleConditionFormService, BusinessRuleConditionFormGroup } from './business-rule-condition-form.service';
import { IBusinessRuleCondition } from '../business-rule-condition.model';
import { BusinessRuleConditionService } from '../service/business-rule-condition.service';
import { OperatorEnum } from 'app/entities/enumerations/operator-enum.model';

@Component({
  selector: 'jhi-business-rule-condition-update',
  templateUrl: './business-rule-condition-update.component.html',
})
export class BusinessRuleConditionUpdateComponent implements OnInit {
  isSaving = false;
  businessRuleCondition: IBusinessRuleCondition | null = null;
  operatorEnumValues = Object.keys(OperatorEnum);

  editForm: BusinessRuleConditionFormGroup = this.businessRuleConditionFormService.createBusinessRuleConditionFormGroup();

  constructor(
    protected businessRuleConditionService: BusinessRuleConditionService,
    protected businessRuleConditionFormService: BusinessRuleConditionFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ businessRuleCondition }) => {
      this.businessRuleCondition = businessRuleCondition;
      if (businessRuleCondition) {
        this.updateForm(businessRuleCondition);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const businessRuleCondition = this.businessRuleConditionFormService.getBusinessRuleCondition(this.editForm);
    if (businessRuleCondition.id !== null) {
      this.subscribeToSaveResponse(this.businessRuleConditionService.update(businessRuleCondition));
    } else {
      this.subscribeToSaveResponse(this.businessRuleConditionService.create(businessRuleCondition));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBusinessRuleCondition>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(businessRuleCondition: IBusinessRuleCondition): void {
    this.businessRuleCondition = businessRuleCondition;
    this.businessRuleConditionFormService.resetForm(this.editForm, businessRuleCondition);
  }
}
