import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ISimulation } from '../simulation.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../simulation.test-samples';

import { SimulationService } from './simulation.service';

const requireRestSample: ISimulation = {
  ...sampleWithRequiredData,
};

describe('Simulation Service', () => {
  let service: SimulationService;
  let httpMock: HttpTestingController;
  let expectedResult: ISimulation | ISimulation[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(SimulationService);
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

    it('should create a Simulation', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const simulation = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(simulation).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Simulation', () => {
      const simulation = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(simulation).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Simulation', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Simulation', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Simulation', () => {
      const expected = true;

      service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addSimulationToCollectionIfMissing', () => {
      it('should add a Simulation to an empty array', () => {
        const simulation: ISimulation = sampleWithRequiredData;
        expectedResult = service.addSimulationToCollectionIfMissing([], simulation);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(simulation);
      });

      it('should not add a Simulation to an array that contains it', () => {
        const simulation: ISimulation = sampleWithRequiredData;
        const simulationCollection: ISimulation[] = [
          {
            ...simulation,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addSimulationToCollectionIfMissing(simulationCollection, simulation);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Simulation to an array that doesn't contain it", () => {
        const simulation: ISimulation = sampleWithRequiredData;
        const simulationCollection: ISimulation[] = [sampleWithPartialData];
        expectedResult = service.addSimulationToCollectionIfMissing(simulationCollection, simulation);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(simulation);
      });

      it('should add only unique Simulation to an array', () => {
        const simulationArray: ISimulation[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const simulationCollection: ISimulation[] = [sampleWithRequiredData];
        expectedResult = service.addSimulationToCollectionIfMissing(simulationCollection, ...simulationArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const simulation: ISimulation = sampleWithRequiredData;
        const simulation2: ISimulation = sampleWithPartialData;
        expectedResult = service.addSimulationToCollectionIfMissing([], simulation, simulation2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(simulation);
        expect(expectedResult).toContain(simulation2);
      });

      it('should accept null and undefined values', () => {
        const simulation: ISimulation = sampleWithRequiredData;
        expectedResult = service.addSimulationToCollectionIfMissing([], null, simulation, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(simulation);
      });

      it('should return initial array if no Simulation is added', () => {
        const simulationCollection: ISimulation[] = [sampleWithRequiredData];
        expectedResult = service.addSimulationToCollectionIfMissing(simulationCollection, undefined, null);
        expect(expectedResult).toEqual(simulationCollection);
      });
    });

    describe('compareSimulation', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareSimulation(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = null;

        const compareResult1 = service.compareSimulation(entity1, entity2);
        const compareResult2 = service.compareSimulation(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = { id: 'CBA' };

        const compareResult1 = service.compareSimulation(entity1, entity2);
        const compareResult2 = service.compareSimulation(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = { id: 'ABC' };

        const compareResult1 = service.compareSimulation(entity1, entity2);
        const compareResult2 = service.compareSimulation(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
