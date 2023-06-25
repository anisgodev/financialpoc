import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ParameterDefTypeService } from '../service/parameter-def-type.service';

import { ParameterDefTypeComponent } from './parameter-def-type.component';

describe('ParameterDefType Management Component', () => {
  let comp: ParameterDefTypeComponent;
  let fixture: ComponentFixture<ParameterDefTypeComponent>;
  let service: ParameterDefTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'parameter-def-type', component: ParameterDefTypeComponent }]),
        HttpClientTestingModule,
      ],
      declarations: [ParameterDefTypeComponent],
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
      .overrideTemplate(ParameterDefTypeComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ParameterDefTypeComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ParameterDefTypeService);

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
    expect(comp.parameterDefTypes?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to parameterDefTypeService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getParameterDefTypeIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getParameterDefTypeIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
