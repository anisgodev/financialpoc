import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { BusinessRuleFormService } from './business-rule-form.service';
import { BusinessRuleService } from '../service/business-rule.service';
import { IBusinessRule } from '../business-rule.model';
import { IBusinessRuleCondition } from 'app/entities/business-rule-condition/business-rule-condition.model';
import { BusinessRuleConditionService } from 'app/entities/business-rule-condition/service/business-rule-condition.service';

import { BusinessRuleUpdateComponent } from './business-rule-update.component';

describe('BusinessRule Management Update Component', () => {
  let comp: BusinessRuleUpdateComponent;
  let fixture: ComponentFixture<BusinessRuleUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let businessRuleFormService: BusinessRuleFormService;
  let businessRuleService: BusinessRuleService;
  let businessRuleConditionService: BusinessRuleConditionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [BusinessRuleUpdateComponent],
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
      .overrideTemplate(BusinessRuleUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BusinessRuleUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    businessRuleFormService = TestBed.inject(BusinessRuleFormService);
    businessRuleService = TestBed.inject(BusinessRuleService);
    businessRuleConditionService = TestBed.inject(BusinessRuleConditionService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call BusinessRuleCondition query and add missing value', () => {
      const businessRule: IBusinessRule = { id: 'CBA' };
      const conditions: IBusinessRuleCondition = { id: '124fb984-a40a-413b-9bec-3d20795549ef' };
      businessRule.conditions = conditions;

      const businessRuleConditionCollection: IBusinessRuleCondition[] = [{ id: '4cb11216-42dc-483a-8dca-580a7520ad64' }];
      jest.spyOn(businessRuleConditionService, 'query').mockReturnValue(of(new HttpResponse({ body: businessRuleConditionCollection })));
      const additionalBusinessRuleConditions = [conditions];
      const expectedCollection: IBusinessRuleCondition[] = [...additionalBusinessRuleConditions, ...businessRuleConditionCollection];
      jest.spyOn(businessRuleConditionService, 'addBusinessRuleConditionToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ businessRule });
      comp.ngOnInit();

      expect(businessRuleConditionService.query).toHaveBeenCalled();
      expect(businessRuleConditionService.addBusinessRuleConditionToCollectionIfMissing).toHaveBeenCalledWith(
        businessRuleConditionCollection,
        ...additionalBusinessRuleConditions.map(expect.objectContaining)
      );
      expect(comp.businessRuleConditionsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const businessRule: IBusinessRule = { id: 'CBA' };
      const conditions: IBusinessRuleCondition = { id: '5d96e5bf-283e-4f51-a499-a47a4d8fde57' };
      businessRule.conditions = conditions;

      activatedRoute.data = of({ businessRule });
      comp.ngOnInit();

      expect(comp.businessRuleConditionsSharedCollection).toContain(conditions);
      expect(comp.businessRule).toEqual(businessRule);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBusinessRule>>();
      const businessRule = { id: 'ABC' };
      jest.spyOn(businessRuleFormService, 'getBusinessRule').mockReturnValue(businessRule);
      jest.spyOn(businessRuleService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ businessRule });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: businessRule }));
      saveSubject.complete();

      // THEN
      expect(businessRuleFormService.getBusinessRule).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(businessRuleService.update).toHaveBeenCalledWith(expect.objectContaining(businessRule));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBusinessRule>>();
      const businessRule = { id: 'ABC' };
      jest.spyOn(businessRuleFormService, 'getBusinessRule').mockReturnValue({ id: null });
      jest.spyOn(businessRuleService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ businessRule: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: businessRule }));
      saveSubject.complete();

      // THEN
      expect(businessRuleFormService.getBusinessRule).toHaveBeenCalled();
      expect(businessRuleService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBusinessRule>>();
      const businessRule = { id: 'ABC' };
      jest.spyOn(businessRuleService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ businessRule });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(businessRuleService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareBusinessRuleCondition', () => {
      it('Should forward to businessRuleConditionService', () => {
        const entity = { id: 'ABC' };
        const entity2 = { id: 'CBA' };
        jest.spyOn(businessRuleConditionService, 'compareBusinessRuleCondition');
        comp.compareBusinessRuleCondition(entity, entity2);
        expect(businessRuleConditionService.compareBusinessRuleCondition).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
