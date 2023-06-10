import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { SimulationFormService, SimulationFormGroup } from './simulation-form.service';
import { ISimulation } from '../simulation.model';
import { SimulationService } from '../service/simulation.service';
import { ICreditProduct } from 'app/entities/credit-product/credit-product.model';
import { CreditProductService } from 'app/entities/credit-product/service/credit-product.service';

@Component({
  selector: 'jhi-simulation-update',
  templateUrl: './simulation-update.component.html',
})
export class SimulationUpdateComponent implements OnInit {
  isSaving = false;
  simulation: ISimulation | null = null;

  creditProductsSharedCollection: ICreditProduct[] = [];

  editForm: SimulationFormGroup = this.simulationFormService.createSimulationFormGroup();

  constructor(
    protected simulationService: SimulationService,
    protected simulationFormService: SimulationFormService,
    protected creditProductService: CreditProductService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareCreditProduct = (o1: ICreditProduct | null, o2: ICreditProduct | null): boolean =>
    this.creditProductService.compareCreditProduct(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ simulation }) => {
      this.simulation = simulation;
      if (simulation) {
        this.updateForm(simulation);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const simulation = this.simulationFormService.getSimulation(this.editForm);
    if (simulation.id !== null) {
      this.subscribeToSaveResponse(this.simulationService.update(simulation));
    } else {
      this.subscribeToSaveResponse(this.simulationService.create(simulation));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISimulation>>): void {
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

  protected updateForm(simulation: ISimulation): void {
    this.simulation = simulation;
    this.simulationFormService.resetForm(this.editForm, simulation);

    this.creditProductsSharedCollection = this.creditProductService.addCreditProductToCollectionIfMissing<ICreditProduct>(
      this.creditProductsSharedCollection,
      simulation.creditProduct
    );
  }

  protected loadRelationshipsOptions(): void {
    this.creditProductService
      .query()
      .pipe(map((res: HttpResponse<ICreditProduct[]>) => res.body ?? []))
      .pipe(
        map((creditProducts: ICreditProduct[]) =>
          this.creditProductService.addCreditProductToCollectionIfMissing<ICreditProduct>(creditProducts, this.simulation?.creditProduct)
        )
      )
      .subscribe((creditProducts: ICreditProduct[]) => (this.creditProductsSharedCollection = creditProducts));
  }
}
