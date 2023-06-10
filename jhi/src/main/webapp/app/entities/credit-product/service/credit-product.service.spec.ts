import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICreditProduct } from '../credit-product.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../credit-product.test-samples';

import { CreditProductService } from './credit-product.service';

const requireRestSample: ICreditProduct = {
  ...sampleWithRequiredData,
};

describe('CreditProduct Service', () => {
  let service: CreditProductService;
  let httpMock: HttpTestingController;
  let expectedResult: ICreditProduct | ICreditProduct[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CreditProductService);
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

    it('should create a CreditProduct', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const creditProduct = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(creditProduct).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a CreditProduct', () => {
      const creditProduct = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(creditProduct).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a CreditProduct', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of CreditProduct', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a CreditProduct', () => {
      const expected = true;

      service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addCreditProductToCollectionIfMissing', () => {
      it('should add a CreditProduct to an empty array', () => {
        const creditProduct: ICreditProduct = sampleWithRequiredData;
        expectedResult = service.addCreditProductToCollectionIfMissing([], creditProduct);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(creditProduct);
      });

      it('should not add a CreditProduct to an array that contains it', () => {
        const creditProduct: ICreditProduct = sampleWithRequiredData;
        const creditProductCollection: ICreditProduct[] = [
          {
            ...creditProduct,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addCreditProductToCollectionIfMissing(creditProductCollection, creditProduct);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a CreditProduct to an array that doesn't contain it", () => {
        const creditProduct: ICreditProduct = sampleWithRequiredData;
        const creditProductCollection: ICreditProduct[] = [sampleWithPartialData];
        expectedResult = service.addCreditProductToCollectionIfMissing(creditProductCollection, creditProduct);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(creditProduct);
      });

      it('should add only unique CreditProduct to an array', () => {
        const creditProductArray: ICreditProduct[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const creditProductCollection: ICreditProduct[] = [sampleWithRequiredData];
        expectedResult = service.addCreditProductToCollectionIfMissing(creditProductCollection, ...creditProductArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const creditProduct: ICreditProduct = sampleWithRequiredData;
        const creditProduct2: ICreditProduct = sampleWithPartialData;
        expectedResult = service.addCreditProductToCollectionIfMissing([], creditProduct, creditProduct2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(creditProduct);
        expect(expectedResult).toContain(creditProduct2);
      });

      it('should accept null and undefined values', () => {
        const creditProduct: ICreditProduct = sampleWithRequiredData;
        expectedResult = service.addCreditProductToCollectionIfMissing([], null, creditProduct, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(creditProduct);
      });

      it('should return initial array if no CreditProduct is added', () => {
        const creditProductCollection: ICreditProduct[] = [sampleWithRequiredData];
        expectedResult = service.addCreditProductToCollectionIfMissing(creditProductCollection, undefined, null);
        expect(expectedResult).toEqual(creditProductCollection);
      });
    });

    describe('compareCreditProduct', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareCreditProduct(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = null;

        const compareResult1 = service.compareCreditProduct(entity1, entity2);
        const compareResult2 = service.compareCreditProduct(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = { id: 'CBA' };

        const compareResult1 = service.compareCreditProduct(entity1, entity2);
        const compareResult2 = service.compareCreditProduct(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = { id: 'ABC' };

        const compareResult1 = service.compareCreditProduct(entity1, entity2);
        const compareResult2 = service.compareCreditProduct(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
