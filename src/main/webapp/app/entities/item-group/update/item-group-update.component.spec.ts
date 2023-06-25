import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ItemGroupFormService } from './item-group-form.service';
import { ItemGroupService } from '../service/item-group.service';
import { IItemGroup } from '../item-group.model';

import { ItemGroupUpdateComponent } from './item-group-update.component';

describe('ItemGroup Management Update Component', () => {
  let comp: ItemGroupUpdateComponent;
  let fixture: ComponentFixture<ItemGroupUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let itemGroupFormService: ItemGroupFormService;
  let itemGroupService: ItemGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ItemGroupUpdateComponent],
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
      .overrideTemplate(ItemGroupUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ItemGroupUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    itemGroupFormService = TestBed.inject(ItemGroupFormService);
    itemGroupService = TestBed.inject(ItemGroupService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const itemGroup: IItemGroup = { id: 456 };

      activatedRoute.data = of({ itemGroup });
      comp.ngOnInit();

      expect(comp.itemGroup).toEqual(itemGroup);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IItemGroup>>();
      const itemGroup = { id: 123 };
      jest.spyOn(itemGroupFormService, 'getItemGroup').mockReturnValue(itemGroup);
      jest.spyOn(itemGroupService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ itemGroup });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: itemGroup }));
      saveSubject.complete();

      // THEN
      expect(itemGroupFormService.getItemGroup).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(itemGroupService.update).toHaveBeenCalledWith(expect.objectContaining(itemGroup));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IItemGroup>>();
      const itemGroup = { id: 123 };
      jest.spyOn(itemGroupFormService, 'getItemGroup').mockReturnValue({ id: null });
      jest.spyOn(itemGroupService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ itemGroup: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: itemGroup }));
      saveSubject.complete();

      // THEN
      expect(itemGroupFormService.getItemGroup).toHaveBeenCalled();
      expect(itemGroupService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IItemGroup>>();
      const itemGroup = { id: 123 };
      jest.spyOn(itemGroupService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ itemGroup });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(itemGroupService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
