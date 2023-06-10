import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IBusinessRule } from '../business-rule.model';

@Component({
  selector: 'jhi-business-rule-detail',
  templateUrl: './business-rule-detail.component.html',
})
export class BusinessRuleDetailComponent implements OnInit {
  businessRule: IBusinessRule | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ businessRule }) => {
      this.businessRule = businessRule;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
