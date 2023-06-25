import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IExpectedValue } from '../expected-value.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../expected-value.test-samples';

import { ExpectedValueService } from './expected-value.service';

const requireRestSample: IExpectedValue = {
  ...sampleWithRequiredData,
};

describe('ExpectedValue Service', () => {
  let service: ExpectedValueService;
  let httpMock: HttpTestingController;
  let expectedResult: IExpectedValue | IExpectedValue[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ExpectedValueService);
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

    it('should create a ExpectedValue', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const expectedValue = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(expectedValue).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ExpectedValue', () => {
      const expectedValue = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(expectedValue).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ExpectedValue', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ExpectedValue', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ExpectedValue', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addExpectedValueToCollectionIfMissing', () => {
      it('should add a ExpectedValue to an empty array', () => {
        const expectedValue: IExpectedValue = sampleWithRequiredData;
        expectedResult = service.addExpectedValueToCollectionIfMissing([], expectedValue);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(expectedValue);
      });

      it('should not add a ExpectedValue to an array that contains it', () => {
        const expectedValue: IExpectedValue = sampleWithRequiredData;
        const expectedValueCollection: IExpectedValue[] = [
          {
            ...expectedValue,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addExpectedValueToCollectionIfMissing(expectedValueCollection, expectedValue);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ExpectedValue to an array that doesn't contain it", () => {
        const expectedValue: IExpectedValue = sampleWithRequiredData;
        const expectedValueCollection: IExpectedValue[] = [sampleWithPartialData];
        expectedResult = service.addExpectedValueToCollectionIfMissing(expectedValueCollection, expectedValue);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(expectedValue);
      });

      it('should add only unique ExpectedValue to an array', () => {
        const expectedValueArray: IExpectedValue[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const expectedValueCollection: IExpectedValue[] = [sampleWithRequiredData];
        expectedResult = service.addExpectedValueToCollectionIfMissing(expectedValueCollection, ...expectedValueArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const expectedValue: IExpectedValue = sampleWithRequiredData;
        const expectedValue2: IExpectedValue = sampleWithPartialData;
        expectedResult = service.addExpectedValueToCollectionIfMissing([], expectedValue, expectedValue2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(expectedValue);
        expect(expectedResult).toContain(expectedValue2);
      });

      it('should accept null and undefined values', () => {
        const expectedValue: IExpectedValue = sampleWithRequiredData;
        expectedResult = service.addExpectedValueToCollectionIfMissing([], null, expectedValue, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(expectedValue);
      });

      it('should return initial array if no ExpectedValue is added', () => {
        const expectedValueCollection: IExpectedValue[] = [sampleWithRequiredData];
        expectedResult = service.addExpectedValueToCollectionIfMissing(expectedValueCollection, undefined, null);
        expect(expectedResult).toEqual(expectedValueCollection);
      });
    });

    describe('compareExpectedValue', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareExpectedValue(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareExpectedValue(entity1, entity2);
        const compareResult2 = service.compareExpectedValue(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareExpectedValue(entity1, entity2);
        const compareResult2 = service.compareExpectedValue(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareExpectedValue(entity1, entity2);
        const compareResult2 = service.compareExpectedValue(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
