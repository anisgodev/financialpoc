import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ParameterDefTypeDetailComponent } from './parameter-def-type-detail.component';

describe('ParameterDefType Management Detail Component', () => {
  let comp: ParameterDefTypeDetailComponent;
  let fixture: ComponentFixture<ParameterDefTypeDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ParameterDefTypeDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ parameterDefType: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ParameterDefTypeDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ParameterDefTypeDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load parameterDefType on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.parameterDefType).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
