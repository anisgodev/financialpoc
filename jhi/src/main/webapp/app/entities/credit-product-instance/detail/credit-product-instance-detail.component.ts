import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICreditProductInstance } from '../credit-product-instance.model';

@Component({
  selector: 'jhi-credit-product-instance-detail',
  templateUrl: './credit-product-instance-detail.component.html',
})
export class CreditProductInstanceDetailComponent implements OnInit {
  creditProductInstance: ICreditProductInstance | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ creditProductInstance }) => {
      this.creditProductInstance = creditProductInstance;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
