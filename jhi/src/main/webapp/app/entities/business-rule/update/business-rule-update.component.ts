import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { BusinessRuleFormService, BusinessRuleFormGroup } from './business-rule-form.service';
import { IBusinessRule } from '../business-rule.model';
import { BusinessRuleService } from '../service/business-rule.service';
import { IBusinessRuleCondition } from 'app/entities/business-rule-condition/business-rule-condition.model';
import { BusinessRuleConditionService } from 'app/entities/business-rule-condition/service/business-rule-condition.service';
import { BusinessProcess } from 'app/entities/enumerations/business-process.model';

@Component({
  selector: 'jhi-business-rule-update',
  templateUrl: './business-rule-update.component.html',
})
export class BusinessRuleUpdateComponent implements OnInit {
  isSaving = false;
  businessRule: IBusinessRule | null = null;
  businessProcessValues = Object.keys(BusinessProcess);

  businessRuleConditionsSharedCollection: IBusinessRuleCondition[] = [];

  editForm: BusinessRuleFormGroup = this.businessRuleFormService.createBusinessRuleFormGroup();

  constructor(
    protected businessRuleService: BusinessRuleService,
    protected businessRuleFormService: BusinessRuleFormService,
    protected businessRuleConditionService: BusinessRuleConditionService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareBusinessRuleCondition = (o1: IBusinessRuleCondition | null, o2: IBusinessRuleCondition | null): boolean =>
    this.businessRuleConditionService.compareBusinessRuleCondition(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ businessRule }) => {
      this.businessRule = businessRule;
      if (businessRule) {
        this.updateForm(businessRule);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const businessRule = this.businessRuleFormService.getBusinessRule(this.editForm);
    if (businessRule.id !== null) {
      this.subscribeToSaveResponse(this.businessRuleService.update(businessRule));
    } else {
      this.subscribeToSaveResponse(this.businessRuleService.create(businessRule));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBusinessRule>>): void {
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

  protected updateForm(businessRule: IBusinessRule): void {
    this.businessRule = businessRule;
    this.businessRuleFormService.resetForm(this.editForm, businessRule);

    this.businessRuleConditionsSharedCollection =
      this.businessRuleConditionService.addBusinessRuleConditionToCollectionIfMissing<IBusinessRuleCondition>(
        this.businessRuleConditionsSharedCollection,
        businessRule.conditions
      );
  }

  protected loadRelationshipsOptions(): void {
    this.businessRuleConditionService
      .query()
      .pipe(map((res: HttpResponse<IBusinessRuleCondition[]>) => res.body ?? []))
      .pipe(
        map((businessRuleConditions: IBusinessRuleCondition[]) =>
          this.businessRuleConditionService.addBusinessRuleConditionToCollectionIfMissing<IBusinessRuleCondition>(
            businessRuleConditions,
            this.businessRule?.conditions
          )
        )
      )
      .subscribe(
        (businessRuleConditions: IBusinessRuleCondition[]) => (this.businessRuleConditionsSharedCollection = businessRuleConditions)
      );
  }
}
