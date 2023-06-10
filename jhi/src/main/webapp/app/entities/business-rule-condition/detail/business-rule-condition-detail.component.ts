import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IBusinessRuleCondition } from '../business-rule-condition.model';

@Component({
  selector: 'jhi-business-rule-condition-detail',
  templateUrl: './business-rule-condition-detail.component.html',
})
export class BusinessRuleConditionDetailComponent implements OnInit {
  businessRuleCondition: IBusinessRuleCondition | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ businessRuleCondition }) => {
      this.businessRuleCondition = businessRuleCondition;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
