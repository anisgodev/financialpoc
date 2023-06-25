import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ExpectedValueFormService, ExpectedValueFormGroup } from './expected-value-form.service';
import { IExpectedValue } from '../expected-value.model';
import { ExpectedValueService } from '../service/expected-value.service';
import { ParameterTypeEnum } from 'app/entities/enumerations/parameter-type-enum.model';

@Component({
  selector: 'jhi-expected-value-update',
  templateUrl: './expected-value-update.component.html',
})
export class ExpectedValueUpdateComponent implements OnInit {
  isSaving = false;
  expectedValue: IExpectedValue | null = null;
  parameterTypeEnumValues = Object.keys(ParameterTypeEnum);

  editForm: ExpectedValueFormGroup = this.expectedValueFormService.createExpectedValueFormGroup();

  constructor(
    protected expectedValueService: ExpectedValueService,
    protected expectedValueFormService: ExpectedValueFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ expectedValue }) => {
      this.expectedValue = expectedValue;
      if (expectedValue) {
        this.updateForm(expectedValue);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const expectedValue = this.expectedValueFormService.getExpectedValue(this.editForm);
    if (expectedValue.id !== null) {
      this.subscribeToSaveResponse(this.expectedValueService.update(expectedValue));
    } else {
      this.subscribeToSaveResponse(this.expectedValueService.create(expectedValue));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IExpectedValue>>): void {
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

  protected updateForm(expectedValue: IExpectedValue): void {
    this.expectedValue = expectedValue;
    this.expectedValueFormService.resetForm(this.editForm, expectedValue);
  }
}
