import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { LibroService } from '../../services/libro';
import { Libri } from './libri';

describe('Libri', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Libri],
      providers: [
        provideRouter([]),
        {
          provide: LibroService,
          useValue: {
            getPage: () => of({ content: [], page: { size: 5, number: 0, totalElements: 0, totalPages: 0 } }),
          },
        },
      ],
    }).compileComponents();
  });

  it('should render the table', async () => {
    const fixture = TestBed.createComponent(Libri);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('h1')?.textContent).toContain('Libri');
    expect(compiled.querySelector('p-table')).toBeTruthy();
  });
});