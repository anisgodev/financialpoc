import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { BusinessRuleConditionFormService } from './business-rule-condition-form.service';
import { BusinessRuleConditionService } from '../service/business-rule-condition.service';
import { IBusinessRuleCondition } from '../business-rule-condition.model';

import { BusinessRuleConditionUpdateComponent } from './business-rule-condition-update.component';

describe('BusinessRuleCondition Management Update Component', () => {
  let comp: BusinessRuleConditionUpdateComponent;
  let fixture: ComponentFixture<BusinessRuleConditionUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let businessRuleConditionFormService: BusinessRuleConditionFormService;
  let businessRuleConditionService: BusinessRuleConditionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [BusinessRuleConditionUpdateComponent],
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
      .overrideTemplate(BusinessRuleConditionUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BusinessRuleConditionUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    businessRuleConditionFormService = TestBed.inject(BusinessRuleConditionFormService);
    businessRuleConditionService = TestBed.inject(BusinessRuleConditionService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const businessRuleCondition: IBusinessRuleCondition = { id: 'CBA' };

      activatedRoute.data = of({ businessRuleCondition });
      comp.ngOnInit();

      expect(comp.businessRuleCondition).toEqual(businessRuleCondition);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBusinessRuleCondition>>();
      const businessRuleCondition = { id: 'ABC' };
      jest.spyOn(businessRuleConditionFormService, 'getBusinessRuleCondition').mockReturnValue(businessRuleCondition);
      jest.spyOn(businessRuleConditionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ businessRuleCondition });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: businessRuleCondition }));
      saveSubject.complete();

      // THEN
      expect(businessRuleConditionFormService.getBusinessRuleCondition).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(businessRuleConditionService.update).toHaveBeenCalledWith(expect.objectContaining(businessRuleCondition));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBusinessRuleCondition>>();
      const businessRuleCondition = { id: 'ABC' };
      jest.spyOn(businessRuleConditionFormService, 'getBusinessRuleCondition').mockReturnValue({ id: null });
      jest.spyOn(businessRuleConditionService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ businessRuleCondition: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: businessRuleCondition }));
      saveSubject.complete();

      // THEN
      expect(businessRuleConditionFormService.getBusinessRuleCondition).toHaveBeenCalled();
      expect(businessRuleConditionService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBusinessRuleCondition>>();
      const businessRuleCondition = { id: 'ABC' };
      jest.spyOn(businessRuleConditionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ businessRuleCondition });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(businessRuleConditionService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
