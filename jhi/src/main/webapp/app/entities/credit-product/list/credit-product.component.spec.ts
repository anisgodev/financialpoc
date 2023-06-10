import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { CreditProductService } from '../service/credit-product.service';

import { CreditProductComponent } from './credit-product.component';

describe('CreditProduct Management Component', () => {
  let comp: CreditProductComponent;
  let fixture: ComponentFixture<CreditProductComponent>;
  let service: CreditProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'credit-product', component: CreditProductComponent }]), HttpClientTestingModule],
      declarations: [CreditProductComponent],
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
      .overrideTemplate(CreditProductComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CreditProductComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(CreditProductService);

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
    expect(comp.creditProducts?.[0]).toEqual(expect.objectContaining({ id: 'ABC' }));
  });

  describe('trackId', () => {
    it('Should forward to creditProductService', () => {
      const entity = { id: 'ABC' };
      jest.spyOn(service, 'getCreditProductIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getCreditProductIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
