import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ProductRepositoryItemDetailComponent } from './product-repository-item-detail.component';

describe('ProductRepositoryItem Management Detail Component', () => {
  let comp: ProductRepositoryItemDetailComponent;
  let fixture: ComponentFixture<ProductRepositoryItemDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductRepositoryItemDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ productRepositoryItem: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ProductRepositoryItemDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ProductRepositoryItemDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load productRepositoryItem on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.productRepositoryItem).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
