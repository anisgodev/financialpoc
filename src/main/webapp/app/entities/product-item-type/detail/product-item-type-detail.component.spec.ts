import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ProductItemTypeDetailComponent } from './product-item-type-detail.component';

describe('ProductItemType Management Detail Component', () => {
  let comp: ProductItemTypeDetailComponent;
  let fixture: ComponentFixture<ProductItemTypeDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductItemTypeDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ productItemType: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ProductItemTypeDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ProductItemTypeDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load productItemType on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.productItemType).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
