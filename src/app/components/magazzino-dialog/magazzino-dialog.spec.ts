import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { LibroSintesi } from '../../interfaces/libro';
import { Magazzino as MagazzinoModel, MagazzinoRequest } from '../../interfaces/magazzino';
import { LibroService } from '../../services/libro';
import { MagazzinoDialogComponent } from './magazzino-dialog';

describe('MagazzinoDialogComponent', () => {
  let component: MagazzinoDialogComponent;
  let fixture: ComponentFixture<MagazzinoDialogComponent>;
  let emitted: MagazzinoRequest[];
  let searchCalls: string[];
  let risultati: LibroSintesi[];

  type Api = {
    libro: { (): LibroSintesi | null; set(value: LibroSintesi | null): void };
    suggerimenti: { (): LibroSintesi[] };
    quantita: { (): number | null; set(value: number | null): void };
    idCasaEditrice: { (): number | null; set(value: number | null): void };
    cerca(event: { query: string }): void;
    submit(): void;
  };

  const api = () => component as unknown as Api;

  const riga: MagazzinoModel = {
    id: 5,
    quantita: 3,
    casaEditrice: { id: 4, nome: 'Mondadori' },
    libro: {
      id: 10,
      titolo: '1984',
      anno: 1949,
      genere: { id: 1, nome: 'Fantascienza' },
      autori: [],
    },
  };

  beforeEach(() => {
    emitted = [];
    searchCalls = [];
    risultati = [
      { id: 10, titolo: '1984' },
      { id: 25, titolo: '20000 leghe sotto i mari' },
    ];

    TestBed.configureTestingModule({
      providers: [
        {
          provide: LibroService,
          useValue: {
            searchByTitolo: (titolo: string) => {
              searchCalls.push(titolo);
              return of(risultati);
            },
          },
        },
      ],
    });

    fixture = TestBed.createComponent(MagazzinoDialogComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('visible', false);

    component.save.subscribe((value) => emitted.push(value));
  });

  it('should search books from three characters', () => {
    api().cerca({ query: ' 198 ' });

    expect(searchCalls).toEqual(['198']);
    expect(api().suggerimenti()).toEqual(risultati);
  });

  it('should not search below three characters', () => {
    api().cerca({ query: '19' });

    expect(searchCalls).toEqual([]);
    expect(api().suggerimenti()).toEqual([]);
  });

  it('should emit the payload with the selected book and publisher', () => {
    api().libro.set({ id: 10, titolo: '1984' });
    api().quantita.set(4);
    api().idCasaEditrice.set(4);

    api().submit();

    expect(emitted).toEqual([{ idLibro: 10, quantita: 4, idCasaEditrice: 4 }]);
  });

  it('should not emit without a book or with a non positive quantity', () => {
    api().quantita.set(2);
    api().submit();

    api().libro.set({ id: 10, titolo: '1984' });
    api().quantita.set(0);
    api().submit();

    expect(emitted).toEqual([]);
  });

  it('should prefill the fields when editing a row', async () => {
    fixture.componentRef.setInput('riga', riga);
    fixture.componentRef.setInput('visible', true);
    await fixture.whenStable();

    expect(api().libro()).toEqual({ id: 10, titolo: '1984' });
    expect(api().quantita()).toBe(3);
    expect(api().idCasaEditrice()).toBe(4);
  });

  it('should reset the fields when adding after an edit', async () => {
    fixture.componentRef.setInput('riga', riga);
    fixture.componentRef.setInput('visible', true);
    await fixture.whenStable();

    fixture.componentRef.setInput('riga', null);
    fixture.componentRef.setInput('visible', false);
    await fixture.whenStable();
    fixture.componentRef.setInput('visible', true);
    await fixture.whenStable();

    expect(api().libro()).toBeNull();
    expect(api().quantita()).toBe(1);
    expect(api().idCasaEditrice()).toBeNull();
  });
});
