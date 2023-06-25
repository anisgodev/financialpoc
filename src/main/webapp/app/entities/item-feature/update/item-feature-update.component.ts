import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ItemFeatureFormService, ItemFeatureFormGroup } from './item-feature-form.service';
import { IItemFeature } from '../item-feature.model';
import { ItemFeatureService } from '../service/item-feature.service';
import { IProductRepositoryItem } from 'app/entities/product-repository-item/product-repository-item.model';
import { ProductRepositoryItemService } from 'app/entities/product-repository-item/service/product-repository-item.service';

@Component({
  selector: 'jhi-item-feature-update',
  templateUrl: './item-feature-update.component.html',
})
export class ItemFeatureUpdateComponent implements OnInit {
  isSaving = false;
  itemFeature: IItemFeature | null = null;

  productRepositoryItemsSharedCollection: IProductRepositoryItem[] = [];

  editForm: ItemFeatureFormGroup = this.itemFeatureFormService.createItemFeatureFormGroup();

  constructor(
    protected itemFeatureService: ItemFeatureService,
    protected itemFeatureFormService: ItemFeatureFormService,
    protected productRepositoryItemService: ProductRepositoryItemService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareProductRepositoryItem = (o1: IProductRepositoryItem | null, o2: IProductRepositoryItem | null): boolean =>
    this.productRepositoryItemService.compareProductRepositoryItem(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ itemFeature }) => {
      this.itemFeature = itemFeature;
      if (itemFeature) {
        this.updateForm(itemFeature);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const itemFeature = this.itemFeatureFormService.getItemFeature(this.editForm);
    if (itemFeature.id !== null) {
      this.subscribeToSaveResponse(this.itemFeatureService.update(itemFeature));
    } else {
      this.subscribeToSaveResponse(this.itemFeatureService.create(itemFeature));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IItemFeature>>): void {
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

  protected updateForm(itemFeature: IItemFeature): void {
    this.itemFeature = itemFeature;
    this.itemFeatureFormService.resetForm(this.editForm, itemFeature);

    this.productRepositoryItemsSharedCollection =
      this.productRepositoryItemService.addProductRepositoryItemToCollectionIfMissing<IProductRepositoryItem>(
        this.productRepositoryItemsSharedCollection,
        itemFeature.productRepositoryItem
      );
  }

  protected loadRelationshipsOptions(): void {
    this.productRepositoryItemService
      .query()
      .pipe(map((res: HttpResponse<IProductRepositoryItem[]>) => res.body ?? []))
      .pipe(
        map((productRepositoryItems: IProductRepositoryItem[]) =>
          this.productRepositoryItemService.addProductRepositoryItemToCollectionIfMissing<IProductRepositoryItem>(
            productRepositoryItems,
            this.itemFeature?.productRepositoryItem
          )
        )
      )
      .subscribe(
        (productRepositoryItems: IProductRepositoryItem[]) => (this.productRepositoryItemsSharedCollection = productRepositoryItems)
      );
  }
}
