import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ProductItemTypeFormService } from './product-item-type-form.service';
import { ProductItemTypeService } from '../service/product-item-type.service';
import { IProductItemType } from '../product-item-type.model';

import { ProductItemTypeUpdateComponent } from './product-item-type-update.component';

describe('ProductItemType Management Update Component', () => {
  let comp: ProductItemTypeUpdateComponent;
  let fixture: ComponentFixture<ProductItemTypeUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let productItemTypeFormService: ProductItemTypeFormService;
  let productItemTypeService: ProductItemTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ProductItemTypeUpdateComponent],
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
      .overrideTemplate(ProductItemTypeUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ProductItemTypeUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    productItemTypeFormService = TestBed.inject(ProductItemTypeFormService);
    productItemTypeService = TestBed.inject(ProductItemTypeService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const productItemType: IProductItemType = { id: 456 };

      activatedRoute.data = of({ productItemType });
      comp.ngOnInit();

      expect(comp.productItemType).toEqual(productItemType);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProductItemType>>();
      const productItemType = { id: 123 };
      jest.spyOn(productItemTypeFormService, 'getProductItemType').mockReturnValue(productItemType);
      jest.spyOn(productItemTypeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ productItemType });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: productItemType }));
      saveSubject.complete();

      // THEN
      expect(productItemTypeFormService.getProductItemType).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(productItemTypeService.update).toHaveBeenCalledWith(expect.objectContaining(productItemType));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProductItemType>>();
      const productItemType = { id: 123 };
      jest.spyOn(productItemTypeFormService, 'getProductItemType').mockReturnValue({ id: null });
      jest.spyOn(productItemTypeService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ productItemType: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: productItemType }));
      saveSubject.complete();

      // THEN
      expect(productItemTypeFormService.getProductItemType).toHaveBeenCalled();
      expect(productItemTypeService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProductItemType>>();
      const productItemType = { id: 123 };
      jest.spyOn(productItemTypeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ productItemType });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(productItemTypeService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
