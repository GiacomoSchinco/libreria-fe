import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService, ToastMessageOptions } from 'primeng/api';

import { NotificationService } from './notification';

describe('NotificationService', () => {
  let service: NotificationService;
  let messages: ToastMessageOptions[];

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [MessageService] });

    messages = [];
    TestBed.inject(MessageService).messageObserver.subscribe((message) => {
      messages.push(...(Array.isArray(message) ? message : [message]));
    });

    service = TestBed.inject(NotificationService);
  });

  it('should add a success message', () => {
    service.success('Genere eliminato', 'Fantasy');

    expect(messages).toHaveLength(1);
    expect(messages[0]).toMatchObject({
      severity: 'success',
      summary: 'Genere eliminato',
      detail: 'Fantasy',
    });
  });

  it('should add an error message that stays longer than a success', () => {
    service.success('Fatto');
    service.error('Eliminazione non riuscita');

    expect(messages[1]).toMatchObject({
      severity: 'error',
      summary: 'Eliminazione non riuscita',
    });
    expect(messages[1].life).toBeGreaterThan(messages[0].life ?? 0);
  });

  it('should use the backend reason as detail for errorFrom', () => {
    service.errorFrom(
      new HttpErrorResponse({
        status: 409,
        error: { message: 'Genere con id 1 è usata da almeno un libro' },
      }),
      'Eliminazione non riuscita',
    );

    expect(messages[0]).toMatchObject({
      severity: 'error',
      summary: 'Eliminazione non riuscita',
      detail: 'Genere con id 1 è usata da almeno un libro',
    });
  });
});
