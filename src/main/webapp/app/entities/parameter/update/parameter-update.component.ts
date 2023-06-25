import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ParameterFormService, ParameterFormGroup } from './parameter-form.service';
import { IParameter } from '../parameter.model';
import { ParameterService } from '../service/parameter.service';
import { IParameterDefType } from 'app/entities/parameter-def-type/parameter-def-type.model';
import { ParameterDefTypeService } from 'app/entities/parameter-def-type/service/parameter-def-type.service';
import { IExpectedValue } from 'app/entities/expected-value/expected-value.model';
import { ExpectedValueService } from 'app/entities/expected-value/service/expected-value.service';
import { IItemFeature } from 'app/entities/item-feature/item-feature.model';
import { ItemFeatureService } from 'app/entities/item-feature/service/item-feature.service';
import { ParameterTypeEnum } from 'app/entities/enumerations/parameter-type-enum.model';
import { ParameterStateEnum } from 'app/entities/enumerations/parameter-state-enum.model';

@Component({
  selector: 'jhi-parameter-update',
  templateUrl: './parameter-update.component.html',
})
export class ParameterUpdateComponent implements OnInit {
  isSaving = false;
  parameter: IParameter | null = null;
  parameterTypeEnumValues = Object.keys(ParameterTypeEnum);
  parameterStateEnumValues = Object.keys(ParameterStateEnum);

  parameterDefTypesSharedCollection: IParameterDefType[] = [];
  expectedValuesSharedCollection: IExpectedValue[] = [];
  itemFeaturesSharedCollection: IItemFeature[] = [];

  editForm: ParameterFormGroup = this.parameterFormService.createParameterFormGroup();

  constructor(
    protected parameterService: ParameterService,
    protected parameterFormService: ParameterFormService,
    protected parameterDefTypeService: ParameterDefTypeService,
    protected expectedValueService: ExpectedValueService,
    protected itemFeatureService: ItemFeatureService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareParameterDefType = (o1: IParameterDefType | null, o2: IParameterDefType | null): boolean =>
    this.parameterDefTypeService.compareParameterDefType(o1, o2);

  compareExpectedValue = (o1: IExpectedValue | null, o2: IExpectedValue | null): boolean =>
    this.expectedValueService.compareExpectedValue(o1, o2);

  compareItemFeature = (o1: IItemFeature | null, o2: IItemFeature | null): boolean => this.itemFeatureService.compareItemFeature(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ parameter }) => {
      this.parameter = parameter;
      if (parameter) {
        this.updateForm(parameter);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const parameter = this.parameterFormService.getParameter(this.editForm);
    if (parameter.id !== null) {
      this.subscribeToSaveResponse(this.parameterService.update(parameter));
    } else {
      this.subscribeToSaveResponse(this.parameterService.create(parameter));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IParameter>>): void {
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

  protected updateForm(parameter: IParameter): void {
    this.parameter = parameter;
    this.parameterFormService.resetForm(this.editForm, parameter);

    this.parameterDefTypesSharedCollection = this.parameterDefTypeService.addParameterDefTypeToCollectionIfMissing<IParameterDefType>(
      this.parameterDefTypesSharedCollection,
      parameter.parameterDefType
    );
    this.expectedValuesSharedCollection = this.expectedValueService.addExpectedValueToCollectionIfMissing<IExpectedValue>(
      this.expectedValuesSharedCollection,
      parameter.expectedValue
    );
    this.itemFeaturesSharedCollection = this.itemFeatureService.addItemFeatureToCollectionIfMissing<IItemFeature>(
      this.itemFeaturesSharedCollection,
      parameter.itemFeature
    );
  }

  protected loadRelationshipsOptions(): void {
    this.parameterDefTypeService
      .query()
      .pipe(map((res: HttpResponse<IParameterDefType[]>) => res.body ?? []))
      .pipe(
        map((parameterDefTypes: IParameterDefType[]) =>
          this.parameterDefTypeService.addParameterDefTypeToCollectionIfMissing<IParameterDefType>(
            parameterDefTypes,
            this.parameter?.parameterDefType
          )
        )
      )
      .subscribe((parameterDefTypes: IParameterDefType[]) => (this.parameterDefTypesSharedCollection = parameterDefTypes));

    this.expectedValueService
      .query()
      .pipe(map((res: HttpResponse<IExpectedValue[]>) => res.body ?? []))
      .pipe(
        map((expectedValues: IExpectedValue[]) =>
          this.expectedValueService.addExpectedValueToCollectionIfMissing<IExpectedValue>(expectedValues, this.parameter?.expectedValue)
        )
      )
      .subscribe((expectedValues: IExpectedValue[]) => (this.expectedValuesSharedCollection = expectedValues));

    this.itemFeatureService
      .query()
      .pipe(map((res: HttpResponse<IItemFeature[]>) => res.body ?? []))
      .pipe(
        map((itemFeatures: IItemFeature[]) =>
          this.itemFeatureService.addItemFeatureToCollectionIfMissing<IItemFeature>(itemFeatures, this.parameter?.itemFeature)
        )
      )
      .subscribe((itemFeatures: IItemFeature[]) => (this.itemFeaturesSharedCollection = itemFeatures));
  }
}
