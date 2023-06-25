import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ProductItemTypeFormService, ProductItemTypeFormGroup } from './product-item-type-form.service';
import { IProductItemType } from '../product-item-type.model';
import { ProductItemTypeService } from '../service/product-item-type.service';
import { ProductItemCategoryEnum } from 'app/entities/enumerations/product-item-category-enum.model';
import { StateEnum } from 'app/entities/enumerations/state-enum.model';

@Component({
  selector: 'jhi-product-item-type-update',
  templateUrl: './product-item-type-update.component.html',
})
export class ProductItemTypeUpdateComponent implements OnInit {
  isSaving = false;
  productItemType: IProductItemType | null = null;
  productItemCategoryEnumValues = Object.keys(ProductItemCategoryEnum);
  stateEnumValues = Object.keys(StateEnum);

  editForm: ProductItemTypeFormGroup = this.productItemTypeFormService.createProductItemTypeFormGroup();

  constructor(
    protected productItemTypeService: ProductItemTypeService,
    protected productItemTypeFormService: ProductItemTypeFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ productItemType }) => {
      this.productItemType = productItemType;
      if (productItemType) {
        this.updateForm(productItemType);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const productItemType = this.productItemTypeFormService.getProductItemType(this.editForm);
    if (productItemType.id !== null) {
      this.subscribeToSaveResponse(this.productItemTypeService.update(productItemType));
    } else {
      this.subscribeToSaveResponse(this.productItemTypeService.create(productItemType));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProductItemType>>): void {
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

  protected updateForm(productItemType: IProductItemType): void {
    this.productItemType = productItemType;
    this.productItemTypeFormService.resetForm(this.editForm, productItemType);
  }
}
