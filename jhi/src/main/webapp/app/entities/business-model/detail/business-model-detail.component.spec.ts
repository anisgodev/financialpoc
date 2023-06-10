import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { BusinessModelDetailComponent } from './business-model-detail.component';

describe('BusinessModel Management Detail Component', () => {
  let comp: BusinessModelDetailComponent;
  let fixture: ComponentFixture<BusinessModelDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BusinessModelDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ businessModel: { id: 'ABC' } }) },
        },
      ],
    })
      .overrideTemplate(BusinessModelDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(BusinessModelDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load businessModel on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.businessModel).toEqual(expect.objectContaining({ id: 'ABC' }));
    });
  });
});
