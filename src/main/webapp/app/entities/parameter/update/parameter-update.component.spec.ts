import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ParameterFormService } from './parameter-form.service';
import { ParameterService } from '../service/parameter.service';
import { IParameter } from '../parameter.model';
import { IParameterDefType } from 'app/entities/parameter-def-type/parameter-def-type.model';
import { ParameterDefTypeService } from 'app/entities/parameter-def-type/service/parameter-def-type.service';
import { IExpectedValue } from 'app/entities/expected-value/expected-value.model';
import { ExpectedValueService } from 'app/entities/expected-value/service/expected-value.service';
import { IItemFeature } from 'app/entities/item-feature/item-feature.model';
import { ItemFeatureService } from 'app/entities/item-feature/service/item-feature.service';

import { ParameterUpdateComponent } from './parameter-update.component';

describe('Parameter Management Update Component', () => {
  let comp: ParameterUpdateComponent;
  let fixture: ComponentFixture<ParameterUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let parameterFormService: ParameterFormService;
  let parameterService: ParameterService;
  let parameterDefTypeService: ParameterDefTypeService;
  let expectedValueService: ExpectedValueService;
  let itemFeatureService: ItemFeatureService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ParameterUpdateComponent],
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
      .overrideTemplate(ParameterUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ParameterUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    parameterFormService = TestBed.inject(ParameterFormService);
    parameterService = TestBed.inject(ParameterService);
    parameterDefTypeService = TestBed.inject(ParameterDefTypeService);
    expectedValueService = TestBed.inject(ExpectedValueService);
    itemFeatureService = TestBed.inject(ItemFeatureService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call ParameterDefType query and add missing value', () => {
      const parameter: IParameter = { id: 456 };
      const parameterDefType: IParameterDefType = { id: 36860 };
      parameter.parameterDefType = parameterDefType;

      const parameterDefTypeCollection: IParameterDefType[] = [{ id: 11088 }];
      jest.spyOn(parameterDefTypeService, 'query').mockReturnValue(of(new HttpResponse({ body: parameterDefTypeCollection })));
      const additionalParameterDefTypes = [parameterDefType];
      const expectedCollection: IParameterDefType[] = [...additionalParameterDefTypes, ...parameterDefTypeCollection];
      jest.spyOn(parameterDefTypeService, 'addParameterDefTypeToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ parameter });
      comp.ngOnInit();

      expect(parameterDefTypeService.query).toHaveBeenCalled();
      expect(parameterDefTypeService.addParameterDefTypeToCollectionIfMissing).toHaveBeenCalledWith(
        parameterDefTypeCollection,
        ...additionalParameterDefTypes.map(expect.objectContaining)
      );
      expect(comp.parameterDefTypesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call ExpectedValue query and add missing value', () => {
      const parameter: IParameter = { id: 456 };
      const expectedValue: IExpectedValue = { id: 78074 };
      parameter.expectedValue = expectedValue;

      const expectedValueCollection: IExpectedValue[] = [{ id: 7570 }];
      jest.spyOn(expectedValueService, 'query').mockReturnValue(of(new HttpResponse({ body: expectedValueCollection })));
      const additionalExpectedValues = [expectedValue];
      const expectedCollection: IExpectedValue[] = [...additionalExpectedValues, ...expectedValueCollection];
      jest.spyOn(expectedValueService, 'addExpectedValueToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ parameter });
      comp.ngOnInit();

      expect(expectedValueService.query).toHaveBeenCalled();
      expect(expectedValueService.addExpectedValueToCollectionIfMissing).toHaveBeenCalledWith(
        expectedValueCollection,
        ...additionalExpectedValues.map(expect.objectContaining)
      );
      expect(comp.expectedValuesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call ItemFeature query and add missing value', () => {
      const parameter: IParameter = { id: 456 };
      const itemFeature: IItemFeature = { id: 76160 };
      parameter.itemFeature = itemFeature;

      const itemFeatureCollection: IItemFeature[] = [{ id: 33949 }];
      jest.spyOn(itemFeatureService, 'query').mockReturnValue(of(new HttpResponse({ body: itemFeatureCollection })));
      const additionalItemFeatures = [itemFeature];
      const expectedCollection: IItemFeature[] = [...additionalItemFeatures, ...itemFeatureCollection];
      jest.spyOn(itemFeatureService, 'addItemFeatureToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ parameter });
      comp.ngOnInit();

      expect(itemFeatureService.query).toHaveBeenCalled();
      expect(itemFeatureService.addItemFeatureToCollectionIfMissing).toHaveBeenCalledWith(
        itemFeatureCollection,
        ...additionalItemFeatures.map(expect.objectContaining)
      );
      expect(comp.itemFeaturesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const parameter: IParameter = { id: 456 };
      const parameterDefType: IParameterDefType = { id: 51890 };
      parameter.parameterDefType = parameterDefType;
      const expectedValue: IExpectedValue = { id: 36294 };
      parameter.expectedValue = expectedValue;
      const itemFeature: IItemFeature = { id: 60132 };
      parameter.itemFeature = itemFeature;

      activatedRoute.data = of({ parameter });
      comp.ngOnInit();

      expect(comp.parameterDefTypesSharedCollection).toContain(parameterDefType);
      expect(comp.expectedValuesSharedCollection).toContain(expectedValue);
      expect(comp.itemFeaturesSharedCollection).toContain(itemFeature);
      expect(comp.parameter).toEqual(parameter);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IParameter>>();
      const parameter = { id: 123 };
      jest.spyOn(parameterFormService, 'getParameter').mockReturnValue(parameter);
      jest.spyOn(parameterService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ parameter });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: parameter }));
      saveSubject.complete();

      // THEN
      expect(parameterFormService.getParameter).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(parameterService.update).toHaveBeenCalledWith(expect.objectContaining(parameter));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IParameter>>();
      const parameter = { id: 123 };
      jest.spyOn(parameterFormService, 'getParameter').mockReturnValue({ id: null });
      jest.spyOn(parameterService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ parameter: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: parameter }));
      saveSubject.complete();

      // THEN
      expect(parameterFormService.getParameter).toHaveBeenCalled();
      expect(parameterService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IParameter>>();
      const parameter = { id: 123 };
      jest.spyOn(parameterService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ parameter });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(parameterService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareParameterDefType', () => {
      it('Should forward to parameterDefTypeService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(parameterDefTypeService, 'compareParameterDefType');
        comp.compareParameterDefType(entity, entity2);
        expect(parameterDefTypeService.compareParameterDefType).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareExpectedValue', () => {
      it('Should forward to expectedValueService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(expectedValueService, 'compareExpectedValue');
        comp.compareExpectedValue(entity, entity2);
        expect(expectedValueService.compareExpectedValue).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareItemFeature', () => {
      it('Should forward to itemFeatureService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(itemFeatureService, 'compareItemFeature');
        comp.compareItemFeature(entity, entity2);
        expect(itemFeatureService.compareItemFeature).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
