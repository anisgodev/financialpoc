import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { CreditProductInstanceService } from '../service/credit-product-instance.service';

import { CreditProductInstanceComponent } from './credit-product-instance.component';

describe('CreditProductInstance Management Component', () => {
  let comp: CreditProductInstanceComponent;
  let fixture: ComponentFixture<CreditProductInstanceComponent>;
  let service: CreditProductInstanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'credit-product-instance', component: CreditProductInstanceComponent }]),
        HttpClientTestingModule,
      ],
      declarations: [CreditProductInstanceComponent],
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
      .overrideTemplate(CreditProductInstanceComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CreditProductInstanceComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(CreditProductInstanceService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 'ABC' }],
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
    expect(comp.creditProductInstances?.[0]).toEqual(expect.objectContaining({ id: 'ABC' }));
  });

  describe('trackId', () => {
    it('Should forward to creditProductInstanceService', () => {
      const entity = { id: 'ABC' };
      jest.spyOn(service, 'getCreditProductInstanceIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getCreditProductInstanceIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
