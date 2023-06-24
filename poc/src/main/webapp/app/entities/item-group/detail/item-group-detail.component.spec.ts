import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ItemGroupDetailComponent } from './item-group-detail.component';

describe('ItemGroup Management Detail Component', () => {
  let comp: ItemGroupDetailComponent;
  let fixture: ComponentFixture<ItemGroupDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ItemGroupDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ itemGroup: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ItemGroupDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ItemGroupDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load itemGroup on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.itemGroup).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
