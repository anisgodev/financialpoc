import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CreditProductInstanceDetailComponent } from './credit-product-instance-detail.component';

describe('CreditProductInstance Management Detail Component', () => {
  let comp: CreditProductInstanceDetailComponent;
  let fixture: ComponentFixture<CreditProductInstanceDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreditProductInstanceDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ creditProductInstance: { id: 'ABC' } }) },
        },
      ],
    })
      .overrideTemplate(CreditProductInstanceDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(CreditProductInstanceDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load creditProductInstance on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.creditProductInstance).toEqual(expect.objectContaining({ id: 'ABC' }));
    });
  });
});
