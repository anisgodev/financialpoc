import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IBusinessModel } from '../business-model.model';

@Component({
  selector: 'jhi-business-model-detail',
  templateUrl: './business-model-detail.component.html',
})
export class BusinessModelDetailComponent implements OnInit {
  businessModel: IBusinessModel | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ businessModel }) => {
      this.businessModel = businessModel;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
