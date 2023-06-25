import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ParameterDefTypeFormService, ParameterDefTypeFormGroup } from './parameter-def-type-form.service';
import { IParameterDefType } from '../parameter-def-type.model';
import { ParameterDefTypeService } from '../service/parameter-def-type.service';
import { ParameterGroupEnum } from 'app/entities/enumerations/parameter-group-enum.model';

@Component({
  selector: 'jhi-parameter-def-type-update',
  templateUrl: './parameter-def-type-update.component.html',
})
export class ParameterDefTypeUpdateComponent implements OnInit {
  isSaving = false;
  parameterDefType: IParameterDefType | null = null;
  parameterGroupEnumValues = Object.keys(ParameterGroupEnum);

  editForm: ParameterDefTypeFormGroup = this.parameterDefTypeFormService.createParameterDefTypeFormGroup();

  constructor(
    protected parameterDefTypeService: ParameterDefTypeService,
    protected parameterDefTypeFormService: ParameterDefTypeFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ parameterDefType }) => {
      this.parameterDefType = parameterDefType;
      if (parameterDefType) {
        this.updateForm(parameterDefType);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const parameterDefType = this.parameterDefTypeFormService.getParameterDefType(this.editForm);
    if (parameterDefType.id !== null) {
      this.subscribeToSaveResponse(this.parameterDefTypeService.update(parameterDefType));
    } else {
      this.subscribeToSaveResponse(this.parameterDefTypeService.create(parameterDefType));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IParameterDefType>>): void {
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

  protected updateForm(parameterDefType: IParameterDefType): void {
    this.parameterDefType = parameterDefType;
    this.parameterDefTypeFormService.resetForm(this.editForm, parameterDefType);
  }
}
