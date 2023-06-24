import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { EligibilityConditionService } from '../service/eligibility-condition.service';

import { EligibilityConditionComponent } from './eligibility-condition.component';

describe('EligibilityCondition Management Component', () => {
  let comp: EligibilityConditionComponent;
  let fixture: ComponentFixture<EligibilityConditionComponent>;
  let service: EligibilityConditionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'eligibility-condition', component: EligibilityConditionComponent }]),
        HttpClientTestingModule,
      ],
      declarations: [EligibilityConditionComponent],
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
      .overrideTemplate(EligibilityConditionComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EligibilityConditionComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(EligibilityConditionService);

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
    expect(comp.eligibilityConditions?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to eligibilityConditionService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getEligibilityConditionIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getEligibilityConditionIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
