import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IItemFeature } from '../item-feature.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../item-feature.test-samples';

import { ItemFeatureService } from './item-feature.service';

const requireRestSample: IItemFeature = {
  ...sampleWithRequiredData,
};

describe('ItemFeature Service', () => {
  let service: ItemFeatureService;
  let httpMock: HttpTestingController;
  let expectedResult: IItemFeature | IItemFeature[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ItemFeatureService);
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

    it('should create a ItemFeature', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const itemFeature = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(itemFeature).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ItemFeature', () => {
      const itemFeature = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(itemFeature).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ItemFeature', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ItemFeature', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ItemFeature', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addItemFeatureToCollectionIfMissing', () => {
      it('should add a ItemFeature to an empty array', () => {
        const itemFeature: IItemFeature = sampleWithRequiredData;
        expectedResult = service.addItemFeatureToCollectionIfMissing([], itemFeature);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(itemFeature);
      });

      it('should not add a ItemFeature to an array that contains it', () => {
        const itemFeature: IItemFeature = sampleWithRequiredData;
        const itemFeatureCollection: IItemFeature[] = [
          {
            ...itemFeature,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addItemFeatureToCollectionIfMissing(itemFeatureCollection, itemFeature);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ItemFeature to an array that doesn't contain it", () => {
        const itemFeature: IItemFeature = sampleWithRequiredData;
        const itemFeatureCollection: IItemFeature[] = [sampleWithPartialData];
        expectedResult = service.addItemFeatureToCollectionIfMissing(itemFeatureCollection, itemFeature);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(itemFeature);
      });

      it('should add only unique ItemFeature to an array', () => {
        const itemFeatureArray: IItemFeature[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const itemFeatureCollection: IItemFeature[] = [sampleWithRequiredData];
        expectedResult = service.addItemFeatureToCollectionIfMissing(itemFeatureCollection, ...itemFeatureArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const itemFeature: IItemFeature = sampleWithRequiredData;
        const itemFeature2: IItemFeature = sampleWithPartialData;
        expectedResult = service.addItemFeatureToCollectionIfMissing([], itemFeature, itemFeature2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(itemFeature);
        expect(expectedResult).toContain(itemFeature2);
      });

      it('should accept null and undefined values', () => {
        const itemFeature: IItemFeature = sampleWithRequiredData;
        expectedResult = service.addItemFeatureToCollectionIfMissing([], null, itemFeature, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(itemFeature);
      });

      it('should return initial array if no ItemFeature is added', () => {
        const itemFeatureCollection: IItemFeature[] = [sampleWithRequiredData];
        expectedResult = service.addItemFeatureToCollectionIfMissing(itemFeatureCollection, undefined, null);
        expect(expectedResult).toEqual(itemFeatureCollection);
      });
    });

    describe('compareItemFeature', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareItemFeature(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareItemFeature(entity1, entity2);
        const compareResult2 = service.compareItemFeature(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareItemFeature(entity1, entity2);
        const compareResult2 = service.compareItemFeature(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareItemFeature(entity1, entity2);
        const compareResult2 = service.compareItemFeature(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
