import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { NazionalitaService } from '../../services/nazionalita';
import { ConfirmDialogService } from '../../services/confirm-dialog';
import { NotificationService } from '../../services/notification';
import { Nazionalita as NazionalitaModel } from '../../interfaces/nazionalita';
import { Nazionalita } from './nazionalita';

describe('Nazionalita', () => {
  const nazionalita: NazionalitaModel = { id: 1, nome: 'Italiana' };

  let createCalls: string[];
  let updateCalls: { id: number; nome: string }[];
  let deleteCalls: number[];
  let confirmed: boolean;
  let failure: unknown;
  let successToasts: string[];
  let errorToasts: { error: unknown; summary?: string }[];

  function createComponent(): Nazionalita {
    createCalls = [];
    updateCalls = [];
    deleteCalls = [];
    errorToasts = [];
    successToasts = [];
    confirmed = true;
    failure = null;

    TestBed.configureTestingModule({
      imports: [Nazionalita],
      providers: [
        {
          provide: NazionalitaService,
          useValue: {
            getAll: () => of([nazionalita]),
            create: (nome: string) => {
              createCalls.push(nome);
              return failure ? throwError(() => failure) : of({ id: 99, nome });
            },
            update: (id: number, nome: string) => {
              updateCalls.push({ id, nome });
              return failure ? throwError(() => failure) : of({ id, nome });
            },
            delete: (id: number) => {
              deleteCalls.push(id);
              return failure ? throwError(() => failure) : of(void 0);
            },
          },
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

    return TestBed.createComponent(Nazionalita).componentInstance;
  }

  const componentApi = (component: Nazionalita) =>
    component as unknown as {
      openEdit(nazionalita: NazionalitaModel): void;
      save(nome: string): Promise<void>;
      delete(nazionalita: NazionalitaModel): Promise<void>;
    };

  it('should render the table', async () => {
    createComponent();
    const fixture = TestBed.createComponent(Nazionalita);

    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('h1')?.textContent).toContain('Nazionalità');
    expect(compiled.querySelector('p-table')).toBeTruthy();
  });

  it('should create a nazionalita and notify success', async () => {
    const api = componentApi(createComponent());

    await api.save('Portogallo');

    expect(createCalls).toEqual(['Portogallo']);
    expect(updateCalls).toEqual([]);
    expect(successToasts).toEqual(['Nazionalità creata']);
    expect(errorToasts).toEqual([]);
  });

  it('should update the nazionalita opened from the table', async () => {
    const api = componentApi(createComponent());
    api.openEdit(nazionalita);

    await api.save('Spagnola');

    expect(updateCalls).toEqual([{ id: nazionalita.id, nome: 'Spagnola' }]);
    expect(createCalls).toEqual([]);
    expect(successToasts).toEqual(['Nazionalità aggiornata']);
  });

  it('should hand the save failure to the notification service', async () => {
    const api = componentApi(createComponent());
    failure = new HttpErrorResponse({
      status: 409,
      error: { message: 'Nazionalita con nome Portogallo già esistente' },
    });

    await api.save('Portogallo');

    expect(successToasts).toEqual([]);
    expect(errorToasts).toEqual([{ error: failure, summary: 'Creazione non riuscita' }]);
  });

  it('should hand the update failure to the notification service', async () => {
    const api = componentApi(createComponent());
    api.openEdit(nazionalita);
    failure = new HttpErrorResponse({
      status: 409,
      error: { message: 'Nazionalita con nome Spagnola già esistente' },
    });

    await api.save('Spagnola');

    expect(successToasts).toEqual([]);
    expect(errorToasts).toEqual([{ error: failure, summary: 'Modifica non riuscita' }]);
  });

  it('should delete the nazionalita once the user confirms', async () => {
    const api = componentApi(createComponent());

    await api.delete(nazionalita);

    expect(deleteCalls).toEqual([nazionalita.id]);
    expect(errorToasts).toEqual([]);
  });

  it('should not delete the nazionalita when the user cancels', async () => {
    const api = componentApi(createComponent());
    confirmed = false;

    await api.delete(nazionalita);

    expect(deleteCalls).toEqual([]);
  });

  it('should hand the deletion failure to the notification service', async () => {
    const api = componentApi(createComponent());
    failure = new HttpErrorResponse({
      status: 409,
      error: { message: 'Nazionalita con id 1 è usata da almeno un autore' },
    });

    await api.delete(nazionalita);

    expect(errorToasts).toEqual([{ error: failure, summary: 'Eliminazione non riuscita' }]);
  });
});
