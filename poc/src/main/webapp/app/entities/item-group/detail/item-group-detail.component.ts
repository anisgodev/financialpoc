import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IItemGroup } from '../item-group.model';

@Component({
  selector: 'jhi-item-group-detail',
  templateUrl: './item-group-detail.component.html',
})
export class ItemGroupDetailComponent implements OnInit {
  itemGroup: IItemGroup | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ itemGroup }) => {
      this.itemGroup = itemGroup;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
