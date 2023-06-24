import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IProductItemType } from '../product-item-type.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../product-item-type.test-samples';

import { ProductItemTypeService } from './product-item-type.service';

const requireRestSample: IProductItemType = {
  ...sampleWithRequiredData,
};

describe('ProductItemType Service', () => {
  let service: ProductItemTypeService;
  let httpMock: HttpTestingController;
  let expectedResult: IProductItemType | IProductItemType[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ProductItemTypeService);
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

    it('should create a ProductItemType', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const productItemType = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(productItemType).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ProductItemType', () => {
      const productItemType = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(productItemType).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ProductItemType', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ProductItemType', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ProductItemType', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addProductItemTypeToCollectionIfMissing', () => {
      it('should add a ProductItemType to an empty array', () => {
        const productItemType: IProductItemType = sampleWithRequiredData;
        expectedResult = service.addProductItemTypeToCollectionIfMissing([], productItemType);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(productItemType);
      });

      it('should not add a ProductItemType to an array that contains it', () => {
        const productItemType: IProductItemType = sampleWithRequiredData;
        const productItemTypeCollection: IProductItemType[] = [
          {
            ...productItemType,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addProductItemTypeToCollectionIfMissing(productItemTypeCollection, productItemType);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ProductItemType to an array that doesn't contain it", () => {
        const productItemType: IProductItemType = sampleWithRequiredData;
        const productItemTypeCollection: IProductItemType[] = [sampleWithPartialData];
        expectedResult = service.addProductItemTypeToCollectionIfMissing(productItemTypeCollection, productItemType);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(productItemType);
      });

      it('should add only unique ProductItemType to an array', () => {
        const productItemTypeArray: IProductItemType[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const productItemTypeCollection: IProductItemType[] = [sampleWithRequiredData];
        expectedResult = service.addProductItemTypeToCollectionIfMissing(productItemTypeCollection, ...productItemTypeArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const productItemType: IProductItemType = sampleWithRequiredData;
        const productItemType2: IProductItemType = sampleWithPartialData;
        expectedResult = service.addProductItemTypeToCollectionIfMissing([], productItemType, productItemType2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(productItemType);
        expect(expectedResult).toContain(productItemType2);
      });

      it('should accept null and undefined values', () => {
        const productItemType: IProductItemType = sampleWithRequiredData;
        expectedResult = service.addProductItemTypeToCollectionIfMissing([], null, productItemType, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(productItemType);
      });

      it('should return initial array if no ProductItemType is added', () => {
        const productItemTypeCollection: IProductItemType[] = [sampleWithRequiredData];
        expectedResult = service.addProductItemTypeToCollectionIfMissing(productItemTypeCollection, undefined, null);
        expect(expectedResult).toEqual(productItemTypeCollection);
      });
    });

    describe('compareProductItemType', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareProductItemType(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareProductItemType(entity1, entity2);
        const compareResult2 = service.compareProductItemType(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareProductItemType(entity1, entity2);
        const compareResult2 = service.compareProductItemType(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareProductItemType(entity1, entity2);
        const compareResult2 = service.compareProductItemType(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
