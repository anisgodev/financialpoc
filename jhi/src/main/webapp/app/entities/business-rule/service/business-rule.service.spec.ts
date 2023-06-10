import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IBusinessRule } from '../business-rule.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../business-rule.test-samples';

import { BusinessRuleService } from './business-rule.service';

const requireRestSample: IBusinessRule = {
  ...sampleWithRequiredData,
};

describe('BusinessRule Service', () => {
  let service: BusinessRuleService;
  let httpMock: HttpTestingController;
  let expectedResult: IBusinessRule | IBusinessRule[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(BusinessRuleService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find('ABC').subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a BusinessRule', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const businessRule = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(businessRule).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a BusinessRule', () => {
      const businessRule = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(businessRule).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a BusinessRule', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of BusinessRule', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a BusinessRule', () => {
      const expected = true;

      service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addBusinessRuleToCollectionIfMissing', () => {
      it('should add a BusinessRule to an empty array', () => {
        const businessRule: IBusinessRule = sampleWithRequiredData;
        expectedResult = service.addBusinessRuleToCollectionIfMissing([], businessRule);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(businessRule);
      });

      it('should not add a BusinessRule to an array that contains it', () => {
        const businessRule: IBusinessRule = sampleWithRequiredData;
        const businessRuleCollection: IBusinessRule[] = [
          {
            ...businessRule,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addBusinessRuleToCollectionIfMissing(businessRuleCollection, businessRule);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a BusinessRule to an array that doesn't contain it", () => {
        const businessRule: IBusinessRule = sampleWithRequiredData;
        const businessRuleCollection: IBusinessRule[] = [sampleWithPartialData];
        expectedResult = service.addBusinessRuleToCollectionIfMissing(businessRuleCollection, businessRule);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(businessRule);
      });

      it('should add only unique BusinessRule to an array', () => {
        const businessRuleArray: IBusinessRule[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const businessRuleCollection: IBusinessRule[] = [sampleWithRequiredData];
        expectedResult = service.addBusinessRuleToCollectionIfMissing(businessRuleCollection, ...businessRuleArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const businessRule: IBusinessRule = sampleWithRequiredData;
        const businessRule2: IBusinessRule = sampleWithPartialData;
        expectedResult = service.addBusinessRuleToCollectionIfMissing([], businessRule, businessRule2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(businessRule);
        expect(expectedResult).toContain(businessRule2);
      });

      it('should accept null and undefined values', () => {
        const businessRule: IBusinessRule = sampleWithRequiredData;
        expectedResult = service.addBusinessRuleToCollectionIfMissing([], null, businessRule, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(businessRule);
      });

      it('should return initial array if no BusinessRule is added', () => {
        const businessRuleCollection: IBusinessRule[] = [sampleWithRequiredData];
        expectedResult = service.addBusinessRuleToCollectionIfMissing(businessRuleCollection, undefined, null);
        expect(expectedResult).toEqual(businessRuleCollection);
      });
    });

    describe('compareBusinessRule', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareBusinessRule(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = null;

        const compareResult1 = service.compareBusinessRule(entity1, entity2);
        const compareResult2 = service.compareBusinessRule(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = { id: 'CBA' };

        const compareResult1 = service.compareBusinessRule(entity1, entity2);
        const compareResult2 = service.compareBusinessRule(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = { id: 'ABC' };

        const compareResult1 = service.compareBusinessRule(entity1, entity2);
        const compareResult2 = service.compareBusinessRule(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
