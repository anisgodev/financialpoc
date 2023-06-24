import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IParameterDefType } from '../parameter-def-type.model';

@Component({
  selector: 'jhi-parameter-def-type-detail',
  templateUrl: './parameter-def-type-detail.component.html',
})
export class ParameterDefTypeDetailComponent implements OnInit {
  parameterDefType: IParameterDefType | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ parameterDefType }) => {
      this.parameterDefType = parameterDefType;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
