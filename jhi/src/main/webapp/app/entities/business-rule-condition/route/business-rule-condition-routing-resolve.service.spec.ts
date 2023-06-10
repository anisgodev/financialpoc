import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IBusinessRuleCondition } from '../business-rule-condition.model';
import { BusinessRuleConditionService } from '../service/business-rule-condition.service';

import { BusinessRuleConditionRoutingResolveService } from './business-rule-condition-routing-resolve.service';

describe('BusinessRuleCondition routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: BusinessRuleConditionRoutingResolveService;
  let service: BusinessRuleConditionService;
  let resultBusinessRuleCondition: IBusinessRuleCondition | null | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    routingResolveService = TestBed.inject(BusinessRuleConditionRoutingResolveService);
    service = TestBed.inject(BusinessRuleConditionService);
    resultBusinessRuleCondition = undefined;
  });

  describe('resolve', () => {
    it('should return IBusinessRuleCondition returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 'ABC' };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultBusinessRuleCondition = result;
      });

      // THEN
      expect(service.find).toBeCalledWith('ABC');
      expect(resultBusinessRuleCondition).toEqual({ id: 'ABC' });
    });

    it('should return null if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultBusinessRuleCondition = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultBusinessRuleCondition).toEqual(null);
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse<IBusinessRuleCondition>({ body: null })));
      mockActivatedRouteSnapshot.params = { id: 'ABC' };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultBusinessRuleCondition = result;
      });

      // THEN
      expect(service.find).toBeCalledWith('ABC');
      expect(resultBusinessRuleCondition).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
