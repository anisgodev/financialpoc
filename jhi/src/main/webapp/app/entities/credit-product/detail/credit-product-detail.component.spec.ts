import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CreditProductDetailComponent } from './credit-product-detail.component';

describe('CreditProduct Management Detail Component', () => {
  let comp: CreditProductDetailComponent;
  let fixture: ComponentFixture<CreditProductDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreditProductDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ creditProduct: { id: 'ABC' } }) },
        },
      ],
    })
      .overrideTemplate(CreditProductDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(CreditProductDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load creditProduct on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.creditProduct).toEqual(expect.objectContaining({ id: 'ABC' }));
    });
  });
});
