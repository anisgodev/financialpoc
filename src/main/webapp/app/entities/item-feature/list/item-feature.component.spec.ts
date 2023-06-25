import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ItemFeatureService } from '../service/item-feature.service';

import { ItemFeatureComponent } from './item-feature.component';

describe('ItemFeature Management Component', () => {
  let comp: ItemFeatureComponent;
  let fixture: ComponentFixture<ItemFeatureComponent>;
  let service: ItemFeatureService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'item-feature', component: ItemFeatureComponent }]), HttpClientTestingModule],
      declarations: [ItemFeatureComponent],
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
      .overrideTemplate(ItemFeatureComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ItemFeatureComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ItemFeatureService);

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
    expect(comp.itemFeatures?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to itemFeatureService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getItemFeatureIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getItemFeatureIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
