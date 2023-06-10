import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IBusinessModel } from '../business-model.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../business-model.test-samples';

import { BusinessModelService } from './business-model.service';

const requireRestSample: IBusinessModel = {
  ...sampleWithRequiredData,
};

describe('BusinessModel Service', () => {
  let service: BusinessModelService;
  let httpMock: HttpTestingController;
  let expectedResult: IBusinessModel | IBusinessModel[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(BusinessModelService);
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

    it('should create a BusinessModel', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const businessModel = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(businessModel).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a BusinessModel', () => {
      const businessModel = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(businessModel).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a BusinessModel', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of BusinessModel', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a BusinessModel', () => {
      const expected = true;

      service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addBusinessModelToCollectionIfMissing', () => {
      it('should add a BusinessModel to an empty array', () => {
        const businessModel: IBusinessModel = sampleWithRequiredData;
        expectedResult = service.addBusinessModelToCollectionIfMissing([], businessModel);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(businessModel);
      });

      it('should not add a BusinessModel to an array that contains it', () => {
        const businessModel: IBusinessModel = sampleWithRequiredData;
        const businessModelCollection: IBusinessModel[] = [
          {
            ...businessModel,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addBusinessModelToCollectionIfMissing(businessModelCollection, businessModel);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a BusinessModel to an array that doesn't contain it", () => {
        const businessModel: IBusinessModel = sampleWithRequiredData;
        const businessModelCollection: IBusinessModel[] = [sampleWithPartialData];
        expectedResult = service.addBusinessModelToCollectionIfMissing(businessModelCollection, businessModel);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(businessModel);
      });

      it('should add only unique BusinessModel to an array', () => {
        const businessModelArray: IBusinessModel[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const businessModelCollection: IBusinessModel[] = [sampleWithRequiredData];
        expectedResult = service.addBusinessModelToCollectionIfMissing(businessModelCollection, ...businessModelArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const businessModel: IBusinessModel = sampleWithRequiredData;
        const businessModel2: IBusinessModel = sampleWithPartialData;
        expectedResult = service.addBusinessModelToCollectionIfMissing([], businessModel, businessModel2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(businessModel);
        expect(expectedResult).toContain(businessModel2);
      });

      it('should accept null and undefined values', () => {
        const businessModel: IBusinessModel = sampleWithRequiredData;
        expectedResult = service.addBusinessModelToCollectionIfMissing([], null, businessModel, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(businessModel);
      });

      it('should return initial array if no BusinessModel is added', () => {
        const businessModelCollection: IBusinessModel[] = [sampleWithRequiredData];
        expectedResult = service.addBusinessModelToCollectionIfMissing(businessModelCollection, undefined, null);
        expect(expectedResult).toEqual(businessModelCollection);
      });
    });

    describe('compareBusinessModel', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareBusinessModel(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = null;

        const compareResult1 = service.compareBusinessModel(entity1, entity2);
        const compareResult2 = service.compareBusinessModel(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = { id: 'CBA' };

        const compareResult1 = service.compareBusinessModel(entity1, entity2);
        const compareResult2 = service.compareBusinessModel(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = { id: 'ABC' };

        const compareResult1 = service.compareBusinessModel(entity1, entity2);
        const compareResult2 = service.compareBusinessModel(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
