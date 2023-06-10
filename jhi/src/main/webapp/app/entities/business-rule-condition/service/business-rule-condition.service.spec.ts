import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IBusinessRuleCondition } from '../business-rule-condition.model';
import {
  sampleWithRequiredData,
  sampleWithNewData,
  sampleWithPartialData,
  sampleWithFullData,
} from '../business-rule-condition.test-samples';

import { BusinessRuleConditionService } from './business-rule-condition.service';

const requireRestSample: IBusinessRuleCondition = {
  ...sampleWithRequiredData,
};

describe('BusinessRuleCondition Service', () => {
  let service: BusinessRuleConditionService;
  let httpMock: HttpTestingController;
  let expectedResult: IBusinessRuleCondition | IBusinessRuleCondition[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(BusinessRuleConditionService);
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

    it('should create a BusinessRuleCondition', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const businessRuleCondition = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(businessRuleCondition).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a BusinessRuleCondition', () => {
      const businessRuleCondition = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(businessRuleCondition).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a BusinessRuleCondition', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of BusinessRuleCondition', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a BusinessRuleCondition', () => {
      const expected = true;

      service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addBusinessRuleConditionToCollectionIfMissing', () => {
      it('should add a BusinessRuleCondition to an empty array', () => {
        const businessRuleCondition: IBusinessRuleCondition = sampleWithRequiredData;
        expectedResult = service.addBusinessRuleConditionToCollectionIfMissing([], businessRuleCondition);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(businessRuleCondition);
      });

      it('should not add a BusinessRuleCondition to an array that contains it', () => {
        const businessRuleCondition: IBusinessRuleCondition = sampleWithRequiredData;
        const businessRuleConditionCollection: IBusinessRuleCondition[] = [
          {
            ...businessRuleCondition,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addBusinessRuleConditionToCollectionIfMissing(businessRuleConditionCollection, businessRuleCondition);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a BusinessRuleCondition to an array that doesn't contain it", () => {
        const businessRuleCondition: IBusinessRuleCondition = sampleWithRequiredData;
        const businessRuleConditionCollection: IBusinessRuleCondition[] = [sampleWithPartialData];
        expectedResult = service.addBusinessRuleConditionToCollectionIfMissing(businessRuleConditionCollection, businessRuleCondition);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(businessRuleCondition);
      });

      it('should add only unique BusinessRuleCondition to an array', () => {
        const businessRuleConditionArray: IBusinessRuleCondition[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const businessRuleConditionCollection: IBusinessRuleCondition[] = [sampleWithRequiredData];
        expectedResult = service.addBusinessRuleConditionToCollectionIfMissing(
          businessRuleConditionCollection,
          ...businessRuleConditionArray
        );
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const businessRuleCondition: IBusinessRuleCondition = sampleWithRequiredData;
        const businessRuleCondition2: IBusinessRuleCondition = sampleWithPartialData;
        expectedResult = service.addBusinessRuleConditionToCollectionIfMissing([], businessRuleCondition, businessRuleCondition2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(businessRuleCondition);
        expect(expectedResult).toContain(businessRuleCondition2);
      });

      it('should accept null and undefined values', () => {
        const businessRuleCondition: IBusinessRuleCondition = sampleWithRequiredData;
        expectedResult = service.addBusinessRuleConditionToCollectionIfMissing([], null, businessRuleCondition, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(businessRuleCondition);
      });

      it('should return initial array if no BusinessRuleCondition is added', () => {
        const businessRuleConditionCollection: IBusinessRuleCondition[] = [sampleWithRequiredData];
        expectedResult = service.addBusinessRuleConditionToCollectionIfMissing(businessRuleConditionCollection, undefined, null);
        expect(expectedResult).toEqual(businessRuleConditionCollection);
      });
    });

    describe('compareBusinessRuleCondition', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareBusinessRuleCondition(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = null;

        const compareResult1 = service.compareBusinessRuleCondition(entity1, entity2);
        const compareResult2 = service.compareBusinessRuleCondition(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = { id: 'CBA' };

        const compareResult1 = service.compareBusinessRuleCondition(entity1, entity2);
        const compareResult2 = service.compareBusinessRuleCondition(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = { id: 'ABC' };

        const compareResult1 = service.compareBusinessRuleCondition(entity1, entity2);
        const compareResult2 = service.compareBusinessRuleCondition(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
