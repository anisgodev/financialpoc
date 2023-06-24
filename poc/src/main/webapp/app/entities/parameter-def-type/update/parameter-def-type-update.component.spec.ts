import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ParameterDefTypeFormService } from './parameter-def-type-form.service';
import { ParameterDefTypeService } from '../service/parameter-def-type.service';
import { IParameterDefType } from '../parameter-def-type.model';

import { ParameterDefTypeUpdateComponent } from './parameter-def-type-update.component';

describe('ParameterDefType Management Update Component', () => {
  let comp: ParameterDefTypeUpdateComponent;
  let fixture: ComponentFixture<ParameterDefTypeUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let parameterDefTypeFormService: ParameterDefTypeFormService;
  let parameterDefTypeService: ParameterDefTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ParameterDefTypeUpdateComponent],
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
      .overrideTemplate(ParameterDefTypeUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ParameterDefTypeUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    parameterDefTypeFormService = TestBed.inject(ParameterDefTypeFormService);
    parameterDefTypeService = TestBed.inject(ParameterDefTypeService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const parameterDefType: IParameterDefType = { id: 456 };

      activatedRoute.data = of({ parameterDefType });
      comp.ngOnInit();

      expect(comp.parameterDefType).toEqual(parameterDefType);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IParameterDefType>>();
      const parameterDefType = { id: 123 };
      jest.spyOn(parameterDefTypeFormService, 'getParameterDefType').mockReturnValue(parameterDefType);
      jest.spyOn(parameterDefTypeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ parameterDefType });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: parameterDefType }));
      saveSubject.complete();

      // THEN
      expect(parameterDefTypeFormService.getParameterDefType).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(parameterDefTypeService.update).toHaveBeenCalledWith(expect.objectContaining(parameterDefType));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IParameterDefType>>();
      const parameterDefType = { id: 123 };
      jest.spyOn(parameterDefTypeFormService, 'getParameterDefType').mockReturnValue({ id: null });
      jest.spyOn(parameterDefTypeService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ parameterDefType: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: parameterDefType }));
      saveSubject.complete();

      // THEN
      expect(parameterDefTypeFormService.getParameterDefType).toHaveBeenCalled();
      expect(parameterDefTypeService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IParameterDefType>>();
      const parameterDefType = { id: 123 };
      jest.spyOn(parameterDefTypeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ parameterDefType });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(parameterDefTypeService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
