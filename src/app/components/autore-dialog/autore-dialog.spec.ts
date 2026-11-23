import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { Nazionalita } from '../../interfaces/nazionalita';
import { Autore } from '../../interfaces/autore';
import { NazionalitaService } from '../../services/nazionalita';
import { NotificationService } from '../../services/notification';
import { AutoreDialogComponent } from './autore-dialog';

describe('AutoreDialogComponent', () => {
  let component: AutoreDialogComponent;
  let fixture: ComponentFixture<AutoreDialogComponent>;
  let emitted: unknown[];
  let nazionalitaCreata: Nazionalita[];
  let createCalls: string[];
  let successToasts: string[];
  let errorToasts: unknown[];
  let failure: unknown;

  type Api = {
    nome: { (): string; set(value: string): void };
    cognome: { (): string; set(value: string): void };
    dataNascita: { (): Date | null; set(value: Date | null): void };
    idNazionalita: { (): number | null; set(value: number | null): void };
    opzioniNazionalita(): Nazionalita[];
    creaNazionalita(nome: string): Promise<void>;
    submit(): void;
  };

  const api = () => component as unknown as Api;

  const autore: Autore = {
    id: 1,
    nome: 'Mario',
    cognome: 'Rossi',
    dataNascita: '1980-05-12',
    nazionalita: { id: 3, nome: 'Italia' },
  };

  beforeEach(() => {
    emitted = [];
    nazionalitaCreata = [];
    createCalls = [];
    successToasts = [];
    errorToasts = [];
    failure = null;

    TestBed.configureTestingModule({
      providers: [
        {
          provide: NazionalitaService,
          useValue: {
            create: (nome: string) => {
              createCalls.push(nome);
              return failure ? throwError(() => failure) : of({ id: 42, nome });
            },
          },
        },
        {
          provide: NotificationService,
          useValue: {
            success: (summary: string) => successToasts.push(summary),
            error: () => {},
            errorFrom: (error: unknown) => errorToasts.push(error),
          },
        },
      ],
    });

    fixture = TestBed.createComponent(AutoreDialogComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('visible', false);

    component.save.subscribe((value) => emitted.push(value));
    component.nazionalitaCreata.subscribe((value) => nazionalitaCreata.push(value));
  });

  it('should emit the payload with an ISO date', () => {
    api().nome.set('  Mario ');
    api().cognome.set(' Rossi  ');
    api().dataNascita.set(new Date(1980, 4, 12));
    api().idNazionalita.set(3);

    api().submit();

    expect(emitted).toEqual([
      { nome: 'Mario', cognome: 'Rossi', dataNascita: '1980-05-12', idNazionalita: 3 },
    ]);
  });

  it('should not emit when a required field is missing', () => {
    api().nome.set('Mario');
    api().cognome.set('Rossi');
    api().dataNascita.set(new Date(1980, 4, 12));

    api().submit();

    expect(emitted).toEqual([]);
  });

  it('should prefill the fields when editing an autore', async () => {
    fixture.componentRef.setInput('autore', autore);

    fixture.componentRef.setInput('visible', true);
    await fixture.whenStable();

    expect(api().nome()).toBe('Mario');
    expect(api().cognome()).toBe('Rossi');
    expect(api().dataNascita()).toEqual(new Date(1980, 4, 12));
    expect(api().idNazionalita()).toBe(3);
  });

  it('should clear the fields when creating a new autore', async () => {
    fixture.componentRef.setInput('autore', autore);
    fixture.componentRef.setInput('visible', true);
    await fixture.whenStable();

    fixture.componentRef.setInput('autore', null);
    fixture.componentRef.setInput('visible', false);
    await fixture.whenStable();
    fixture.componentRef.setInput('visible', true);
    await fixture.whenStable();

    expect(api().nome()).toBe('');
    expect(api().cognome()).toBe('');
    expect(api().dataNascita()).toBeNull();
    expect(api().idNazionalita()).toBeNull();
  });

  it('should create a nationality inline, add it to the options and select it', async () => {
    fixture.componentRef.setInput('nazionalita', [{ id: 3, nome: 'Italia' }]);

    await api().creaNazionalita('Portogallo');

    expect(createCalls).toEqual(['Portogallo']);
    expect(api().idNazionalita()).toBe(42);
    expect(api().opzioniNazionalita()).toEqual([
      { id: 3, nome: 'Italia' },
      { id: 42, nome: 'Portogallo' },
    ]);
    expect(nazionalitaCreata).toEqual([{ id: 42, nome: 'Portogallo' }]);
    expect(successToasts).toEqual(['Nazionalità creata']);
  });

  it('should keep the selection untouched when the inline creation fails', async () => {
    failure = new HttpErrorResponse({
      status: 409,
      error: { message: 'Nazionalita con nome Portogallo già esistente' },
    });

    await api().creaNazionalita('Portogallo');

    expect(api().idNazionalita()).toBeNull();
    expect(nazionalitaCreata).toEqual([]);
    expect(errorToasts).toEqual([failure]);
  });
});
