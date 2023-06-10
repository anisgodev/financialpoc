import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICreditProduct } from '../credit-product.model';

@Component({
  selector: 'jhi-credit-product-detail',
  templateUrl: './credit-product-detail.component.html',
})
export class CreditProductDetailComponent implements OnInit {
  creditProduct: ICreditProduct | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ creditProduct }) => {
      this.creditProduct = creditProduct;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
