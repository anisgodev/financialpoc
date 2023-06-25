import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICondition } from '../condition.model';

@Component({
  selector: 'jhi-condition-detail',
  templateUrl: './condition-detail.component.html',
})
export class ConditionDetailComponent implements OnInit {
  condition: ICondition | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ condition }) => {
      this.condition = condition;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
