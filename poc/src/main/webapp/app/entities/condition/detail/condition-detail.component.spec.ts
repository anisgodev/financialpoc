import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ConditionDetailComponent } from './condition-detail.component';

describe('Condition Management Detail Component', () => {
  let comp: ConditionDetailComponent;
  let fixture: ComponentFixture<ConditionDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConditionDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ condition: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ConditionDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ConditionDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load condition on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.condition).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
