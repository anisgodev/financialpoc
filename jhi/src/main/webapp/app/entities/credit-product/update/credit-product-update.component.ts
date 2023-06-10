import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { CreditProductFormService, CreditProductFormGroup } from './credit-product-form.service';
import { ICreditProduct } from '../credit-product.model';
import { CreditProductService } from '../service/credit-product.service';
import { IBusinessModel } from 'app/entities/business-model/business-model.model';
import { BusinessModelService } from 'app/entities/business-model/service/business-model.service';
import { IBusinessRule } from 'app/entities/business-rule/business-rule.model';
import { BusinessRuleService } from 'app/entities/business-rule/service/business-rule.service';

@Component({
  selector: 'jhi-credit-product-update',
  templateUrl: './credit-product-update.component.html',
})
export class CreditProductUpdateComponent implements OnInit {
  isSaving = false;
  creditProduct: ICreditProduct | null = null;

  businessModelsSharedCollection: IBusinessModel[] = [];
  businessRulesSharedCollection: IBusinessRule[] = [];

  editForm: CreditProductFormGroup = this.creditProductFormService.createCreditProductFormGroup();

  constructor(
    protected creditProductService: CreditProductService,
    protected creditProductFormService: CreditProductFormService,
    protected businessModelService: BusinessModelService,
    protected businessRuleService: BusinessRuleService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareBusinessModel = (o1: IBusinessModel | null, o2: IBusinessModel | null): boolean =>
    this.businessModelService.compareBusinessModel(o1, o2);

  compareBusinessRule = (o1: IBusinessRule | null, o2: IBusinessRule | null): boolean =>
    this.businessRuleService.compareBusinessRule(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ creditProduct }) => {
      this.creditProduct = creditProduct;
      if (creditProduct) {
        this.updateForm(creditProduct);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const creditProduct = this.creditProductFormService.getCreditProduct(this.editForm);
    if (creditProduct.id !== null) {
      this.subscribeToSaveResponse(this.creditProductService.update(creditProduct));
    } else {
      this.subscribeToSaveResponse(this.creditProductService.create(creditProduct));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICreditProduct>>): void {
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

  protected updateForm(creditProduct: ICreditProduct): void {
    this.creditProduct = creditProduct;
    this.creditProductFormService.resetForm(this.editForm, creditProduct);

    this.businessModelsSharedCollection = this.businessModelService.addBusinessModelToCollectionIfMissing<IBusinessModel>(
      this.businessModelsSharedCollection,
      creditProduct.businessModels
    );
    this.businessRulesSharedCollection = this.businessRuleService.addBusinessRuleToCollectionIfMissing<IBusinessRule>(
      this.businessRulesSharedCollection,
      creditProduct.rules
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
            this.creditProduct?.businessModels
          )
        )
      )
      .subscribe((businessModels: IBusinessModel[]) => (this.businessModelsSharedCollection = businessModels));

    this.businessRuleService
      .query()
      .pipe(map((res: HttpResponse<IBusinessRule[]>) => res.body ?? []))
      .pipe(
        map((businessRules: IBusinessRule[]) =>
          this.businessRuleService.addBusinessRuleToCollectionIfMissing<IBusinessRule>(businessRules, this.creditProduct?.rules)
        )
      )
      .subscribe((businessRules: IBusinessRule[]) => (this.businessRulesSharedCollection = businessRules));
  }
}
