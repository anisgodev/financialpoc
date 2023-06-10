import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { BusinessModelFormService, BusinessModelFormGroup } from './business-model-form.service';
import { IBusinessModel } from '../business-model.model';
import { BusinessModelService } from '../service/business-model.service';
import { ParameterType } from 'app/entities/enumerations/parameter-type.model';
import { BusinessProcess } from 'app/entities/enumerations/business-process.model';

@Component({
  selector: 'jhi-business-model-update',
  templateUrl: './business-model-update.component.html',
})
export class BusinessModelUpdateComponent implements OnInit {
  isSaving = false;
  businessModel: IBusinessModel | null = null;
  parameterTypeValues = Object.keys(ParameterType);
  businessProcessValues = Object.keys(BusinessProcess);

  businessModelsSharedCollection: IBusinessModel[] = [];

  editForm: BusinessModelFormGroup = this.businessModelFormService.createBusinessModelFormGroup();

  constructor(
    protected businessModelService: BusinessModelService,
    protected businessModelFormService: BusinessModelFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareBusinessModel = (o1: IBusinessModel | null, o2: IBusinessModel | null): boolean =>
    this.businessModelService.compareBusinessModel(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ businessModel }) => {
      this.businessModel = businessModel;
      if (businessModel) {
        this.updateForm(businessModel);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const businessModel = this.businessModelFormService.getBusinessModel(this.editForm);
    if (businessModel.id !== null) {
      this.subscribeToSaveResponse(this.businessModelService.update(businessModel));
    } else {
      this.subscribeToSaveResponse(this.businessModelService.create(businessModel));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBusinessModel>>): void {
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

  protected updateForm(businessModel: IBusinessModel): void {
    this.businessModel = businessModel;
    this.businessModelFormService.resetForm(this.editForm, businessModel);

    this.businessModelsSharedCollection = this.businessModelService.addBusinessModelToCollectionIfMissing<IBusinessModel>(
      this.businessModelsSharedCollection,
      businessModel.relatedBusinessModels
    );
  }

  protected loadRelationshipsOptions(): void {
    this.businessModelService
      .query()
      .pipe(map((res: HttpResponse<IBusinessModel[]>) => res.body ?? []))
      .pipe(
        map((businessModels: IBusinessModel[]) =>
          this.businessModelService.addBusinessModelToCollectionIfMissing<IBusinessModel>(
            businessModels,
            this.businessModel?.relatedBusinessModels
          )
        )
      )
      .subscribe((businessModels: IBusinessModel[]) => (this.businessModelsSharedCollection = businessModels));
  }
}
