import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { EligibilityConditionFormService, EligibilityConditionFormGroup } from './eligibility-condition-form.service';
import { IEligibilityCondition } from '../eligibility-condition.model';
import { EligibilityConditionService } from '../service/eligibility-condition.service';
import { ICondition } from 'app/entities/condition/condition.model';
import { ConditionService } from 'app/entities/condition/service/condition.service';
import { IItemFeature } from 'app/entities/item-feature/item-feature.model';
import { ItemFeatureService } from 'app/entities/item-feature/service/item-feature.service';
import { IProductRepositoryItem } from 'app/entities/product-repository-item/product-repository-item.model';
import { ProductRepositoryItemService } from 'app/entities/product-repository-item/service/product-repository-item.service';
import { IItemGroup } from 'app/entities/item-group/item-group.model';
import { ItemGroupService } from 'app/entities/item-group/service/item-group.service';
import { ApplyLevelEnum } from 'app/entities/enumerations/apply-level-enum.model';

@Component({
  selector: 'jhi-eligibility-condition-update',
  templateUrl: './eligibility-condition-update.component.html',
})
export class EligibilityConditionUpdateComponent implements OnInit {
  isSaving = false;
  eligibilityCondition: IEligibilityCondition | null = null;
  applyLevelEnumValues = Object.keys(ApplyLevelEnum);

  conditionsSharedCollection: ICondition[] = [];
  itemFeaturesSharedCollection: IItemFeature[] = [];
  productRepositoryItemsSharedCollection: IProductRepositoryItem[] = [];
  itemGroupsSharedCollection: IItemGroup[] = [];

  editForm: EligibilityConditionFormGroup = this.eligibilityConditionFormService.createEligibilityConditionFormGroup();

  constructor(
    protected eligibilityConditionService: EligibilityConditionService,
    protected eligibilityConditionFormService: EligibilityConditionFormService,
    protected conditionService: ConditionService,
    protected itemFeatureService: ItemFeatureService,
    protected productRepositoryItemService: ProductRepositoryItemService,
    protected itemGroupService: ItemGroupService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareCondition = (o1: ICondition | null, o2: ICondition | null): boolean => this.conditionService.compareCondition(o1, o2);

  compareItemFeature = (o1: IItemFeature | null, o2: IItemFeature | null): boolean => this.itemFeatureService.compareItemFeature(o1, o2);

  compareProductRepositoryItem = (o1: IProductRepositoryItem | null, o2: IProductRepositoryItem | null): boolean =>
    this.productRepositoryItemService.compareProductRepositoryItem(o1, o2);

  compareItemGroup = (o1: IItemGroup | null, o2: IItemGroup | null): boolean => this.itemGroupService.compareItemGroup(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ eligibilityCondition }) => {
      this.eligibilityCondition = eligibilityCondition;
      if (eligibilityCondition) {
        this.updateForm(eligibilityCondition);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const eligibilityCondition = this.eligibilityConditionFormService.getEligibilityCondition(this.editForm);
    if (eligibilityCondition.id !== null) {
      this.subscribeToSaveResponse(this.eligibilityConditionService.update(eligibilityCondition));
    } else {
      this.subscribeToSaveResponse(this.eligibilityConditionService.create(eligibilityCondition));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEligibilityCondition>>): void {
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

  protected updateForm(eligibilityCondition: IEligibilityCondition): void {
    this.eligibilityCondition = eligibilityCondition;
    this.eligibilityConditionFormService.resetForm(this.editForm, eligibilityCondition);

    this.conditionsSharedCollection = this.conditionService.addConditionToCollectionIfMissing<ICondition>(
      this.conditionsSharedCollection,
      eligibilityCondition.condition
    );
    this.itemFeaturesSharedCollection = this.itemFeatureService.addItemFeatureToCollectionIfMissing<IItemFeature>(
      this.itemFeaturesSharedCollection,
      eligibilityCondition.itemFeature
    );
    this.productRepositoryItemsSharedCollection =
      this.productRepositoryItemService.addProductRepositoryItemToCollectionIfMissing<IProductRepositoryItem>(
        this.productRepositoryItemsSharedCollection,
        eligibilityCondition.productRepositoryItem
      );
    this.itemGroupsSharedCollection = this.itemGroupService.addItemGroupToCollectionIfMissing<IItemGroup>(
      this.itemGroupsSharedCollection,
      eligibilityCondition.itemGroup
    );
  }

  protected loadRelationshipsOptions(): void {
    this.conditionService
      .query()
      .pipe(map((res: HttpResponse<ICondition[]>) => res.body ?? []))
      .pipe(
        map((conditions: ICondition[]) =>
          this.conditionService.addConditionToCollectionIfMissing<ICondition>(conditions, this.eligibilityCondition?.condition)
        )
      )
      .subscribe((conditions: ICondition[]) => (this.conditionsSharedCollection = conditions));

    this.itemFeatureService
      .query()
      .pipe(map((res: HttpResponse<IItemFeature[]>) => res.body ?? []))
      .pipe(
        map((itemFeatures: IItemFeature[]) =>
          this.itemFeatureService.addItemFeatureToCollectionIfMissing<IItemFeature>(itemFeatures, this.eligibilityCondition?.itemFeature)
        )
      )
      .subscribe((itemFeatures: IItemFeature[]) => (this.itemFeaturesSharedCollection = itemFeatures));

    this.productRepositoryItemService
      .query()
      .pipe(map((res: HttpResponse<IProductRepositoryItem[]>) => res.body ?? []))
      .pipe(
        map((productRepositoryItems: IProductRepositoryItem[]) =>
          this.productRepositoryItemService.addProductRepositoryItemToCollectionIfMissing<IProductRepositoryItem>(
            productRepositoryItems,
            this.eligibilityCondition?.productRepositoryItem
          )
        )
      )
      .subscribe(
        (productRepositoryItems: IProductRepositoryItem[]) => (this.productRepositoryItemsSharedCollection = productRepositoryItems)
      );

    this.itemGroupService
      .query()
      .pipe(map((res: HttpResponse<IItemGroup[]>) => res.body ?? []))
      .pipe(
        map((itemGroups: IItemGroup[]) =>
          this.itemGroupService.addItemGroupToCollectionIfMissing<IItemGroup>(itemGroups, this.eligibilityCondition?.itemGroup)
        )
      )
      .subscribe((itemGroups: IItemGroup[]) => (this.itemGroupsSharedCollection = itemGroups));
  }
}
