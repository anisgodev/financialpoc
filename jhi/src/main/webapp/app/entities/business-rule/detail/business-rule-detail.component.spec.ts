import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { BusinessRuleDetailComponent } from './business-rule-detail.component';

describe('BusinessRule Management Detail Component', () => {
  let comp: BusinessRuleDetailComponent;
  let fixture: ComponentFixture<BusinessRuleDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BusinessRuleDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ businessRule: { id: 'ABC' } }) },
        },
      ],
    })
      .overrideTemplate(BusinessRuleDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(BusinessRuleDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load businessRule on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.businessRule).toEqual(expect.objectContaining({ id: 'ABC' }));
    });
  });
});
