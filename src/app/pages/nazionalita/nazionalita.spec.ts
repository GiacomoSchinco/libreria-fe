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

  let deleteCalls: number[];
  let confirmed: boolean;
  let failure: unknown;
  let errorToasts: { error: unknown; summary?: string }[];

  function createComponent(): Nazionalita {
    deleteCalls = [];
    errorToasts = [];
    confirmed = true;
    failure = null;

    TestBed.configureTestingModule({
      imports: [Nazionalita],
      providers: [
        {
          provide: NazionalitaService,
          useValue: {
            getAll: () => of([nazionalita]),
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
            success: () => {},
            error: () => {},
            errorFrom: (error: unknown, summary?: string) => errorToasts.push({ error, summary }),
          },
        },
      ],
    });

    return TestBed.createComponent(Nazionalita).componentInstance;
  }

  const deleteNazionalita = (component: Nazionalita, value: NazionalitaModel) =>
    (
      component as unknown as { delete(nazionalita: NazionalitaModel): Promise<void> }
    ).delete(value);

  it('should render the table', async () => {
    createComponent();
    const fixture = TestBed.createComponent(Nazionalita);

    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('h1')?.textContent).toContain('Nazionalità');
    expect(compiled.querySelector('p-table')).toBeTruthy();
  });

  it('should delete the nazionalita once the user confirms', async () => {
    const component = createComponent();

    await deleteNazionalita(component, nazionalita);

    expect(deleteCalls).toEqual([nazionalita.id]);
    expect(errorToasts).toEqual([]);
  });

  it('should not delete the nazionalita when the user cancels', async () => {
    const component = createComponent();
    confirmed = false;

    await deleteNazionalita(component, nazionalita);

    expect(deleteCalls).toEqual([]);
  });

  it('should hand the failure to the notification service', async () => {
    const component = createComponent();
    failure = new HttpErrorResponse({
      status: 409,
      error: { message: 'Nazionalita con id 1 è usata da almeno un autore' },
    });

    await deleteNazionalita(component, nazionalita);

    expect(errorToasts).toEqual([{ error: failure, summary: 'Eliminazione non riuscita' }]);
  });
});
