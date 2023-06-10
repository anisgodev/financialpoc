import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CreditProductInstanceFormService } from './credit-product-instance-form.service';
import { CreditProductInstanceService } from '../service/credit-product-instance.service';
import { ICreditProductInstance } from '../credit-product-instance.model';
import { ISimulation } from 'app/entities/simulation/simulation.model';
import { SimulationService } from 'app/entities/simulation/service/simulation.service';

import { CreditProductInstanceUpdateComponent } from './credit-product-instance-update.component';

describe('CreditProductInstance Management Update Component', () => {
  let comp: CreditProductInstanceUpdateComponent;
  let fixture: ComponentFixture<CreditProductInstanceUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let creditProductInstanceFormService: CreditProductInstanceFormService;
  let creditProductInstanceService: CreditProductInstanceService;
  let simulationService: SimulationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CreditProductInstanceUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(CreditProductInstanceUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CreditProductInstanceUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    creditProductInstanceFormService = TestBed.inject(CreditProductInstanceFormService);
    creditProductInstanceService = TestBed.inject(CreditProductInstanceService);
    simulationService = TestBed.inject(SimulationService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Simulation query and add missing value', () => {
      const creditProductInstance: ICreditProductInstance = { id: 'CBA' };
      const simulations: ISimulation = { id: 'f6a47e6d-187f-4373-83f4-6cb00c262441' };
      creditProductInstance.simulations = simulations;

      const simulationCollection: ISimulation[] = [{ id: '91b3384f-eb19-40bf-b3e3-87586e988018' }];
      jest.spyOn(simulationService, 'query').mockReturnValue(of(new HttpResponse({ body: simulationCollection })));
      const additionalSimulations = [simulations];
      const expectedCollection: ISimulation[] = [...additionalSimulations, ...simulationCollection];
      jest.spyOn(simulationService, 'addSimulationToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ creditProductInstance });
      comp.ngOnInit();

      expect(simulationService.query).toHaveBeenCalled();
      expect(simulationService.addSimulationToCollectionIfMissing).toHaveBeenCalledWith(
        simulationCollection,
        ...additionalSimulations.map(expect.objectContaining)
      );
      expect(comp.simulationsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const creditProductInstance: ICreditProductInstance = { id: 'CBA' };
      const simulations: ISimulation = { id: '94e53f07-7869-48c5-b8f6-98a9799cf945' };
      creditProductInstance.simulations = simulations;

      activatedRoute.data = of({ creditProductInstance });
      comp.ngOnInit();

      expect(comp.simulationsSharedCollection).toContain(simulations);
      expect(comp.creditProductInstance).toEqual(creditProductInstance);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICreditProductInstance>>();
      const creditProductInstance = { id: 'ABC' };
      jest.spyOn(creditProductInstanceFormService, 'getCreditProductInstance').mockReturnValue(creditProductInstance);
      jest.spyOn(creditProductInstanceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ creditProductInstance });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: creditProductInstance }));
      saveSubject.complete();

      // THEN
      expect(creditProductInstanceFormService.getCreditProductInstance).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(creditProductInstanceService.update).toHaveBeenCalledWith(expect.objectContaining(creditProductInstance));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICreditProductInstance>>();
      const creditProductInstance = { id: 'ABC' };
      jest.spyOn(creditProductInstanceFormService, 'getCreditProductInstance').mockReturnValue({ id: null });
      jest.spyOn(creditProductInstanceService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ creditProductInstance: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: creditProductInstance }));
      saveSubject.complete();

      // THEN
      expect(creditProductInstanceFormService.getCreditProductInstance).toHaveBeenCalled();
      expect(creditProductInstanceService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICreditProductInstance>>();
      const creditProductInstance = { id: 'ABC' };
      jest.spyOn(creditProductInstanceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ creditProductInstance });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(creditProductInstanceService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareSimulation', () => {
      it('Should forward to simulationService', () => {
        const entity = { id: 'ABC' };
        const entity2 = { id: 'CBA' };
        jest.spyOn(simulationService, 'compareSimulation');
        comp.compareSimulation(entity, entity2);
        expect(simulationService.compareSimulation).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
