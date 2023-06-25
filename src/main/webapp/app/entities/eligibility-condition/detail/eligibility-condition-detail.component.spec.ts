import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { EligibilityConditionDetailComponent } from './eligibility-condition-detail.component';

describe('EligibilityCondition Management Detail Component', () => {
  let comp: EligibilityConditionDetailComponent;
  let fixture: ComponentFixture<EligibilityConditionDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EligibilityConditionDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ eligibilityCondition: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(EligibilityConditionDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(EligibilityConditionDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load eligibilityCondition on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.eligibilityCondition).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
