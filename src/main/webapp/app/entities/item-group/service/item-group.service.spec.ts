import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IItemGroup } from '../item-group.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../item-group.test-samples';

import { ItemGroupService } from './item-group.service';

const requireRestSample: IItemGroup = {
  ...sampleWithRequiredData,
};

describe('ItemGroup Service', () => {
  let service: ItemGroupService;
  let httpMock: HttpTestingController;
  let expectedResult: IItemGroup | IItemGroup[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ItemGroupService);
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

    it('should create a ItemGroup', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const itemGroup = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(itemGroup).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ItemGroup', () => {
      const itemGroup = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(itemGroup).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ItemGroup', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ItemGroup', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ItemGroup', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addItemGroupToCollectionIfMissing', () => {
      it('should add a ItemGroup to an empty array', () => {
        const itemGroup: IItemGroup = sampleWithRequiredData;
        expectedResult = service.addItemGroupToCollectionIfMissing([], itemGroup);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(itemGroup);
      });

      it('should not add a ItemGroup to an array that contains it', () => {
        const itemGroup: IItemGroup = sampleWithRequiredData;
        const itemGroupCollection: IItemGroup[] = [
          {
            ...itemGroup,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addItemGroupToCollectionIfMissing(itemGroupCollection, itemGroup);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ItemGroup to an array that doesn't contain it", () => {
        const itemGroup: IItemGroup = sampleWithRequiredData;
        const itemGroupCollection: IItemGroup[] = [sampleWithPartialData];
        expectedResult = service.addItemGroupToCollectionIfMissing(itemGroupCollection, itemGroup);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(itemGroup);
      });

      it('should add only unique ItemGroup to an array', () => {
        const itemGroupArray: IItemGroup[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const itemGroupCollection: IItemGroup[] = [sampleWithRequiredData];
        expectedResult = service.addItemGroupToCollectionIfMissing(itemGroupCollection, ...itemGroupArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const itemGroup: IItemGroup = sampleWithRequiredData;
        const itemGroup2: IItemGroup = sampleWithPartialData;
        expectedResult = service.addItemGroupToCollectionIfMissing([], itemGroup, itemGroup2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(itemGroup);
        expect(expectedResult).toContain(itemGroup2);
      });

      it('should accept null and undefined values', () => {
        const itemGroup: IItemGroup = sampleWithRequiredData;
        expectedResult = service.addItemGroupToCollectionIfMissing([], null, itemGroup, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(itemGroup);
      });

      it('should return initial array if no ItemGroup is added', () => {
        const itemGroupCollection: IItemGroup[] = [sampleWithRequiredData];
        expectedResult = service.addItemGroupToCollectionIfMissing(itemGroupCollection, undefined, null);
        expect(expectedResult).toEqual(itemGroupCollection);
      });
    });

    describe('compareItemGroup', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareItemGroup(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareItemGroup(entity1, entity2);
        const compareResult2 = service.compareItemGroup(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareItemGroup(entity1, entity2);
        const compareResult2 = service.compareItemGroup(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareItemGroup(entity1, entity2);
        const compareResult2 = service.compareItemGroup(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
