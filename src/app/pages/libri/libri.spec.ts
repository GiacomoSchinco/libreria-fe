import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';

import { LibroService } from '../../services/libro';
import { GenereService } from '../../services/genere';
import { AutoreService } from '../../services/autore';
import { NazionalitaService } from '../../services/nazionalita';
import { NotificationService } from '../../services/notification';
import { LibroRequest, Libro } from '../../interfaces/libro';
import { Libri } from './libri';

describe('Libri', () => {
  const request: LibroRequest = {
    titolo: 'Dune',
    anno: 1965,
    idGenere: 2,
    nomeGenere: null,
    idAutori: [1],
    nuoviAutori: [],
  };

  const libro: Libro = {
    id: 9,
    titolo: 'Dune',
    anno: 1965,
    genere: { id: 2, nome: 'Fantascienza' },
    autori: [
      { id: 1, nome: 'Frank', cognome: 'Herbert', dataNascita: '1920-10-08', nazionalita: { id: 4, nome: 'America' } },
    ],
  };

  let createCalls: LibroRequest[];
  let updateCalls: { id: number; request: LibroRequest }[];
  let failure: unknown;
  let successToasts: string[];
  let errorToasts: { error: unknown; summary?: string }[];

  function createComponent(): Libri {
    createCalls = [];
    updateCalls = [];
    errorToasts = [];
    successToasts = [];
    failure = null;

    TestBed.configureTestingModule({
      imports: [Libri],
      providers: [
        provideRouter([]),
        {
          provide: LibroService,
          useValue: {
            getPage: () =>
              of({ content: [], page: { size: 10, number: 0, totalElements: 0, totalPages: 0 } }),
            create: (value: LibroRequest) => {
              createCalls.push(value);
              return failure ? throwError(() => failure) : of({ id: 99 });
            },
            update: (id: number, value: LibroRequest) => {
              updateCalls.push({ id, request: value });
              return failure ? throwError(() => failure) : of({ id });
            },
          },
        },
        { provide: GenereService, useValue: { getAll: () => of([]) } },
        {
          provide: AutoreService,
          useValue: {
            getPage: () =>
              of({ content: [], page: { size: 500, number: 0, totalElements: 0, totalPages: 0 } }),
          },
        },
        { provide: NazionalitaService, useValue: { getAll: () => of([]) } },
        {
          provide: NotificationService,
          useValue: {
            success: (summary: string) => successToasts.push(summary),
            error: () => {},
            errorFrom: (error: unknown, summary?: string) => errorToasts.push({ error, summary }),
          },
        },
      ],
    });

    return TestBed.createComponent(Libri).componentInstance;
  }

  const save = (component: Libri, value: LibroRequest) =>
    (component as unknown as { save(request: LibroRequest): Promise<void> }).save(value);

  const openEdit = (component: Libri, value: Libro) =>
    (component as unknown as { openEdit(libro: Libro): void }).openEdit(value);

  it('should render the table', async () => {
    createComponent();
    const fixture = TestBed.createComponent(Libri);

    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('h1')?.textContent).toContain('Libri');
    expect(compiled.querySelector('p-table')).toBeTruthy();
  });

  it('should create a libro and notify success', async () => {
    const component = createComponent();

    await save(component, request);

    expect(createCalls).toEqual([request]);
    expect(successToasts).toEqual(['Libro creato']);
    expect(errorToasts).toEqual([]);
  });

  it('should hand the creation failure to the notification service', async () => {
    const component = createComponent();
    failure = new HttpErrorResponse({
      status: 400,
      error: { message: 'Indica idGenere oppure nomeGenere, non entrambi' },
    });

    await save(component, request);

    expect(successToasts).toEqual([]);
    expect(errorToasts).toEqual([{ error: failure, summary: 'Creazione non riuscita' }]);
  });

  it('should update the libro opened from the table', async () => {
    const component = createComponent();
    openEdit(component, libro);
    const updated: LibroRequest = { ...request, titolo: 'Dune Messiah' };

    await save(component, updated);

    expect(updateCalls).toEqual([{ id: libro.id, request: updated }]);
    expect(createCalls).toEqual([]);
    expect(successToasts).toEqual(['Libro aggiornato']);
    expect(errorToasts).toEqual([]);
  });

  it('should hand the update failure to the notification service', async () => {
    const component = createComponent();
    openEdit(component, libro);
    failure = new HttpErrorResponse({
      status: 400,
      error: { message: 'Genere non trovato' },
    });

    await save(component, request);

    expect(successToasts).toEqual([]);
    expect(errorToasts).toEqual([{ error: failure, summary: 'Modifica non riuscita' }]);
  });
});
