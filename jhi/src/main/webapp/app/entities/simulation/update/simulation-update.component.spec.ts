import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { SimulationFormService } from './simulation-form.service';
import { SimulationService } from '../service/simulation.service';
import { ISimulation } from '../simulation.model';
import { ICreditProduct } from 'app/entities/credit-product/credit-product.model';
import { CreditProductService } from 'app/entities/credit-product/service/credit-product.service';

import { SimulationUpdateComponent } from './simulation-update.component';

describe('Simulation Management Update Component', () => {
  let comp: SimulationUpdateComponent;
  let fixture: ComponentFixture<SimulationUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let simulationFormService: SimulationFormService;
  let simulationService: SimulationService;
  let creditProductService: CreditProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [SimulationUpdateComponent],
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
      .overrideTemplate(SimulationUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SimulationUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    simulationFormService = TestBed.inject(SimulationFormService);
    simulationService = TestBed.inject(SimulationService);
    creditProductService = TestBed.inject(CreditProductService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call CreditProduct query and add missing value', () => {
      const simulation: ISimulation = { id: 'CBA' };
      const creditProduct: ICreditProduct = { id: 'bbecfd6b-87b5-441a-b6f7-49efa288d224' };
      simulation.creditProduct = creditProduct;

      const creditProductCollection: ICreditProduct[] = [{ id: '6e94d88a-e238-409e-a149-bf7d58766925' }];
      jest.spyOn(creditProductService, 'query').mockReturnValue(of(new HttpResponse({ body: creditProductCollection })));
      const additionalCreditProducts = [creditProduct];
      const expectedCollection: ICreditProduct[] = [...additionalCreditProducts, ...creditProductCollection];
      jest.spyOn(creditProductService, 'addCreditProductToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ simulation });
      comp.ngOnInit();

      expect(creditProductService.query).toHaveBeenCalled();
      expect(creditProductService.addCreditProductToCollectionIfMissing).toHaveBeenCalledWith(
        creditProductCollection,
        ...additionalCreditProducts.map(expect.objectContaining)
      );
      expect(comp.creditProductsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const simulation: ISimulation = { id: 'CBA' };
      const creditProduct: ICreditProduct = { id: 'bb699537-53c8-4bcf-af56-b0a05445d3ae' };
      simulation.creditProduct = creditProduct;

      activatedRoute.data = of({ simulation });
      comp.ngOnInit();

      expect(comp.creditProductsSharedCollection).toContain(creditProduct);
      expect(comp.simulation).toEqual(simulation);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISimulation>>();
      const simulation = { id: 'ABC' };
      jest.spyOn(simulationFormService, 'getSimulation').mockReturnValue(simulation);
      jest.spyOn(simulationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ simulation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: simulation }));
      saveSubject.complete();

      // THEN
      expect(simulationFormService.getSimulation).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(simulationService.update).toHaveBeenCalledWith(expect.objectContaining(simulation));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISimulation>>();
      const simulation = { id: 'ABC' };
      jest.spyOn(simulationFormService, 'getSimulation').mockReturnValue({ id: null });
      jest.spyOn(simulationService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ simulation: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: simulation }));
      saveSubject.complete();

      // THEN
      expect(simulationFormService.getSimulation).toHaveBeenCalled();
      expect(simulationService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISimulation>>();
      const simulation = { id: 'ABC' };
      jest.spyOn(simulationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ simulation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(simulationService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareCreditProduct', () => {
      it('Should forward to creditProductService', () => {
        const entity = { id: 'ABC' };
        const entity2 = { id: 'CBA' };
        jest.spyOn(creditProductService, 'compareCreditProduct');
        comp.compareCreditProduct(entity, entity2);
        expect(creditProductService.compareCreditProduct).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
