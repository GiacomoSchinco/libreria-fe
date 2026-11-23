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

  let deleteCalls: number[];
  let confirmed: boolean;
  let failure: unknown;
  let errorToasts: { error: unknown; summary?: string }[];

  function createComponent(): Generi {
    deleteCalls = [];
    errorToasts = [];
    confirmed = true;
    failure = null;

    TestBed.configureTestingModule({
      imports: [Generi],
      providers: [
        {
          provide: GenereService,
          useValue: {
            getAll: () => of([genere]),
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

    return TestBed.createComponent(Generi).componentInstance;
  }

  const deleteGenere = (component: Generi, value: Genere) =>
    (component as unknown as { delete(genere: Genere): Promise<void> }).delete(value);

  it('should render the table', async () => {
    createComponent();
    const fixture = TestBed.createComponent(Generi);

    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('h1')?.textContent).toContain('Generi');
    expect(compiled.querySelector('p-table')).toBeTruthy();
  });

  it('should delete the genere once the user confirms', async () => {
    const component = createComponent();

    await deleteGenere(component, genere);

    expect(deleteCalls).toEqual([genere.id]);
    expect(errorToasts).toEqual([]);
  });

  it('should not delete the genere when the user cancels', async () => {
    const component = createComponent();
    confirmed = false;

    await deleteGenere(component, genere);

    expect(deleteCalls).toEqual([]);
  });

  it('should hand the failure to the notification service', async () => {
    const component = createComponent();
    const error = new HttpErrorResponse({
      status: 409,
      error: { message: 'Genere con id 1 è usata da almeno un libro: cancellazione non consentita' },
    });
    failure = error;

    await deleteGenere(component, genere);

    expect(errorToasts).toEqual([{ error, summary: 'Eliminazione non riuscita' }]);
  });
});
