import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ProductRepositoryItemFormService, ProductRepositoryItemFormGroup } from './product-repository-item-form.service';
import { IProductRepositoryItem } from '../product-repository-item.model';
import { ProductRepositoryItemService } from '../service/product-repository-item.service';
import { IProductItemType } from 'app/entities/product-item-type/product-item-type.model';
import { ProductItemTypeService } from 'app/entities/product-item-type/service/product-item-type.service';
import { ProductItemCategoryEnum } from 'app/entities/enumerations/product-item-category-enum.model';
import { ProductItemStateEnum } from 'app/entities/enumerations/product-item-state-enum.model';

@Component({
  selector: 'jhi-product-repository-item-update',
  templateUrl: './product-repository-item-update.component.html',
})
export class ProductRepositoryItemUpdateComponent implements OnInit {
  isSaving = false;
  productRepositoryItem: IProductRepositoryItem | null = null;
  productItemCategoryEnumValues = Object.keys(ProductItemCategoryEnum);
  productItemStateEnumValues = Object.keys(ProductItemStateEnum);

  productItemTypesSharedCollection: IProductItemType[] = [];

  editForm: ProductRepositoryItemFormGroup = this.productRepositoryItemFormService.createProductRepositoryItemFormGroup();

  constructor(
    protected productRepositoryItemService: ProductRepositoryItemService,
    protected productRepositoryItemFormService: ProductRepositoryItemFormService,
    protected productItemTypeService: ProductItemTypeService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareProductItemType = (o1: IProductItemType | null, o2: IProductItemType | null): boolean =>
    this.productItemTypeService.compareProductItemType(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ productRepositoryItem }) => {
      this.productRepositoryItem = productRepositoryItem;
      if (productRepositoryItem) {
        this.updateForm(productRepositoryItem);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const productRepositoryItem = this.productRepositoryItemFormService.getProductRepositoryItem(this.editForm);
    if (productRepositoryItem.id !== null) {
      this.subscribeToSaveResponse(this.productRepositoryItemService.update(productRepositoryItem));
    } else {
      this.subscribeToSaveResponse(this.productRepositoryItemService.create(productRepositoryItem));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProductRepositoryItem>>): void {
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

  protected updateForm(productRepositoryItem: IProductRepositoryItem): void {
    this.productRepositoryItem = productRepositoryItem;
    this.productRepositoryItemFormService.resetForm(this.editForm, productRepositoryItem);

    this.productItemTypesSharedCollection = this.productItemTypeService.addProductItemTypeToCollectionIfMissing<IProductItemType>(
      this.productItemTypesSharedCollection,
      productRepositoryItem.productItemType
    );
  }

  protected loadRelationshipsOptions(): void {
    this.productItemTypeService
      .query()
      .pipe(map((res: HttpResponse<IProductItemType[]>) => res.body ?? []))
      .pipe(
        map((productItemTypes: IProductItemType[]) =>
          this.productItemTypeService.addProductItemTypeToCollectionIfMissing<IProductItemType>(
            productItemTypes,
            this.productRepositoryItem?.productItemType
          )
        )
      )
      .subscribe((productItemTypes: IProductItemType[]) => (this.productItemTypesSharedCollection = productItemTypes));
  }
}
