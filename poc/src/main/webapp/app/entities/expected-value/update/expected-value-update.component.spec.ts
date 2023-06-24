import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ExpectedValueFormService } from './expected-value-form.service';
import { ExpectedValueService } from '../service/expected-value.service';
import { IExpectedValue } from '../expected-value.model';

import { ExpectedValueUpdateComponent } from './expected-value-update.component';

describe('ExpectedValue Management Update Component', () => {
  let comp: ExpectedValueUpdateComponent;
  let fixture: ComponentFixture<ExpectedValueUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let expectedValueFormService: ExpectedValueFormService;
  let expectedValueService: ExpectedValueService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ExpectedValueUpdateComponent],
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
      .overrideTemplate(ExpectedValueUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ExpectedValueUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    expectedValueFormService = TestBed.inject(ExpectedValueFormService);
    expectedValueService = TestBed.inject(ExpectedValueService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const expectedValue: IExpectedValue = { id: 456 };

      activatedRoute.data = of({ expectedValue });
      comp.ngOnInit();

      expect(comp.expectedValue).toEqual(expectedValue);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IExpectedValue>>();
      const expectedValue = { id: 123 };
      jest.spyOn(expectedValueFormService, 'getExpectedValue').mockReturnValue(expectedValue);
      jest.spyOn(expectedValueService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ expectedValue });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: expectedValue }));
      saveSubject.complete();

      // THEN
      expect(expectedValueFormService.getExpectedValue).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(expectedValueService.update).toHaveBeenCalledWith(expect.objectContaining(expectedValue));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IExpectedValue>>();
      const expectedValue = { id: 123 };
      jest.spyOn(expectedValueFormService, 'getExpectedValue').mockReturnValue({ id: null });
      jest.spyOn(expectedValueService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ expectedValue: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: expectedValue }));
      saveSubject.complete();

      // THEN
      expect(expectedValueFormService.getExpectedValue).toHaveBeenCalled();
      expect(expectedValueService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IExpectedValue>>();
      const expectedValue = { id: 123 };
      jest.spyOn(expectedValueService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ expectedValue });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(expectedValueService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
