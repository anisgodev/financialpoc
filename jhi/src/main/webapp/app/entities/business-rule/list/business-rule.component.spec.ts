import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { BusinessRuleService } from '../service/business-rule.service';

import { BusinessRuleComponent } from './business-rule.component';

describe('BusinessRule Management Component', () => {
  let comp: BusinessRuleComponent;
  let fixture: ComponentFixture<BusinessRuleComponent>;
  let service: BusinessRuleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'business-rule', component: BusinessRuleComponent }]), HttpClientTestingModule],
      declarations: [BusinessRuleComponent],
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
      .overrideTemplate(BusinessRuleComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BusinessRuleComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(BusinessRuleService);

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
    expect(comp.businessRules?.[0]).toEqual(expect.objectContaining({ id: 'ABC' }));
  });

  describe('trackId', () => {
    it('Should forward to businessRuleService', () => {
      const entity = { id: 'ABC' };
      jest.spyOn(service, 'getBusinessRuleIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getBusinessRuleIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
