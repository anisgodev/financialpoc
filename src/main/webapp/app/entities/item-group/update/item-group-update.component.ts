import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ItemGroupFormService, ItemGroupFormGroup } from './item-group-form.service';
import { IItemGroup } from '../item-group.model';
import { ItemGroupService } from '../service/item-group.service';

@Component({
  selector: 'jhi-item-group-update',
  templateUrl: './item-group-update.component.html',
})
export class ItemGroupUpdateComponent implements OnInit {
  isSaving = false;
  itemGroup: IItemGroup | null = null;

  editForm: ItemGroupFormGroup = this.itemGroupFormService.createItemGroupFormGroup();

  constructor(
    protected itemGroupService: ItemGroupService,
    protected itemGroupFormService: ItemGroupFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ itemGroup }) => {
      this.itemGroup = itemGroup;
      if (itemGroup) {
        this.updateForm(itemGroup);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const itemGroup = this.itemGroupFormService.getItemGroup(this.editForm);
    if (itemGroup.id !== null) {
      this.subscribeToSaveResponse(this.itemGroupService.update(itemGroup));
    } else {
      this.subscribeToSaveResponse(this.itemGroupService.create(itemGroup));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IItemGroup>>): void {
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

  protected updateForm(itemGroup: IItemGroup): void {
    this.itemGroup = itemGroup;
    this.itemGroupFormService.resetForm(this.editForm, itemGroup);
  }
}
