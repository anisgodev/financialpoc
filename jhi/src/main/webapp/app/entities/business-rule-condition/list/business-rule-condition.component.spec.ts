import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { BusinessRuleConditionService } from '../service/business-rule-condition.service';

import { BusinessRuleConditionComponent } from './business-rule-condition.component';

describe('BusinessRuleCondition Management Component', () => {
  let comp: BusinessRuleConditionComponent;
  let fixture: ComponentFixture<BusinessRuleConditionComponent>;
  let service: BusinessRuleConditionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'business-rule-condition', component: BusinessRuleConditionComponent }]),
        HttpClientTestingModule,
      ],
      declarations: [BusinessRuleConditionComponent],
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
      .overrideTemplate(BusinessRuleConditionComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BusinessRuleConditionComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(BusinessRuleConditionService);

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
    expect(comp.businessRuleConditions?.[0]).toEqual(expect.objectContaining({ id: 'ABC' }));
  });

  describe('trackId', () => {
    it('Should forward to businessRuleConditionService', () => {
      const entity = { id: 'ABC' };
      jest.spyOn(service, 'getBusinessRuleConditionIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getBusinessRuleConditionIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
