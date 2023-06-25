import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IProductItemType } from '../product-item-type.model';

@Component({
  selector: 'jhi-product-item-type-detail',
  templateUrl: './product-item-type-detail.component.html',
})
export class ProductItemTypeDetailComponent implements OnInit {
  productItemType: IProductItemType | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ productItemType }) => {
      this.productItemType = productItemType;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
