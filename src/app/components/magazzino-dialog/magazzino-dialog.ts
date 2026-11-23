import { Component, computed, effect, inject, input, model, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { AutoComplete } from 'primeng/autocomplete';
import { Dialog } from 'primeng/dialog';
import { InputNumber } from 'primeng/inputnumber';
import { Select } from 'primeng/select';

import { CasaEditrice } from '../../interfaces/casa-editrice';
import { LibroSintesi } from '../../interfaces/libro';
import { Magazzino, MagazzinoRequest } from '../../interfaces/magazzino';
import { LibroService } from '../../services/libro';

/** Il backend rifiuta ricerche più corte (BadRequestException). */
const MIN_RICERCA = 3;

/**
 * Dialog per aggiungere un libro al magazzino o modificarne la riga.
 * Il libro si cerca per titolo tramite l'endpoint di autocomplete.
 */
@Component({
  selector: 'app-magazzino-dialog',
  imports: [Dialog, AutoComplete, Select, InputNumber, Button, FormsModule],
  templateUrl: './magazzino-dialog.html',
  styleUrl: './magazzino-dialog.css',
})
export class MagazzinoDialogComponent {
  private readonly libroService = inject(LibroService);

  readonly visible = model.required<boolean>();
  /** Riga in modifica; null quando si aggiunge un nuovo libro. */
  readonly riga = input<Magazzino | null>(null);
  readonly caseEditrici = input<CasaEditrice[]>([]);
  readonly saving = input(false);
  readonly save = output<MagazzinoRequest>();

  protected readonly minRicerca = MIN_RICERCA;
  protected readonly libro = signal<LibroSintesi | null>(null);
  protected readonly suggerimenti = signal<LibroSintesi[]>([]);
  protected readonly quantita = signal<number | null>(1);
  protected readonly idCasaEditrice = signal<number | null>(null);

  private ultimaQuery = '';

  protected readonly header = computed(() =>
    this.riga() ? 'Modifica magazzino' : 'Aggiungi al magazzino',
  );

  protected readonly valid = computed(
    () => this.libro() !== null && (this.quantita() ?? 0) > 0,
  );

  constructor() {
    effect(() => {
      if (this.visible()) {
        this.prefill(this.riga());
      }
    });
  }

  protected cerca(event: { query: string }): void {
    const query = event.query.trim();
    this.ultimaQuery = query;

    if (query.length < MIN_RICERCA) {
      this.suggerimenti.set([]);
      return;
    }

    this.libroService.searchByTitolo(query).subscribe({
      next: (libri) => {
        if (this.ultimaQuery === query) {
          this.suggerimenti.set(libri);
        }
      },
      error: () => {
        if (this.ultimaQuery === query) {
          this.suggerimenti.set([]);
        }
      },
    });
  }

  protected submit(): void {
    const libro = this.libro();
    if (this.saving() || !this.valid() || libro === null) {
      return;
    }

    this.save.emit({
      idLibro: libro.id,
      quantita: this.quantita(),
      idCasaEditrice: this.idCasaEditrice(),
    });
  }

  private prefill(riga: Magazzino | null): void {
    this.libro.set(riga ? { id: riga.libro.id, titolo: riga.libro.titolo } : null);
    this.suggerimenti.set([]);
    this.ultimaQuery = '';
    this.quantita.set(riga?.quantita ?? 1);
    this.idCasaEditrice.set(riga?.casaEditrice?.id ?? null);
  }
}
