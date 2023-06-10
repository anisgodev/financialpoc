import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { SimulationService } from '../service/simulation.service';

import { SimulationComponent } from './simulation.component';

describe('Simulation Management Component', () => {
  let comp: SimulationComponent;
  let fixture: ComponentFixture<SimulationComponent>;
  let service: SimulationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'simulation', component: SimulationComponent }]), HttpClientTestingModule],
      declarations: [SimulationComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(SimulationComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SimulationComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(SimulationService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 'ABC' }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.simulations?.[0]).toEqual(expect.objectContaining({ id: 'ABC' }));
  });

  describe('trackId', () => {
    it('Should forward to simulationService', () => {
      const entity = { id: 'ABC' };
      jest.spyOn(service, 'getSimulationIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getSimulationIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
