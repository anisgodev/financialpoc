import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CreditProductFormService } from './credit-product-form.service';
import { CreditProductService } from '../service/credit-product.service';
import { ICreditProduct } from '../credit-product.model';
import { IBusinessModel } from 'app/entities/business-model/business-model.model';
import { BusinessModelService } from 'app/entities/business-model/service/business-model.service';
import { IBusinessRule } from 'app/entities/business-rule/business-rule.model';
import { BusinessRuleService } from 'app/entities/business-rule/service/business-rule.service';

import { CreditProductUpdateComponent } from './credit-product-update.component';

describe('CreditProduct Management Update Component', () => {
  let comp: CreditProductUpdateComponent;
  let fixture: ComponentFixture<CreditProductUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let creditProductFormService: CreditProductFormService;
  let creditProductService: CreditProductService;
  let businessModelService: BusinessModelService;
  let businessRuleService: BusinessRuleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CreditProductUpdateComponent],
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
      .overrideTemplate(CreditProductUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CreditProductUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    creditProductFormService = TestBed.inject(CreditProductFormService);
    creditProductService = TestBed.inject(CreditProductService);
    businessModelService = TestBed.inject(BusinessModelService);
    businessRuleService = TestBed.inject(BusinessRuleService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call BusinessModel query and add missing value', () => {
      const creditProduct: ICreditProduct = { id: 'CBA' };
      const businessModels: IBusinessModel = { id: '0dcc3356-9be4-4102-878a-d6cef0db1abd' };
      creditProduct.businessModels = businessModels;

      const businessModelCollection: IBusinessModel[] = [{ id: '7131f753-db21-415f-a7df-6239aa7e44f9' }];
      jest.spyOn(businessModelService, 'query').mockReturnValue(of(new HttpResponse({ body: businessModelCollection })));
      const additionalBusinessModels = [businessModels];
      const expectedCollection: IBusinessModel[] = [...additionalBusinessModels, ...businessModelCollection];
      jest.spyOn(businessModelService, 'addBusinessModelToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ creditProduct });
      comp.ngOnInit();

      expect(businessModelService.query).toHaveBeenCalled();
      expect(businessModelService.addBusinessModelToCollectionIfMissing).toHaveBeenCalledWith(
        businessModelCollection,
        ...additionalBusinessModels.map(expect.objectContaining)
      );
      expect(comp.businessModelsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call BusinessRule query and add missing value', () => {
      const creditProduct: ICreditProduct = { id: 'CBA' };
      const rules: IBusinessRule = { id: '0020df8f-74ef-4467-8d3f-57c0bbb152a5' };
      creditProduct.rules = rules;

      const businessRuleCollection: IBusinessRule[] = [{ id: '083d3963-cb11-4945-9ce9-9af6e5c0f134' }];
      jest.spyOn(businessRuleService, 'query').mockReturnValue(of(new HttpResponse({ body: businessRuleCollection })));
      const additionalBusinessRules = [rules];
      const expectedCollection: IBusinessRule[] = [...additionalBusinessRules, ...businessRuleCollection];
      jest.spyOn(businessRuleService, 'addBusinessRuleToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ creditProduct });
      comp.ngOnInit();

      expect(businessRuleService.query).toHaveBeenCalled();
      expect(businessRuleService.addBusinessRuleToCollectionIfMissing).toHaveBeenCalledWith(
        businessRuleCollection,
        ...additionalBusinessRules.map(expect.objectContaining)
      );
      expect(comp.businessRulesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const creditProduct: ICreditProduct = { id: 'CBA' };
      const businessModels: IBusinessModel = { id: 'cedcf1e0-8517-474b-94a8-47479c307b21' };
      creditProduct.businessModels = businessModels;
      const rules: IBusinessRule = { id: '77bf3591-388a-4ef5-912d-6e63284ac1cb' };
      creditProduct.rules = rules;

      activatedRoute.data = of({ creditProduct });
      comp.ngOnInit();

      expect(comp.businessModelsSharedCollection).toContain(businessModels);
      expect(comp.businessRulesSharedCollection).toContain(rules);
      expect(comp.creditProduct).toEqual(creditProduct);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICreditProduct>>();
      const creditProduct = { id: 'ABC' };
      jest.spyOn(creditProductFormService, 'getCreditProduct').mockReturnValue(creditProduct);
      jest.spyOn(creditProductService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ creditProduct });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: creditProduct }));
      saveSubject.complete();

      // THEN
      expect(creditProductFormService.getCreditProduct).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(creditProductService.update).toHaveBeenCalledWith(expect.objectContaining(creditProduct));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICreditProduct>>();
      const creditProduct = { id: 'ABC' };
      jest.spyOn(creditProductFormService, 'getCreditProduct').mockReturnValue({ id: null });
      jest.spyOn(creditProductService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ creditProduct: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: creditProduct }));
      saveSubject.complete();

      // THEN
      expect(creditProductFormService.getCreditProduct).toHaveBeenCalled();
      expect(creditProductService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICreditProduct>>();
      const creditProduct = { id: 'ABC' };
      jest.spyOn(creditProductService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ creditProduct });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(creditProductService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareBusinessModel', () => {
      it('Should forward to businessModelService', () => {
        const entity = { id: 'ABC' };
        const entity2 = { id: 'CBA' };
        jest.spyOn(businessModelService, 'compareBusinessModel');
        comp.compareBusinessModel(entity, entity2);
        expect(businessModelService.compareBusinessModel).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareBusinessRule', () => {
      it('Should forward to businessRuleService', () => {
        const entity = { id: 'ABC' };
        const entity2 = { id: 'CBA' };
        jest.spyOn(businessRuleService, 'compareBusinessRule');
        comp.compareBusinessRule(entity, entity2);
        expect(businessRuleService.compareBusinessRule).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
