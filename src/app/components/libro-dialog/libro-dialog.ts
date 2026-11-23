import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { Chip } from 'primeng/chip';
import { Dialog } from 'primeng/dialog';
import { InputNumber } from 'primeng/inputnumber';
import { InputText } from 'primeng/inputtext';
import { MultiSelect } from 'primeng/multiselect';
import { Select } from 'primeng/select';
import { SelectButton } from 'primeng/selectbutton';

import { Autore, AutoreRequest } from '../../interfaces/autore';
import { Genere } from '../../interfaces/genere';
import { Libro, LibroRequest } from '../../interfaces/libro';
import { Nazionalita } from '../../interfaces/nazionalita';
import { AutoreDialogComponent } from '../autore-dialog/autore-dialog';

type ModoGenere = 'esistente' | 'nuovo';

/**
 * Dialog per inserire un libro. Il genere si sceglie tra quelli esistenti oppure
 * si digita un nome nuovo; gli autori si scelgono tra gli esistenti e/o si creano
 * al volo (il backend riusa quelli con lo stesso nome e cognome).
 */
@Component({
  selector: 'app-libro-dialog',
  imports: [
    Dialog,
    InputText,
    InputNumber,
    Select,
    SelectButton,
    MultiSelect,
    Chip,
    Button,
    FormsModule,
    AutoreDialogComponent,
  ],
  templateUrl: './libro-dialog.html',
  styleUrl: './libro-dialog.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LibroDialogComponent {
  readonly visible = model.required<boolean>();
  /** Libro in modifica; null quando si crea un nuovo libro. */
  readonly libro = input<Libro | null>(null);
  readonly generi = input<Genere[]>([]);
  readonly autori = input<Autore[]>([]);
  readonly nazionalita = input<Nazionalita[]>([]);
  readonly saving = input(false);
  readonly save = output<LibroRequest>();
  /** Gira alla pagina: una nazionalità è stata creata dal sotto-dialog autore. */
  readonly nazionalitaCreata = output<Nazionalita>();

  protected readonly titolo = signal('');
  protected readonly anno = signal<number | null>(null);
  protected readonly modoGenere = signal<ModoGenere>('esistente');
  protected readonly idGenere = signal<number | null>(null);
  protected readonly nomeGenere = signal('');
  protected readonly idAutori = signal<number[]>([]);
  protected readonly nuoviAutori = signal<AutoreRequest[]>([]);
  protected readonly nuovoAutoreVisible = signal(false);

  protected readonly genereModes = [
    { label: 'Esistente', value: 'esistente' },
    { label: 'Nuovo', value: 'nuovo' },
  ];

  protected readonly autoriOptions = computed(() =>
    this.autori().map((autore) => ({
      id: autore.id,
      label: `${autore.nome} ${autore.cognome}`,
    })),
  );

  protected readonly valid = computed(() => this.titolo().trim().length > 0);

  protected readonly header = computed(() =>
    this.libro() ? 'Modifica libro' : 'Nuovo libro',
  );

  constructor() {
    effect(() => {
      if (this.visible()) {
        this.prefill(this.libro());
      }
    });
  }

  protected apriNuovoAutore(): void {
    this.nuovoAutoreVisible.set(true);
  }

  protected aggiungiNuovoAutore(autore: AutoreRequest): void {
    this.nuoviAutori.update((lista) => [...lista, autore]);
    this.nuovoAutoreVisible.set(false);
  }

  protected rimuoviNuovoAutore(index: number): void {
    this.nuoviAutori.update((lista) => lista.filter((_, posizione) => posizione !== index));
  }

  protected submit(): void {
    if (this.saving() || !this.valid()) {
      return;
    }

    const usaGenereEsistente = this.modoGenere() === 'esistente';
    const nomeGenere = this.nomeGenere().trim();

    this.save.emit({
      titolo: this.titolo().trim(),
      anno: this.anno(),
      idGenere: usaGenereEsistente ? this.idGenere() : null,
      nomeGenere: usaGenereEsistente || nomeGenere.length === 0 ? null : nomeGenere,
      idAutori: this.idAutori(),
      nuoviAutori: this.nuoviAutori(),
    });
  }

  private prefill(libro: Libro | null): void {
    this.reset();

    if (!libro) {
      return;
    }

    this.titolo.set(libro.titolo ?? '');
    this.anno.set(libro.anno ?? null);
    this.modoGenere.set('esistente');
    this.idGenere.set(libro.genere?.id ?? null);
    this.idAutori.set((libro.autori ?? []).map((autore) => autore.id));
  }

  private reset(): void {
    this.titolo.set('');
    this.anno.set(null);
    this.modoGenere.set('esistente');
    this.idGenere.set(null);
    this.nomeGenere.set('');
    this.idAutori.set([]);
    this.nuoviAutori.set([]);
    this.nuovoAutoreVisible.set(false);
  }
}
