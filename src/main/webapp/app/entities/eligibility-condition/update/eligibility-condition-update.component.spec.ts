import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { EligibilityConditionFormService } from './eligibility-condition-form.service';
import { EligibilityConditionService } from '../service/eligibility-condition.service';
import { IEligibilityCondition } from '../eligibility-condition.model';
import { ICondition } from 'app/entities/condition/condition.model';
import { ConditionService } from 'app/entities/condition/service/condition.service';
import { IItemFeature } from 'app/entities/item-feature/item-feature.model';
import { ItemFeatureService } from 'app/entities/item-feature/service/item-feature.service';
import { IProductRepositoryItem } from 'app/entities/product-repository-item/product-repository-item.model';
import { ProductRepositoryItemService } from 'app/entities/product-repository-item/service/product-repository-item.service';
import { IItemGroup } from 'app/entities/item-group/item-group.model';
import { ItemGroupService } from 'app/entities/item-group/service/item-group.service';

import { EligibilityConditionUpdateComponent } from './eligibility-condition-update.component';

describe('EligibilityCondition Management Update Component', () => {
  let comp: EligibilityConditionUpdateComponent;
  let fixture: ComponentFixture<EligibilityConditionUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let eligibilityConditionFormService: EligibilityConditionFormService;
  let eligibilityConditionService: EligibilityConditionService;
  let conditionService: ConditionService;
  let itemFeatureService: ItemFeatureService;
  let productRepositoryItemService: ProductRepositoryItemService;
  let itemGroupService: ItemGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [EligibilityConditionUpdateComponent],
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
      .overrideTemplate(EligibilityConditionUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EligibilityConditionUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    eligibilityConditionFormService = TestBed.inject(EligibilityConditionFormService);
    eligibilityConditionService = TestBed.inject(EligibilityConditionService);
    conditionService = TestBed.inject(ConditionService);
    itemFeatureService = TestBed.inject(ItemFeatureService);
    productRepositoryItemService = TestBed.inject(ProductRepositoryItemService);
    itemGroupService = TestBed.inject(ItemGroupService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Condition query and add missing value', () => {
      const eligibilityCondition: IEligibilityCondition = { id: 456 };
      const condition: ICondition = { id: 90933 };
      eligibilityCondition.condition = condition;

      const conditionCollection: ICondition[] = [{ id: 5974 }];
      jest.spyOn(conditionService, 'query').mockReturnValue(of(new HttpResponse({ body: conditionCollection })));
      const additionalConditions = [condition];
      const expectedCollection: ICondition[] = [...additionalConditions, ...conditionCollection];
      jest.spyOn(conditionService, 'addConditionToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ eligibilityCondition });
      comp.ngOnInit();

      expect(conditionService.query).toHaveBeenCalled();
      expect(conditionService.addConditionToCollectionIfMissing).toHaveBeenCalledWith(
        conditionCollection,
        ...additionalConditions.map(expect.objectContaining)
      );
      expect(comp.conditionsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call ItemFeature query and add missing value', () => {
      const eligibilityCondition: IEligibilityCondition = { id: 456 };
      const itemFeature: IItemFeature = { id: 61635 };
      eligibilityCondition.itemFeature = itemFeature;

      const itemFeatureCollection: IItemFeature[] = [{ id: 86543 }];
      jest.spyOn(itemFeatureService, 'query').mockReturnValue(of(new HttpResponse({ body: itemFeatureCollection })));
      const additionalItemFeatures = [itemFeature];
      const expectedCollection: IItemFeature[] = [...additionalItemFeatures, ...itemFeatureCollection];
      jest.spyOn(itemFeatureService, 'addItemFeatureToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ eligibilityCondition });
      comp.ngOnInit();

      expect(itemFeatureService.query).toHaveBeenCalled();
      expect(itemFeatureService.addItemFeatureToCollectionIfMissing).toHaveBeenCalledWith(
        itemFeatureCollection,
        ...additionalItemFeatures.map(expect.objectContaining)
      );
      expect(comp.itemFeaturesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call ProductRepositoryItem query and add missing value', () => {
      const eligibilityCondition: IEligibilityCondition = { id: 456 };
      const productRepositoryItem: IProductRepositoryItem = { id: 26754 };
      eligibilityCondition.productRepositoryItem = productRepositoryItem;

      const productRepositoryItemCollection: IProductRepositoryItem[] = [{ id: 80380 }];
      jest.spyOn(productRepositoryItemService, 'query').mockReturnValue(of(new HttpResponse({ body: productRepositoryItemCollection })));
      const additionalProductRepositoryItems = [productRepositoryItem];
      const expectedCollection: IProductRepositoryItem[] = [...additionalProductRepositoryItems, ...productRepositoryItemCollection];
      jest.spyOn(productRepositoryItemService, 'addProductRepositoryItemToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ eligibilityCondition });
      comp.ngOnInit();

      expect(productRepositoryItemService.query).toHaveBeenCalled();
      expect(productRepositoryItemService.addProductRepositoryItemToCollectionIfMissing).toHaveBeenCalledWith(
        productRepositoryItemCollection,
        ...additionalProductRepositoryItems.map(expect.objectContaining)
      );
      expect(comp.productRepositoryItemsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call ItemGroup query and add missing value', () => {
      const eligibilityCondition: IEligibilityCondition = { id: 456 };
      const itemGroup: IItemGroup = { id: 11001 };
      eligibilityCondition.itemGroup = itemGroup;

      const itemGroupCollection: IItemGroup[] = [{ id: 99411 }];
      jest.spyOn(itemGroupService, 'query').mockReturnValue(of(new HttpResponse({ body: itemGroupCollection })));
      const additionalItemGroups = [itemGroup];
      const expectedCollection: IItemGroup[] = [...additionalItemGroups, ...itemGroupCollection];
      jest.spyOn(itemGroupService, 'addItemGroupToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ eligibilityCondition });
      comp.ngOnInit();

      expect(itemGroupService.query).toHaveBeenCalled();
      expect(itemGroupService.addItemGroupToCollectionIfMissing).toHaveBeenCalledWith(
        itemGroupCollection,
        ...additionalItemGroups.map(expect.objectContaining)
      );
      expect(comp.itemGroupsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const eligibilityCondition: IEligibilityCondition = { id: 456 };
      const condition: ICondition = { id: 97863 };
      eligibilityCondition.condition = condition;
      const itemFeature: IItemFeature = { id: 41555 };
      eligibilityCondition.itemFeature = itemFeature;
      const productRepositoryItem: IProductRepositoryItem = { id: 66506 };
      eligibilityCondition.productRepositoryItem = productRepositoryItem;
      const itemGroup: IItemGroup = { id: 94571 };
      eligibilityCondition.itemGroup = itemGroup;

      activatedRoute.data = of({ eligibilityCondition });
      comp.ngOnInit();

      expect(comp.conditionsSharedCollection).toContain(condition);
      expect(comp.itemFeaturesSharedCollection).toContain(itemFeature);
      expect(comp.productRepositoryItemsSharedCollection).toContain(productRepositoryItem);
      expect(comp.itemGroupsSharedCollection).toContain(itemGroup);
      expect(comp.eligibilityCondition).toEqual(eligibilityCondition);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEligibilityCondition>>();
      const eligibilityCondition = { id: 123 };
      jest.spyOn(eligibilityConditionFormService, 'getEligibilityCondition').mockReturnValue(eligibilityCondition);
      jest.spyOn(eligibilityConditionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ eligibilityCondition });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: eligibilityCondition }));
      saveSubject.complete();

      // THEN
      expect(eligibilityConditionFormService.getEligibilityCondition).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(eligibilityConditionService.update).toHaveBeenCalledWith(expect.objectContaining(eligibilityCondition));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEligibilityCondition>>();
      const eligibilityCondition = { id: 123 };
      jest.spyOn(eligibilityConditionFormService, 'getEligibilityCondition').mockReturnValue({ id: null });
      jest.spyOn(eligibilityConditionService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ eligibilityCondition: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: eligibilityCondition }));
      saveSubject.complete();

      // THEN
      expect(eligibilityConditionFormService.getEligibilityCondition).toHaveBeenCalled();
      expect(eligibilityConditionService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEligibilityCondition>>();
      const eligibilityCondition = { id: 123 };
      jest.spyOn(eligibilityConditionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ eligibilityCondition });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(eligibilityConditionService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareCondition', () => {
      it('Should forward to conditionService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(conditionService, 'compareCondition');
        comp.compareCondition(entity, entity2);
        expect(conditionService.compareCondition).toHaveBeenCalledWith(entity, entity2);
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

    describe('compareProductRepositoryItem', () => {
      it('Should forward to productRepositoryItemService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(productRepositoryItemService, 'compareProductRepositoryItem');
        comp.compareProductRepositoryItem(entity, entity2);
        expect(productRepositoryItemService.compareProductRepositoryItem).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareItemGroup', () => {
      it('Should forward to itemGroupService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(itemGroupService, 'compareItemGroup');
        comp.compareItemGroup(entity, entity2);
        expect(itemGroupService.compareItemGroup).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
