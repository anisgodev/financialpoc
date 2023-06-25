import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ItemGroupService } from '../service/item-group.service';

import { ItemGroupComponent } from './item-group.component';

describe('ItemGroup Management Component', () => {
  let comp: ItemGroupComponent;
  let fixture: ComponentFixture<ItemGroupComponent>;
  let service: ItemGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'item-group', component: ItemGroupComponent }]), HttpClientTestingModule],
      declarations: [ItemGroupComponent],
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
      .overrideTemplate(ItemGroupComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ItemGroupComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ItemGroupService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
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
    expect(comp.itemGroups?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to itemGroupService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getItemGroupIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getItemGroupIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
