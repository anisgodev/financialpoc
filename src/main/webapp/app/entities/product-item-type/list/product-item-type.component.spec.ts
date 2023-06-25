import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ProductItemTypeService } from '../service/product-item-type.service';

import { ProductItemTypeComponent } from './product-item-type.component';

describe('ProductItemType Management Component', () => {
  let comp: ProductItemTypeComponent;
  let fixture: ComponentFixture<ProductItemTypeComponent>;
  let service: ProductItemTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'product-item-type', component: ProductItemTypeComponent }]),
        HttpClientTestingModule,
      ],
      declarations: [ProductItemTypeComponent],
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
      .overrideTemplate(ProductItemTypeComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ProductItemTypeComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ProductItemTypeService);

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
    expect(comp.productItemTypes?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to productItemTypeService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getProductItemTypeIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getProductItemTypeIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
