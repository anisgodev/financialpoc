import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IProductRepositoryItem } from '../product-repository-item.model';

@Component({
  selector: 'jhi-product-repository-item-detail',
  templateUrl: './product-repository-item-detail.component.html',
})
export class ProductRepositoryItemDetailComponent implements OnInit {
  productRepositoryItem: IProductRepositoryItem | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ productRepositoryItem }) => {
      this.productRepositoryItem = productRepositoryItem;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
