import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { MagazzinoService } from '../../services/magazzino';
import { LibroService } from '../../services/libro';
import { CasaEditriceService } from '../../services/casa-editrice';
import { ConfirmDialogService } from '../../services/confirm-dialog';
import { NotificationService } from '../../services/notification';
import { Magazzino as MagazzinoModel, MagazzinoRequest } from '../../interfaces/magazzino';
import { Magazzino } from './magazzino';

describe('Magazzino', () => {
  const request: MagazzinoRequest = { idLibro: 10, quantita: 3, idCasaEditrice: 4 };

  const riga: MagazzinoModel = {
    id: 5,
    quantita: 3,
    casaEditrice: { id: 4, nome: 'Mondadori' },
    libro: {
      id: 10,
      titolo: '1984',
      anno: 1949,
      genere: { id: 1, nome: 'Fantascienza' },
      autori: [],
    },
  };

  let createCalls: MagazzinoRequest[];
  let updateCalls: { id: number; request: MagazzinoRequest }[];
  let deleteCalls: number[];
  let confirmed: boolean;
  let failure: unknown;
  let successToasts: string[];
  let errorToasts: { error: unknown; summary?: string }[];

  function createComponent(): Magazzino {
    createCalls = [];
    updateCalls = [];
    deleteCalls = [];
    errorToasts = [];
    successToasts = [];
    confirmed = true;
    failure = null;

    TestBed.configureTestingModule({
      imports: [Magazzino],
      providers: [
        {
          provide: MagazzinoService,
          useValue: {
            getPage: () =>
              of({ content: [], page: { size: 10, number: 0, totalElements: 0, totalPages: 0 } }),
            create: (value: MagazzinoRequest) => {
              createCalls.push(value);
              return failure ? throwError(() => failure) : of({ id: 99 });
            },
            update: (id: number, value: MagazzinoRequest) => {
              updateCalls.push({ id, request: value });
              return failure ? throwError(() => failure) : of({ id });
            },
            delete: (id: number) => {
              deleteCalls.push(id);
              return failure ? throwError(() => failure) : of(void 0);
            },
          },
        },
        {
          provide: LibroService,
          useValue: { searchByTitolo: () => of([]) },
        },
        { provide: CasaEditriceService, useValue: { getAll: () => of([]) } },
        {
          provide: ConfirmDialogService,
          useValue: { confirmDelete: () => Promise.resolve(confirmed) },
        },
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

    return TestBed.createComponent(Magazzino).componentInstance;
  }

  const save = (component: Magazzino, value: MagazzinoRequest) =>
    (component as unknown as { save(request: MagazzinoRequest): Promise<void> }).save(value);

  const openEdit = (component: Magazzino, value: MagazzinoModel) =>
    (component as unknown as { openEdit(riga: MagazzinoModel): void }).openEdit(value);

  const remove = (component: Magazzino, value: MagazzinoModel) =>
    (component as unknown as { delete(riga: MagazzinoModel): Promise<void> }).delete(value);

  it('should render the table', async () => {
    createComponent();
    const fixture = TestBed.createComponent(Magazzino);

    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('h1')?.textContent).toContain('Magazzino');
    expect(compiled.querySelector('p-table')).toBeTruthy();
  });

  it('should add a book to the magazzino and notify success', async () => {
    const component = createComponent();

    await save(component, request);

    expect(createCalls).toEqual([request]);
    expect(updateCalls).toEqual([]);
    expect(successToasts).toEqual(['Libro aggiunto al magazzino']);
    expect(errorToasts).toEqual([]);
  });

  it('should update the row opened from the table', async () => {
    const component = createComponent();
    openEdit(component, riga);

    await save(component, { ...request, quantita: 7 });

    expect(updateCalls).toEqual([{ id: riga.id, request: { ...request, quantita: 7 } }]);
    expect(createCalls).toEqual([]);
    expect(successToasts).toEqual(['Magazzino aggiornato']);
  });

  it('should hand the creation failure to the notification service', async () => {
    const component = createComponent();
    failure = new HttpErrorResponse({
      status: 400,
      error: { message: "idLibro e' obbligatorio" },
    });

    await save(component, request);

    expect(successToasts).toEqual([]);
    expect(errorToasts).toEqual([{ error: failure, summary: 'Creazione non riuscita' }]);
  });

  it('should hand the update failure to the notification service', async () => {
    const component = createComponent();
    openEdit(component, riga);
    failure = new HttpErrorResponse({
      status: 404,
      error: { message: 'Libro con id 10 non trovato' },
    });

    await save(component, request);

    expect(errorToasts).toEqual([{ error: failure, summary: 'Modifica non riuscita' }]);
  });

  it('should delete the row once the user confirms', async () => {
    const component = createComponent();

    await remove(component, riga);

    expect(deleteCalls).toEqual([riga.id]);
    expect(successToasts).toEqual(['Riga eliminata']);
  });

  it('should not delete the row when the user cancels', async () => {
    const component = createComponent();
    confirmed = false;

    await remove(component, riga);

    expect(deleteCalls).toEqual([]);
  });

  it('should hand the deletion failure to the notification service', async () => {
    const component = createComponent();
    failure = new HttpErrorResponse({
      status: 404,
      error: { message: 'Magazzino con id 5 non trovato' },
    });

    await remove(component, riga);

    expect(errorToasts).toEqual([{ error: failure, summary: 'Eliminazione non riuscita' }]);
  });
});
