import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IItemFeature } from '../item-feature.model';

@Component({
  selector: 'jhi-item-feature-detail',
  templateUrl: './item-feature-detail.component.html',
})
export class ItemFeatureDetailComponent implements OnInit {
  itemFeature: IItemFeature | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ itemFeature }) => {
      this.itemFeature = itemFeature;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
