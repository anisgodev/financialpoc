import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICreditProductInstance } from '../credit-product-instance.model';
import {
  sampleWithRequiredData,
  sampleWithNewData,
  sampleWithPartialData,
  sampleWithFullData,
} from '../credit-product-instance.test-samples';

import { CreditProductInstanceService } from './credit-product-instance.service';

const requireRestSample: ICreditProductInstance = {
  ...sampleWithRequiredData,
};

describe('CreditProductInstance Service', () => {
  let service: CreditProductInstanceService;
  let httpMock: HttpTestingController;
  let expectedResult: ICreditProductInstance | ICreditProductInstance[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CreditProductInstanceService);
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

    it('should create a CreditProductInstance', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const creditProductInstance = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(creditProductInstance).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a CreditProductInstance', () => {
      const creditProductInstance = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(creditProductInstance).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a CreditProductInstance', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of CreditProductInstance', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a CreditProductInstance', () => {
      const expected = true;

      service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addCreditProductInstanceToCollectionIfMissing', () => {
      it('should add a CreditProductInstance to an empty array', () => {
        const creditProductInstance: ICreditProductInstance = sampleWithRequiredData;
        expectedResult = service.addCreditProductInstanceToCollectionIfMissing([], creditProductInstance);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(creditProductInstance);
      });

      it('should not add a CreditProductInstance to an array that contains it', () => {
        const creditProductInstance: ICreditProductInstance = sampleWithRequiredData;
        const creditProductInstanceCollection: ICreditProductInstance[] = [
          {
            ...creditProductInstance,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addCreditProductInstanceToCollectionIfMissing(creditProductInstanceCollection, creditProductInstance);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a CreditProductInstance to an array that doesn't contain it", () => {
        const creditProductInstance: ICreditProductInstance = sampleWithRequiredData;
        const creditProductInstanceCollection: ICreditProductInstance[] = [sampleWithPartialData];
        expectedResult = service.addCreditProductInstanceToCollectionIfMissing(creditProductInstanceCollection, creditProductInstance);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(creditProductInstance);
      });

      it('should add only unique CreditProductInstance to an array', () => {
        const creditProductInstanceArray: ICreditProductInstance[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const creditProductInstanceCollection: ICreditProductInstance[] = [sampleWithRequiredData];
        expectedResult = service.addCreditProductInstanceToCollectionIfMissing(
          creditProductInstanceCollection,
          ...creditProductInstanceArray
        );
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const creditProductInstance: ICreditProductInstance = sampleWithRequiredData;
        const creditProductInstance2: ICreditProductInstance = sampleWithPartialData;
        expectedResult = service.addCreditProductInstanceToCollectionIfMissing([], creditProductInstance, creditProductInstance2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(creditProductInstance);
        expect(expectedResult).toContain(creditProductInstance2);
      });

      it('should accept null and undefined values', () => {
        const creditProductInstance: ICreditProductInstance = sampleWithRequiredData;
        expectedResult = service.addCreditProductInstanceToCollectionIfMissing([], null, creditProductInstance, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(creditProductInstance);
      });

      it('should return initial array if no CreditProductInstance is added', () => {
        const creditProductInstanceCollection: ICreditProductInstance[] = [sampleWithRequiredData];
        expectedResult = service.addCreditProductInstanceToCollectionIfMissing(creditProductInstanceCollection, undefined, null);
        expect(expectedResult).toEqual(creditProductInstanceCollection);
      });
    });

    describe('compareCreditProductInstance', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareCreditProductInstance(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = null;

        const compareResult1 = service.compareCreditProductInstance(entity1, entity2);
        const compareResult2 = service.compareCreditProductInstance(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = { id: 'CBA' };

        const compareResult1 = service.compareCreditProductInstance(entity1, entity2);
        const compareResult2 = service.compareCreditProductInstance(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = { id: 'ABC' };

        const compareResult1 = service.compareCreditProductInstance(entity1, entity2);
        const compareResult2 = service.compareCreditProductInstance(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
