import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ProductRepositoryItemFormService } from './product-repository-item-form.service';
import { ProductRepositoryItemService } from '../service/product-repository-item.service';
import { IProductRepositoryItem } from '../product-repository-item.model';
import { IProductItemType } from 'app/entities/product-item-type/product-item-type.model';
import { ProductItemTypeService } from 'app/entities/product-item-type/service/product-item-type.service';

import { ProductRepositoryItemUpdateComponent } from './product-repository-item-update.component';

describe('ProductRepositoryItem Management Update Component', () => {
  let comp: ProductRepositoryItemUpdateComponent;
  let fixture: ComponentFixture<ProductRepositoryItemUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let productRepositoryItemFormService: ProductRepositoryItemFormService;
  let productRepositoryItemService: ProductRepositoryItemService;
  let productItemTypeService: ProductItemTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ProductRepositoryItemUpdateComponent],
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
      .overrideTemplate(ProductRepositoryItemUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ProductRepositoryItemUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    productRepositoryItemFormService = TestBed.inject(ProductRepositoryItemFormService);
    productRepositoryItemService = TestBed.inject(ProductRepositoryItemService);
    productItemTypeService = TestBed.inject(ProductItemTypeService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call ProductItemType query and add missing value', () => {
      const productRepositoryItem: IProductRepositoryItem = { id: 456 };
      const productItemType: IProductItemType = { id: 24644 };
      productRepositoryItem.productItemType = productItemType;

      const productItemTypeCollection: IProductItemType[] = [{ id: 88937 }];
      jest.spyOn(productItemTypeService, 'query').mockReturnValue(of(new HttpResponse({ body: productItemTypeCollection })));
      const additionalProductItemTypes = [productItemType];
      const expectedCollection: IProductItemType[] = [...additionalProductItemTypes, ...productItemTypeCollection];
      jest.spyOn(productItemTypeService, 'addProductItemTypeToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ productRepositoryItem });
      comp.ngOnInit();

      expect(productItemTypeService.query).toHaveBeenCalled();
      expect(productItemTypeService.addProductItemTypeToCollectionIfMissing).toHaveBeenCalledWith(
        productItemTypeCollection,
        ...additionalProductItemTypes.map(expect.objectContaining)
      );
      expect(comp.productItemTypesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const productRepositoryItem: IProductRepositoryItem = { id: 456 };
      const productItemType: IProductItemType = { id: 88681 };
      productRepositoryItem.productItemType = productItemType;

      activatedRoute.data = of({ productRepositoryItem });
      comp.ngOnInit();

      expect(comp.productItemTypesSharedCollection).toContain(productItemType);
      expect(comp.productRepositoryItem).toEqual(productRepositoryItem);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProductRepositoryItem>>();
      const productRepositoryItem = { id: 123 };
      jest.spyOn(productRepositoryItemFormService, 'getProductRepositoryItem').mockReturnValue(productRepositoryItem);
      jest.spyOn(productRepositoryItemService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ productRepositoryItem });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: productRepositoryItem }));
      saveSubject.complete();

      // THEN
      expect(productRepositoryItemFormService.getProductRepositoryItem).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(productRepositoryItemService.update).toHaveBeenCalledWith(expect.objectContaining(productRepositoryItem));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProductRepositoryItem>>();
      const productRepositoryItem = { id: 123 };
      jest.spyOn(productRepositoryItemFormService, 'getProductRepositoryItem').mockReturnValue({ id: null });
      jest.spyOn(productRepositoryItemService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ productRepositoryItem: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: productRepositoryItem }));
      saveSubject.complete();

      // THEN
      expect(productRepositoryItemFormService.getProductRepositoryItem).toHaveBeenCalled();
      expect(productRepositoryItemService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProductRepositoryItem>>();
      const productRepositoryItem = { id: 123 };
      jest.spyOn(productRepositoryItemService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ productRepositoryItem });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(productRepositoryItemService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareProductItemType', () => {
      it('Should forward to productItemTypeService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(productItemTypeService, 'compareProductItemType');
        comp.compareProductItemType(entity, entity2);
        expect(productItemTypeService.compareProductItemType).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
