import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { CasaEditriceService } from '../../services/casa-editrice';
import { ConfirmDialogService } from '../../services/confirm-dialog';
import { NotificationService } from '../../services/notification';
import { CasaEditrice } from '../../interfaces/casa-editrice';
import { CaseEditrici } from './case-editrici';

describe('CaseEditrici', () => {
  const casaEditrice: CasaEditrice = { id: 4, nome: 'Mondadori' };

  let createCalls: string[];
  let updateCalls: { id: number; nome: string }[];
  let deleteCalls: number[];
  let confirmed: boolean;
  let failure: unknown;
  let successToasts: string[];
  let errorToasts: { error: unknown; summary?: string }[];

  function createComponent(): CaseEditrici {
    createCalls = [];
    updateCalls = [];
    deleteCalls = [];
    errorToasts = [];
    successToasts = [];
    confirmed = true;
    failure = null;

    TestBed.configureTestingModule({
      imports: [CaseEditrici],
      providers: [
        {
          provide: CasaEditriceService,
          useValue: {
            getAll: () => of([casaEditrice]),
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

    return TestBed.createComponent(CaseEditrici).componentInstance;
  }

  const componentApi = (component: CaseEditrici) =>
    component as unknown as {
      openEdit(casaEditrice: CasaEditrice): void;
      save(nome: string): Promise<void>;
      delete(casaEditrice: CasaEditrice): Promise<void>;
    };

  it('should render the table', async () => {
    createComponent();
    const fixture = TestBed.createComponent(CaseEditrici);

    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('h1')?.textContent).toContain('Case editrici');
    expect(compiled.querySelector('p-table')).toBeTruthy();
  });

  it('should create a casa editrice and notify success', async () => {
    const api = componentApi(createComponent());

    await api.save('Adelphi');

    expect(createCalls).toEqual(['Adelphi']);
    expect(updateCalls).toEqual([]);
    expect(successToasts).toEqual(['Casa editrice creata']);
    expect(errorToasts).toEqual([]);
  });

  it('should update the casa editrice opened from the table', async () => {
    const api = componentApi(createComponent());
    api.openEdit(casaEditrice);

    await api.save('Mondadori Editore');

    expect(updateCalls).toEqual([{ id: casaEditrice.id, nome: 'Mondadori Editore' }]);
    expect(createCalls).toEqual([]);
    expect(successToasts).toEqual(['Casa editrice aggiornata']);
  });

  it('should hand the save failure to the notification service', async () => {
    const api = componentApi(createComponent());
    failure = new HttpErrorResponse({
      status: 409,
      error: { message: 'CasaEditrice con nome Adelphi già esistente' },
    });

    await api.save('Adelphi');

    expect(successToasts).toEqual([]);
    expect(errorToasts).toEqual([{ error: failure, summary: 'Creazione non riuscita' }]);
  });

  it('should delete the casa editrice once the user confirms', async () => {
    const api = componentApi(createComponent());

    await api.delete(casaEditrice);

    expect(deleteCalls).toEqual([casaEditrice.id]);
    expect(successToasts).toEqual(['Casa editrice eliminata']);
  });

  it('should not delete the casa editrice when the user cancels', async () => {
    const api = componentApi(createComponent());
    confirmed = false;

    await api.delete(casaEditrice);

    expect(deleteCalls).toEqual([]);
  });

  it('should hand the deletion failure to the notification service', async () => {
    const api = componentApi(createComponent());
    failure = new HttpErrorResponse({
      status: 409,
      error: { message: 'CasaEditrice con id 4 e usata da almeno una riga di magazzino' },
    });

    await api.delete(casaEditrice);

    expect(errorToasts).toEqual([{ error: failure, summary: 'Eliminazione non riuscita' }]);
  });
});
