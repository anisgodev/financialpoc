import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { BusinessRuleConditionDetailComponent } from './business-rule-condition-detail.component';

describe('BusinessRuleCondition Management Detail Component', () => {
  let comp: BusinessRuleConditionDetailComponent;
  let fixture: ComponentFixture<BusinessRuleConditionDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BusinessRuleConditionDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ businessRuleCondition: { id: 'ABC' } }) },
        },
      ],
    })
      .overrideTemplate(BusinessRuleConditionDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(BusinessRuleConditionDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load businessRuleCondition on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.businessRuleCondition).toEqual(expect.objectContaining({ id: 'ABC' }));
    });
  });
});
