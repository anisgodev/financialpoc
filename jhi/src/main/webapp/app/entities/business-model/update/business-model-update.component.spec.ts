import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { BusinessModelFormService } from './business-model-form.service';
import { BusinessModelService } from '../service/business-model.service';
import { IBusinessModel } from '../business-model.model';

import { BusinessModelUpdateComponent } from './business-model-update.component';

describe('BusinessModel Management Update Component', () => {
  let comp: BusinessModelUpdateComponent;
  let fixture: ComponentFixture<BusinessModelUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let businessModelFormService: BusinessModelFormService;
  let businessModelService: BusinessModelService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [BusinessModelUpdateComponent],
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
      .overrideTemplate(BusinessModelUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BusinessModelUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    businessModelFormService = TestBed.inject(BusinessModelFormService);
    businessModelService = TestBed.inject(BusinessModelService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call BusinessModel query and add missing value', () => {
      const businessModel: IBusinessModel = { id: 'CBA' };
      const relatedBusinessModels: IBusinessModel = { id: 'd2128fb2-2c35-4dfe-a017-10363d82d1fd' };
      businessModel.relatedBusinessModels = relatedBusinessModels;

      const businessModelCollection: IBusinessModel[] = [{ id: '4c87ff44-6143-4283-88c7-6b322f779db2' }];
      jest.spyOn(businessModelService, 'query').mockReturnValue(of(new HttpResponse({ body: businessModelCollection })));
      const additionalBusinessModels = [relatedBusinessModels];
      const expectedCollection: IBusinessModel[] = [...additionalBusinessModels, ...businessModelCollection];
      jest.spyOn(businessModelService, 'addBusinessModelToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ businessModel });
      comp.ngOnInit();

      expect(businessModelService.query).toHaveBeenCalled();
      expect(businessModelService.addBusinessModelToCollectionIfMissing).toHaveBeenCalledWith(
        businessModelCollection,
        ...additionalBusinessModels.map(expect.objectContaining)
      );
      expect(comp.businessModelsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const businessModel: IBusinessModel = { id: 'CBA' };
      const relatedBusinessModels: IBusinessModel = { id: '89500881-80d4-4d35-b19f-d79dddbcba32' };
      businessModel.relatedBusinessModels = relatedBusinessModels;

      activatedRoute.data = of({ businessModel });
      comp.ngOnInit();

      expect(comp.businessModelsSharedCollection).toContain(relatedBusinessModels);
      expect(comp.businessModel).toEqual(businessModel);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBusinessModel>>();
      const businessModel = { id: 'ABC' };
      jest.spyOn(businessModelFormService, 'getBusinessModel').mockReturnValue(businessModel);
      jest.spyOn(businessModelService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ businessModel });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: businessModel }));
      saveSubject.complete();

      // THEN
      expect(businessModelFormService.getBusinessModel).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(businessModelService.update).toHaveBeenCalledWith(expect.objectContaining(businessModel));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBusinessModel>>();
      const businessModel = { id: 'ABC' };
      jest.spyOn(businessModelFormService, 'getBusinessModel').mockReturnValue({ id: null });
      jest.spyOn(businessModelService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ businessModel: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: businessModel }));
      saveSubject.complete();

      // THEN
      expect(businessModelFormService.getBusinessModel).toHaveBeenCalled();
      expect(businessModelService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBusinessModel>>();
      const businessModel = { id: 'ABC' };
      jest.spyOn(businessModelService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ businessModel });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(businessModelService.update).toHaveBeenCalled();
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
  });
});
