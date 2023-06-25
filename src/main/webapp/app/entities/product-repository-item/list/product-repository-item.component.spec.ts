import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ProductRepositoryItemService } from '../service/product-repository-item.service';

import { ProductRepositoryItemComponent } from './product-repository-item.component';

describe('ProductRepositoryItem Management Component', () => {
  let comp: ProductRepositoryItemComponent;
  let fixture: ComponentFixture<ProductRepositoryItemComponent>;
  let service: ProductRepositoryItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'product-repository-item', component: ProductRepositoryItemComponent }]),
        HttpClientTestingModule,
      ],
      declarations: [ProductRepositoryItemComponent],
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
      .overrideTemplate(ProductRepositoryItemComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ProductRepositoryItemComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ProductRepositoryItemService);

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
    expect(comp.productRepositoryItems?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to productRepositoryItemService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getProductRepositoryItemIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getProductRepositoryItemIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
