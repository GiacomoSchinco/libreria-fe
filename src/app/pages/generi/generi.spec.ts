import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { GenereService } from '../../services/genere';
import { ConfirmDialogService } from '../../services/confirm-dialog';
import { NotificationService } from '../../services/notification';
import { Genere } from '../../interfaces/genere';
import { Generi } from './generi';

describe('Generi', () => {
  const genere: Genere = { id: 1, nome: 'Romanzo' };

  let createCalls: string[];
  let updateCalls: { id: number; nome: string }[];
  let deleteCalls: number[];
  let confirmed: boolean;
  let failure: unknown;
  let successToasts: string[];
  let errorToasts: { error: unknown; summary?: string }[];

  function createComponent(): Generi {
    createCalls = [];
    updateCalls = [];
    deleteCalls = [];
    errorToasts = [];
    successToasts = [];
    confirmed = true;
    failure = null;

    TestBed.configureTestingModule({
      imports: [Generi],
      providers: [
        {
          provide: GenereService,
          useValue: {
            getAll: () => of([genere]),
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

    return TestBed.createComponent(Generi).componentInstance;
  }

  const componentApi = (component: Generi) =>
    component as unknown as {
      openEdit(genere: Genere): void;
      save(nome: string): Promise<void>;
      delete(genere: Genere): Promise<void>;
    };

  it('should render the table', async () => {
    createComponent();
    const fixture = TestBed.createComponent(Generi);

    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('h1')?.textContent).toContain('Generi');
    expect(compiled.querySelector('p-table')).toBeTruthy();
  });

  it('should create a genere and notify success', async () => {
    const api = componentApi(createComponent());

    await api.save('Fantasy');

    expect(createCalls).toEqual(['Fantasy']);
    expect(updateCalls).toEqual([]);
    expect(successToasts).toEqual(['Genere creato']);
    expect(errorToasts).toEqual([]);
  });

  it('should update the genere opened from the table', async () => {
    const api = componentApi(createComponent());
    api.openEdit(genere);

    await api.save('Romanzo Rosa');

    expect(updateCalls).toEqual([{ id: genere.id, nome: 'Romanzo Rosa' }]);
    expect(createCalls).toEqual([]);
    expect(successToasts).toEqual(['Genere aggiornato']);
  });

  it('should hand the save failure to the notification service', async () => {
    const api = componentApi(createComponent());
    failure = new HttpErrorResponse({
      status: 409,
      error: { message: 'Genere con nome Fantasy già esistente' },
    });

    await api.save('Fantasy');

    expect(successToasts).toEqual([]);
    expect(errorToasts).toEqual([{ error: failure, summary: 'Creazione non riuscita' }]);
  });

  it('should hand the update failure to the notification service', async () => {
    const api = componentApi(createComponent());
    api.openEdit(genere);
    failure = new HttpErrorResponse({
      status: 409,
      error: { message: 'Genere con nome Fantasy già esistente' },
    });

    await api.save('Fantasy');

    expect(successToasts).toEqual([]);
    expect(errorToasts).toEqual([{ error: failure, summary: 'Modifica non riuscita' }]);
  });

  it('should delete the genere once the user confirms', async () => {
    const api = componentApi(createComponent());

    await api.delete(genere);

    expect(deleteCalls).toEqual([genere.id]);
    expect(errorToasts).toEqual([]);
  });

  it('should not delete the genere when the user cancels', async () => {
    const api = componentApi(createComponent());
    confirmed = false;

    await api.delete(genere);

    expect(deleteCalls).toEqual([]);
  });

  it('should hand the deletion failure to the notification service', async () => {
    const api = componentApi(createComponent());
    const error = new HttpErrorResponse({
      status: 409,
      error: { message: 'Genere con id 1 è usata da almeno un libro: cancellazione non consentita' },
    });
    failure = error;

    await api.delete(genere);

    expect(errorToasts).toEqual([{ error, summary: 'Eliminazione non riuscita' }]);
  });
});
