import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { BusinessModelService } from '../service/business-model.service';

import { BusinessModelComponent } from './business-model.component';

describe('BusinessModel Management Component', () => {
  let comp: BusinessModelComponent;
  let fixture: ComponentFixture<BusinessModelComponent>;
  let service: BusinessModelService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'business-model', component: BusinessModelComponent }]), HttpClientTestingModule],
      declarations: [BusinessModelComponent],
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
      .overrideTemplate(BusinessModelComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BusinessModelComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(BusinessModelService);

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
    expect(comp.businessModels?.[0]).toEqual(expect.objectContaining({ id: 'ABC' }));
  });

  describe('trackId', () => {
    it('Should forward to businessModelService', () => {
      const entity = { id: 'ABC' };
      jest.spyOn(service, 'getBusinessModelIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getBusinessModelIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
