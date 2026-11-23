import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { AutoreRequest } from '../../interfaces/autore';
import { Libro, LibroRequest } from '../../interfaces/libro';
import { NazionalitaService } from '../../services/nazionalita';
import { NotificationService } from '../../services/notification';
import { LibroDialogComponent } from './libro-dialog';

describe('LibroDialogComponent', () => {
  let component: LibroDialogComponent;
  let fixture: ComponentFixture<LibroDialogComponent>;
  let emitted: LibroRequest[];

  type Api = {
    titolo: { (): string; set(value: string): void };
    anno: { (): number | null; set(value: number | null): void };
    modoGenere: { (): 'esistente' | 'nuovo'; set(value: 'esistente' | 'nuovo'): void };
    idGenere: { (): number | null; set(value: number | null): void };
    nomeGenere: { (): string; set(value: string): void };
    idAutori: { (): number[]; set(value: number[]): void };
    nuoviAutori: { (): AutoreRequest[]; set(value: AutoreRequest[]): void };
    aggiungiNuovoAutore(autore: AutoreRequest): void;
    rimuoviNuovoAutore(index: number): void;
    submit(): void;
  };

  const api = () => component as unknown as Api;

  const nuovoAutore: AutoreRequest = {
    nome: 'Mario',
    cognome: 'Rossi',
    dataNascita: '1980-05-12',
    idNazionalita: 3,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: NazionalitaService,
          useValue: { create: (nome: string) => of({ id: 7, nome }) },
        },
        {
          provide: NotificationService,
          useValue: { success: () => {}, error: () => {}, errorFrom: () => {} },
        },
      ],
    });

    fixture = TestBed.createComponent(LibroDialogComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('visible', false);

    emitted = [];
    component.save.subscribe((value) => emitted.push(value));
  });

  const autore = (id: number, nome: string, cognome: string) => ({
    id,
    nome,
    cognome,
    dataNascita: '1980-05-12',
    nazionalita: { id: 3, nome: 'Italia' },
  });

  const libro: Libro = {
    id: 9,
    titolo: 'Dune',
    anno: 1965,
    genere: { id: 2, nome: 'Fantascienza' },
    autori: [autore(1, 'Frank', 'Herbert'), autore(4, 'Anna', 'Bianchi')],
  };

  it('should emit the payload for an existing genre and selected authors', () => {
    api().titolo.set('  Dune  ');
    api().anno.set(1965);
    api().modoGenere.set('esistente');
    api().idGenere.set(2);
    api().idAutori.set([1, 4]);

    api().submit();

    expect(emitted).toEqual([
      {
        titolo: 'Dune',
        anno: 1965,
        idGenere: 2,
        nomeGenere: null,
        idAutori: [1, 4],
        nuoviAutori: [],
      },
    ]);
  });

  it('should send nomeGenere (and no idGenere) when the genre is new', () => {
    api().titolo.set('Dune');
    api().modoGenere.set('nuovo');
    api().nomeGenere.set('  Distopia  ');

    api().submit();

    expect(emitted[0].idGenere).toBeNull();
    expect(emitted[0].nomeGenere).toBe('Distopia');
  });

  it('should send no genre when the new genre name is blank', () => {
    api().titolo.set('Dune');
    api().modoGenere.set('nuovo');
    api().nomeGenere.set('   ');

    api().submit();

    expect(emitted[0].idGenere).toBeNull();
    expect(emitted[0].nomeGenere).toBeNull();
  });

  it('should include newly created authors and allow removing them', () => {
    api().titolo.set('Dune');
    api().aggiungiNuovoAutore(nuovoAutore);
    api().aggiungiNuovoAutore({ ...nuovoAutore, nome: 'Anna' });
    api().rimuoviNuovoAutore(0);

    api().submit();

    expect(emitted[0].nuoviAutori).toEqual([{ ...nuovoAutore, nome: 'Anna' }]);
  });

  it('should not emit when the title is missing', () => {
    api().titolo.set('   ');

    api().submit();

    expect(emitted).toEqual([]);
  });

  it('should prefill the fields when editing a libro', async () => {
    fixture.componentRef.setInput('libro', libro);
    fixture.componentRef.setInput('visible', true);
    await fixture.whenStable();

    expect(api().titolo()).toBe('Dune');
    expect(api().anno()).toBe(1965);
    expect(api().modoGenere()).toBe('esistente');
    expect(api().idGenere()).toBe(2);
    expect(api().idAutori()).toEqual([1, 4]);
    expect(api().nuoviAutori()).toEqual([]);
  });

  it('should reset the fields when creating after an edit', async () => {
    fixture.componentRef.setInput('libro', libro);
    fixture.componentRef.setInput('visible', true);
    await fixture.whenStable();

    fixture.componentRef.setInput('libro', null);
    fixture.componentRef.setInput('visible', false);
    await fixture.whenStable();
    fixture.componentRef.setInput('visible', true);
    await fixture.whenStable();

    expect(api().titolo()).toBe('');
    expect(api().anno()).toBeNull();
    expect(api().idGenere()).toBeNull();
    expect(api().idAutori()).toEqual([]);
  });
});
