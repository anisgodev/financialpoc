import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IProductRepositoryItem } from '../product-repository-item.model';
import {
  sampleWithRequiredData,
  sampleWithNewData,
  sampleWithPartialData,
  sampleWithFullData,
} from '../product-repository-item.test-samples';

import { ProductRepositoryItemService } from './product-repository-item.service';

const requireRestSample: IProductRepositoryItem = {
  ...sampleWithRequiredData,
};

describe('ProductRepositoryItem Service', () => {
  let service: ProductRepositoryItemService;
  let httpMock: HttpTestingController;
  let expectedResult: IProductRepositoryItem | IProductRepositoryItem[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ProductRepositoryItemService);
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

    it('should create a ProductRepositoryItem', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const productRepositoryItem = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(productRepositoryItem).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ProductRepositoryItem', () => {
      const productRepositoryItem = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(productRepositoryItem).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ProductRepositoryItem', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ProductRepositoryItem', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ProductRepositoryItem', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addProductRepositoryItemToCollectionIfMissing', () => {
      it('should add a ProductRepositoryItem to an empty array', () => {
        const productRepositoryItem: IProductRepositoryItem = sampleWithRequiredData;
        expectedResult = service.addProductRepositoryItemToCollectionIfMissing([], productRepositoryItem);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(productRepositoryItem);
      });

      it('should not add a ProductRepositoryItem to an array that contains it', () => {
        const productRepositoryItem: IProductRepositoryItem = sampleWithRequiredData;
        const productRepositoryItemCollection: IProductRepositoryItem[] = [
          {
            ...productRepositoryItem,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addProductRepositoryItemToCollectionIfMissing(productRepositoryItemCollection, productRepositoryItem);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ProductRepositoryItem to an array that doesn't contain it", () => {
        const productRepositoryItem: IProductRepositoryItem = sampleWithRequiredData;
        const productRepositoryItemCollection: IProductRepositoryItem[] = [sampleWithPartialData];
        expectedResult = service.addProductRepositoryItemToCollectionIfMissing(productRepositoryItemCollection, productRepositoryItem);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(productRepositoryItem);
      });

      it('should add only unique ProductRepositoryItem to an array', () => {
        const productRepositoryItemArray: IProductRepositoryItem[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const productRepositoryItemCollection: IProductRepositoryItem[] = [sampleWithRequiredData];
        expectedResult = service.addProductRepositoryItemToCollectionIfMissing(
          productRepositoryItemCollection,
          ...productRepositoryItemArray
        );
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const productRepositoryItem: IProductRepositoryItem = sampleWithRequiredData;
        const productRepositoryItem2: IProductRepositoryItem = sampleWithPartialData;
        expectedResult = service.addProductRepositoryItemToCollectionIfMissing([], productRepositoryItem, productRepositoryItem2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(productRepositoryItem);
        expect(expectedResult).toContain(productRepositoryItem2);
      });

      it('should accept null and undefined values', () => {
        const productRepositoryItem: IProductRepositoryItem = sampleWithRequiredData;
        expectedResult = service.addProductRepositoryItemToCollectionIfMissing([], null, productRepositoryItem, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(productRepositoryItem);
      });

      it('should return initial array if no ProductRepositoryItem is added', () => {
        const productRepositoryItemCollection: IProductRepositoryItem[] = [sampleWithRequiredData];
        expectedResult = service.addProductRepositoryItemToCollectionIfMissing(productRepositoryItemCollection, undefined, null);
        expect(expectedResult).toEqual(productRepositoryItemCollection);
      });
    });

    describe('compareProductRepositoryItem', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareProductRepositoryItem(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareProductRepositoryItem(entity1, entity2);
        const compareResult2 = service.compareProductRepositoryItem(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareProductRepositoryItem(entity1, entity2);
        const compareResult2 = service.compareProductRepositoryItem(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareProductRepositoryItem(entity1, entity2);
        const compareResult2 = service.compareProductRepositoryItem(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
