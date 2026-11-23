import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { AutoreService } from '../../services/autore';
import { NazionalitaService } from '../../services/nazionalita';
import { ConfirmDialogService } from '../../services/confirm-dialog';
import { NotificationService } from '../../services/notification';
import { Autore, AutoreRequest } from '../../interfaces/autore';
import { Autori } from './autori';

describe('Autori', () => {
  const autore: Autore = {
    id: 1,
    nome: 'Mario',
    cognome: 'Rossi',
    dataNascita: '1980-05-12',
    nazionalita: { id: 3, nome: 'Italia' },
  };

  const request: AutoreRequest = {
    nome: 'Mario',
    cognome: 'Rossi',
    dataNascita: '1980-05-12',
    idNazionalita: 3,
  };

  let createCalls: AutoreRequest[];
  let updateCalls: { id: number; request: AutoreRequest }[];
  let deleteCalls: number[];
  let confirmed: boolean;
  let failure: unknown;
  let successToasts: string[];
  let errorToasts: { error: unknown; summary?: string }[];

  function createComponent(): Autori {
    createCalls = [];
    updateCalls = [];
    deleteCalls = [];
    errorToasts = [];
    successToasts = [];
    confirmed = true;
    failure = null;

    TestBed.configureTestingModule({
      imports: [Autori],
      providers: [
        {
          provide: AutoreService,
          useValue: {
            getPage: () =>
              of({ content: [autore], page: { size: 10, number: 0, totalElements: 1, totalPages: 1 } }),
            create: (value: AutoreRequest) => {
              createCalls.push(value);
              return failure ? throwError(() => failure) : of({ ...autore, id: 99 });
            },
            update: (id: number, value: AutoreRequest) => {
              updateCalls.push({ id, request: value });
              return failure ? throwError(() => failure) : of({ ...autore, id });
            },
            delete: (id: number) => {
              deleteCalls.push(id);
              return failure ? throwError(() => failure) : of(void 0);
            },
          },
        },
        {
          provide: NazionalitaService,
          useValue: { getAll: () => of([{ id: 3, nome: 'Italia' }]) },
        },
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

    return TestBed.createComponent(Autori).componentInstance;
  }

  const componentApi = (component: Autori) =>
    component as unknown as {
      openEdit(autore: Autore): void;
      save(request: AutoreRequest): Promise<void>;
      delete(autore: Autore): Promise<void>;
    };

  it('should render the table', async () => {
    createComponent();
    const fixture = TestBed.createComponent(Autori);

    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('h1')?.textContent).toContain('Autori');
    expect(compiled.querySelector('p-table')).toBeTruthy();
  });

  it('should create an autore and notify success', async () => {
    const api = componentApi(createComponent());

    await api.save(request);

    expect(createCalls).toEqual([request]);
    expect(updateCalls).toEqual([]);
    expect(successToasts).toEqual(['Autore creato']);
    expect(errorToasts).toEqual([]);
  });

  it('should update the autore opened from the table', async () => {
    const api = componentApi(createComponent());
    api.openEdit(autore);

    await api.save({ ...request, cognome: 'Bianchi' });

    expect(updateCalls).toEqual([{ id: autore.id, request: { ...request, cognome: 'Bianchi' } }]);
    expect(createCalls).toEqual([]);
    expect(successToasts).toEqual(['Autore aggiornato']);
  });

  it('should hand the save failure to the notification service', async () => {
    const api = componentApi(createComponent());
    failure = new HttpErrorResponse({
      status: 409,
      error: { message: 'Autore già esistente' },
    });

    await api.save(request);

    expect(successToasts).toEqual([]);
    expect(errorToasts).toEqual([{ error: failure, summary: 'Creazione non riuscita' }]);
  });

  it('should delete the autore once the user confirms', async () => {
    const api = componentApi(createComponent());

    await api.delete(autore);

    expect(deleteCalls).toEqual([autore.id]);
    expect(successToasts).toEqual(['Autore eliminato']);
  });

  it('should not delete the autore when the user cancels', async () => {
    const api = componentApi(createComponent());
    confirmed = false;

    await api.delete(autore);

    expect(deleteCalls).toEqual([]);
  });

  it('should hand the deletion failure to the notification service', async () => {
    const api = componentApi(createComponent());
    failure = new HttpErrorResponse({
      status: 409,
      error: { message: 'Autore con id 1 è usato da almeno un libro' },
    });

    await api.delete(autore);

    expect(errorToasts).toEqual([{ error: failure, summary: 'Eliminazione non riuscita' }]);
  });
});
