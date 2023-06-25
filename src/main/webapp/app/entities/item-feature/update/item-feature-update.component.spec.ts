import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ItemFeatureFormService } from './item-feature-form.service';
import { ItemFeatureService } from '../service/item-feature.service';
import { IItemFeature } from '../item-feature.model';
import { IProductRepositoryItem } from 'app/entities/product-repository-item/product-repository-item.model';
import { ProductRepositoryItemService } from 'app/entities/product-repository-item/service/product-repository-item.service';

import { ItemFeatureUpdateComponent } from './item-feature-update.component';

describe('ItemFeature Management Update Component', () => {
  let comp: ItemFeatureUpdateComponent;
  let fixture: ComponentFixture<ItemFeatureUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let itemFeatureFormService: ItemFeatureFormService;
  let itemFeatureService: ItemFeatureService;
  let productRepositoryItemService: ProductRepositoryItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ItemFeatureUpdateComponent],
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
      .overrideTemplate(ItemFeatureUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ItemFeatureUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    itemFeatureFormService = TestBed.inject(ItemFeatureFormService);
    itemFeatureService = TestBed.inject(ItemFeatureService);
    productRepositoryItemService = TestBed.inject(ProductRepositoryItemService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call ProductRepositoryItem query and add missing value', () => {
      const itemFeature: IItemFeature = { id: 456 };
      const productRepositoryItem: IProductRepositoryItem = { id: 79449 };
      itemFeature.productRepositoryItem = productRepositoryItem;

      const productRepositoryItemCollection: IProductRepositoryItem[] = [{ id: 21536 }];
      jest.spyOn(productRepositoryItemService, 'query').mockReturnValue(of(new HttpResponse({ body: productRepositoryItemCollection })));
      const additionalProductRepositoryItems = [productRepositoryItem];
      const expectedCollection: IProductRepositoryItem[] = [...additionalProductRepositoryItems, ...productRepositoryItemCollection];
      jest.spyOn(productRepositoryItemService, 'addProductRepositoryItemToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ itemFeature });
      comp.ngOnInit();

      expect(productRepositoryItemService.query).toHaveBeenCalled();
      expect(productRepositoryItemService.addProductRepositoryItemToCollectionIfMissing).toHaveBeenCalledWith(
        productRepositoryItemCollection,
        ...additionalProductRepositoryItems.map(expect.objectContaining)
      );
      expect(comp.productRepositoryItemsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const itemFeature: IItemFeature = { id: 456 };
      const productRepositoryItem: IProductRepositoryItem = { id: 53474 };
      itemFeature.productRepositoryItem = productRepositoryItem;

      activatedRoute.data = of({ itemFeature });
      comp.ngOnInit();

      expect(comp.productRepositoryItemsSharedCollection).toContain(productRepositoryItem);
      expect(comp.itemFeature).toEqual(itemFeature);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IItemFeature>>();
      const itemFeature = { id: 123 };
      jest.spyOn(itemFeatureFormService, 'getItemFeature').mockReturnValue(itemFeature);
      jest.spyOn(itemFeatureService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ itemFeature });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: itemFeature }));
      saveSubject.complete();

      // THEN
      expect(itemFeatureFormService.getItemFeature).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(itemFeatureService.update).toHaveBeenCalledWith(expect.objectContaining(itemFeature));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IItemFeature>>();
      const itemFeature = { id: 123 };
      jest.spyOn(itemFeatureFormService, 'getItemFeature').mockReturnValue({ id: null });
      jest.spyOn(itemFeatureService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ itemFeature: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: itemFeature }));
      saveSubject.complete();

      // THEN
      expect(itemFeatureFormService.getItemFeature).toHaveBeenCalled();
      expect(itemFeatureService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IItemFeature>>();
      const itemFeature = { id: 123 };
      jest.spyOn(itemFeatureService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ itemFeature });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(itemFeatureService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareProductRepositoryItem', () => {
      it('Should forward to productRepositoryItemService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(productRepositoryItemService, 'compareProductRepositoryItem');
        comp.compareProductRepositoryItem(entity, entity2);
        expect(productRepositoryItemService.compareProductRepositoryItem).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
