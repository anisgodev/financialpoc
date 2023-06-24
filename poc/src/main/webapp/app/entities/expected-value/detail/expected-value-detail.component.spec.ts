import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ExpectedValueDetailComponent } from './expected-value-detail.component';

describe('ExpectedValue Management Detail Component', () => {
  let comp: ExpectedValueDetailComponent;
  let fixture: ComponentFixture<ExpectedValueDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExpectedValueDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ expectedValue: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ExpectedValueDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ExpectedValueDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load expectedValue on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.expectedValue).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
