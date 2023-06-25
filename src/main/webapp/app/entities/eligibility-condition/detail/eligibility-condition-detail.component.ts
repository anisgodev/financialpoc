import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEligibilityCondition } from '../eligibility-condition.model';

@Component({
  selector: 'jhi-eligibility-condition-detail',
  templateUrl: './eligibility-condition-detail.component.html',
})
export class EligibilityConditionDetailComponent implements OnInit {
  eligibilityCondition: IEligibilityCondition | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ eligibilityCondition }) => {
      this.eligibilityCondition = eligibilityCondition;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
