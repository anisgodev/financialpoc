import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { CreditProductInstanceFormService, CreditProductInstanceFormGroup } from './credit-product-instance-form.service';
import { ICreditProductInstance } from '../credit-product-instance.model';
import { CreditProductInstanceService } from '../service/credit-product-instance.service';
import { ISimulation } from 'app/entities/simulation/simulation.model';
import { SimulationService } from 'app/entities/simulation/service/simulation.service';

@Component({
  selector: 'jhi-credit-product-instance-update',
  templateUrl: './credit-product-instance-update.component.html',
})
export class CreditProductInstanceUpdateComponent implements OnInit {
  isSaving = false;
  creditProductInstance: ICreditProductInstance | null = null;

  simulationsSharedCollection: ISimulation[] = [];

  editForm: CreditProductInstanceFormGroup = this.creditProductInstanceFormService.createCreditProductInstanceFormGroup();

  constructor(
    protected creditProductInstanceService: CreditProductInstanceService,
    protected creditProductInstanceFormService: CreditProductInstanceFormService,
    protected simulationService: SimulationService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareSimulation = (o1: ISimulation | null, o2: ISimulation | null): boolean => this.simulationService.compareSimulation(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ creditProductInstance }) => {
      this.creditProductInstance = creditProductInstance;
      if (creditProductInstance) {
        this.updateForm(creditProductInstance);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const creditProductInstance = this.creditProductInstanceFormService.getCreditProductInstance(this.editForm);
    if (creditProductInstance.id !== null) {
      this.subscribeToSaveResponse(this.creditProductInstanceService.update(creditProductInstance));
    } else {
      this.subscribeToSaveResponse(this.creditProductInstanceService.create(creditProductInstance));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICreditProductInstance>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(creditProductInstance: ICreditProductInstance): void {
    this.creditProductInstance = creditProductInstance;
    this.creditProductInstanceFormService.resetForm(this.editForm, creditProductInstance);

    this.simulationsSharedCollection = this.simulationService.addSimulationToCollectionIfMissing<ISimulation>(
      this.simulationsSharedCollection,
      creditProductInstance.simulations
    );
  }

  protected loadRelationshipsOptions(): void {
    this.simulationService
      .query()
      .pipe(map((res: HttpResponse<ISimulation[]>) => res.body ?? []))
      .pipe(
        map((simulations: ISimulation[]) =>
          this.simulationService.addSimulationToCollectionIfMissing<ISimulation>(simulations, this.creditProductInstance?.simulations)
        )
      )
      .subscribe((simulations: ISimulation[]) => (this.simulationsSharedCollection = simulations));
  }
}
