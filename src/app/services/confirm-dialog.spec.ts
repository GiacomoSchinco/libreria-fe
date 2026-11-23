import { TestBed } from '@angular/core/testing';
import { Confirmation, ConfirmationService } from 'primeng/api';

import { ConfirmDialogService } from './confirm-dialog';

describe('ConfirmDialogService', () => {
  let service: ConfirmDialogService;
  let requested: Confirmation | null;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [ConfirmationService] });

    TestBed.inject(ConfirmationService).requireConfirmation$.subscribe((confirmation) => {
      requested = confirmation;
    });

    service = TestBed.inject(ConfirmDialogService);
    requested = null;
  });

  it('should ask for confirmation and resolve true when accepted', async () => {
    const answer = service.confirmDelete('il genere "Romanzo"');

    expect(requested?.header).toBe('Conferma eliminazione');
    expect(requested?.message).toContain('il genere "Romanzo"');
    expect(requested?.acceptButtonProps?.label).toBe('Elimina');

    requested?.accept?.();

    await expect(answer).resolves.toBe(true);
  });

  it('should resolve false when rejected', async () => {
    const answer = service.confirmDelete('il genere "Romanzo"');

    requested?.reject?.();

    await expect(answer).resolves.toBe(false);
  });
});
