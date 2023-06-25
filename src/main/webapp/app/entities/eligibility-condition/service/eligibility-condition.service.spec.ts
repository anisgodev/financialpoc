import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IEligibilityCondition } from '../eligibility-condition.model';
import {
  sampleWithRequiredData,
  sampleWithNewData,
  sampleWithPartialData,
  sampleWithFullData,
} from '../eligibility-condition.test-samples';

import { EligibilityConditionService } from './eligibility-condition.service';

const requireRestSample: IEligibilityCondition = {
  ...sampleWithRequiredData,
};

describe('EligibilityCondition Service', () => {
  let service: EligibilityConditionService;
  let httpMock: HttpTestingController;
  let expectedResult: IEligibilityCondition | IEligibilityCondition[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(EligibilityConditionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a EligibilityCondition', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const eligibilityCondition = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(eligibilityCondition).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a EligibilityCondition', () => {
      const eligibilityCondition = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(eligibilityCondition).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a EligibilityCondition', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of EligibilityCondition', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a EligibilityCondition', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addEligibilityConditionToCollectionIfMissing', () => {
      it('should add a EligibilityCondition to an empty array', () => {
        const eligibilityCondition: IEligibilityCondition = sampleWithRequiredData;
        expectedResult = service.addEligibilityConditionToCollectionIfMissing([], eligibilityCondition);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(eligibilityCondition);
      });

      it('should not add a EligibilityCondition to an array that contains it', () => {
        const eligibilityCondition: IEligibilityCondition = sampleWithRequiredData;
        const eligibilityConditionCollection: IEligibilityCondition[] = [
          {
            ...eligibilityCondition,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addEligibilityConditionToCollectionIfMissing(eligibilityConditionCollection, eligibilityCondition);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a EligibilityCondition to an array that doesn't contain it", () => {
        const eligibilityCondition: IEligibilityCondition = sampleWithRequiredData;
        const eligibilityConditionCollection: IEligibilityCondition[] = [sampleWithPartialData];
        expectedResult = service.addEligibilityConditionToCollectionIfMissing(eligibilityConditionCollection, eligibilityCondition);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(eligibilityCondition);
      });

      it('should add only unique EligibilityCondition to an array', () => {
        const eligibilityConditionArray: IEligibilityCondition[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const eligibilityConditionCollection: IEligibilityCondition[] = [sampleWithRequiredData];
        expectedResult = service.addEligibilityConditionToCollectionIfMissing(eligibilityConditionCollection, ...eligibilityConditionArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const eligibilityCondition: IEligibilityCondition = sampleWithRequiredData;
        const eligibilityCondition2: IEligibilityCondition = sampleWithPartialData;
        expectedResult = service.addEligibilityConditionToCollectionIfMissing([], eligibilityCondition, eligibilityCondition2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(eligibilityCondition);
        expect(expectedResult).toContain(eligibilityCondition2);
      });

      it('should accept null and undefined values', () => {
        const eligibilityCondition: IEligibilityCondition = sampleWithRequiredData;
        expectedResult = service.addEligibilityConditionToCollectionIfMissing([], null, eligibilityCondition, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(eligibilityCondition);
      });

      it('should return initial array if no EligibilityCondition is added', () => {
        const eligibilityConditionCollection: IEligibilityCondition[] = [sampleWithRequiredData];
        expectedResult = service.addEligibilityConditionToCollectionIfMissing(eligibilityConditionCollection, undefined, null);
        expect(expectedResult).toEqual(eligibilityConditionCollection);
      });
    });

    describe('compareEligibilityCondition', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareEligibilityCondition(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareEligibilityCondition(entity1, entity2);
        const compareResult2 = service.compareEligibilityCondition(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareEligibilityCondition(entity1, entity2);
        const compareResult2 = service.compareEligibilityCondition(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareEligibilityCondition(entity1, entity2);
        const compareResult2 = service.compareEligibilityCondition(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
