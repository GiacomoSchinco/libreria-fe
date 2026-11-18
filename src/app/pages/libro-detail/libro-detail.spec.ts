import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';

import { LibroService } from '../../services/libro';
import { LibroDetail } from './libro-detail';

describe('LibroDetail', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibroDetail],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ id: '1' }) } } },
        {
          provide: LibroService,
          useValue: {
            getById: () =>
              of({
                id: 1,
                titolo: 'Il nome della rosa',
                anno: 1980,
                genere: { id: 1, nome: 'Romanzo' },
                autori: [],
              }),
          },
        },
      ],
    }).compileComponents();
  });

  it('should render the requested book', async () => {
    const fixture = TestBed.createComponent(LibroDetail);
    await fixture.whenStable();
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';

    expect(text).toContain('Il nome della rosa');
    expect(text).toContain('Romanzo');
  });
});