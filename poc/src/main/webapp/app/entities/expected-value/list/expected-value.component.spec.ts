import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ExpectedValueService } from '../service/expected-value.service';

import { ExpectedValueComponent } from './expected-value.component';

describe('ExpectedValue Management Component', () => {
  let comp: ExpectedValueComponent;
  let fixture: ComponentFixture<ExpectedValueComponent>;
  let service: ExpectedValueService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'expected-value', component: ExpectedValueComponent }]), HttpClientTestingModule],
      declarations: [ExpectedValueComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(ExpectedValueComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ExpectedValueComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ExpectedValueService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.expectedValues?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to expectedValueService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getExpectedValueIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getExpectedValueIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
