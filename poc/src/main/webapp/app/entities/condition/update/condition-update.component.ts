import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ConditionFormService, ConditionFormGroup } from './condition-form.service';
import { ICondition } from '../condition.model';
import { ConditionService } from '../service/condition.service';
import { IParameter } from 'app/entities/parameter/parameter.model';
import { ParameterService } from 'app/entities/parameter/service/parameter.service';

@Component({
  selector: 'jhi-condition-update',
  templateUrl: './condition-update.component.html',
})
export class ConditionUpdateComponent implements OnInit {
  isSaving = false;
  condition: ICondition | null = null;

  parametersSharedCollection: IParameter[] = [];

  editForm: ConditionFormGroup = this.conditionFormService.createConditionFormGroup();

  constructor(
    protected conditionService: ConditionService,
    protected conditionFormService: ConditionFormService,
    protected parameterService: ParameterService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareParameter = (o1: IParameter | null, o2: IParameter | null): boolean => this.parameterService.compareParameter(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ condition }) => {
      this.condition = condition;
      if (condition) {
        this.updateForm(condition);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const condition = this.conditionFormService.getCondition(this.editForm);
    if (condition.id !== null) {
      this.subscribeToSaveResponse(this.conditionService.update(condition));
    } else {
      this.subscribeToSaveResponse(this.conditionService.create(condition));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICondition>>): void {
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

  protected updateForm(condition: ICondition): void {
    this.condition = condition;
    this.conditionFormService.resetForm(this.editForm, condition);

    this.parametersSharedCollection = this.parameterService.addParameterToCollectionIfMissing<IParameter>(
      this.parametersSharedCollection,
      condition.parameter
    );
  }

  protected loadRelationshipsOptions(): void {
    this.parameterService
      .query()
      .pipe(map((res: HttpResponse<IParameter[]>) => res.body ?? []))
      .pipe(
        map((parameters: IParameter[]) =>
          this.parameterService.addParameterToCollectionIfMissing<IParameter>(parameters, this.condition?.parameter)
        )
      )
      .subscribe((parameters: IParameter[]) => (this.parametersSharedCollection = parameters));
  }
}
