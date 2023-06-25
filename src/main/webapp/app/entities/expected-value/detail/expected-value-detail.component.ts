import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IExpectedValue } from '../expected-value.model';

@Component({
  selector: 'jhi-expected-value-detail',
  templateUrl: './expected-value-detail.component.html',
})
export class ExpectedValueDetailComponent implements OnInit {
  expectedValue: IExpectedValue | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ expectedValue }) => {
      this.expectedValue = expectedValue;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
