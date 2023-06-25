import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ItemFeatureDetailComponent } from './item-feature-detail.component';

describe('ItemFeature Management Detail Component', () => {
  let comp: ItemFeatureDetailComponent;
  let fixture: ComponentFixture<ItemFeatureDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ItemFeatureDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ itemFeature: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ItemFeatureDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ItemFeatureDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load itemFeature on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.itemFeature).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
