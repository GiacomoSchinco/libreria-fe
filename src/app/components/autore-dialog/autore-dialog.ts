import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { Button } from 'primeng/button';
import { DatePicker } from 'primeng/datepicker';
import { Dialog } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';

import { Autore, AutoreRequest } from '../../interfaces/autore';
import { Nazionalita } from '../../interfaces/nazionalita';
import { NazionalitaService } from '../../services/nazionalita';
import { NotificationService } from '../../services/notification';
import { NomeDialogComponent } from '../nome-dialog/nome-dialog';

/**
 * Dialog per creare o modificare un autore. Emette il payload pronto per
 * POST/PUT /api/autori; consente anche di creare al volo una nazionalità.
 */
@Component({
  selector: 'app-autore-dialog',
  imports: [Dialog, InputText, Select, DatePicker, Button, FormsModule, NomeDialogComponent],
  templateUrl: './autore-dialog.html',
  styleUrl: './autore-dialog.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutoreDialogComponent {
  private readonly nazionalitaService = inject(NazionalitaService);
  private readonly notifications = inject(NotificationService);

  readonly visible = model.required<boolean>();
  readonly autore = input<Autore | null>(null);
  readonly nazionalita = input<Nazionalita[]>([]);
  readonly saving = input(false);
  readonly save = output<AutoreRequest>();
  /** Notifica la nazionalità creata al volo, così la pagina aggiorna la sua lista. */
  readonly nazionalitaCreata = output<Nazionalita>();

  protected readonly today = new Date();
  protected readonly nome = signal('');
  protected readonly cognome = signal('');
  protected readonly dataNascita = signal<Date | null>(null);
  protected readonly idNazionalita = signal<number | null>(null);

  protected readonly creandoNazionalita = signal(false);
  protected readonly salvandoNazionalita = signal(false);
  private readonly nazionalitaAggiunte = signal<Nazionalita[]>([]);

  protected readonly header = computed(() =>
    this.autore() ? 'Modifica autore' : 'Nuovo autore',
  );

  /** Unisce le nazionalità della pagina con quelle create al volo, senza duplicati. */
  protected readonly opzioniNazionalita = computed(() => {
    const aggiunte = this.nazionalitaAggiunte();
    const ids = new Set(aggiunte.map((item) => item.id));

    return [...this.nazionalita().filter((item) => !ids.has(item.id)), ...aggiunte];
  });

  protected readonly valid = computed(
    () =>
      this.nome().trim().length > 0 &&
      this.cognome().trim().length > 0 &&
      this.dataNascita() !== null &&
      this.idNazionalita() !== null,
  );

  constructor() {
    effect(() => {
      if (!this.visible()) {
        return;
      }

      const autore = this.autore();
      this.nome.set(autore?.nome ?? '');
      this.cognome.set(autore?.cognome ?? '');
      this.dataNascita.set(toDate(autore?.dataNascita));
      this.idNazionalita.set(autore?.nazionalita.id ?? null);
    });
  }

  protected onVisibleChange(visible: boolean): void {
    this.visible.set(visible);
    if (!visible) {
      this.nazionalitaAggiunte.set([]);
    }
  }

  protected apriNuovaNazionalita(): void {
    this.creandoNazionalita.set(true);
  }

  protected async creaNazionalita(nome: string): Promise<void> {
    this.salvandoNazionalita.set(true);

    try {
      const creata = await firstValueFrom(this.nazionalitaService.create(nome));
      this.nazionalitaAggiunte.update((lista) => [...lista, creata]);
      this.idNazionalita.set(creata.id);
      this.creandoNazionalita.set(false);
      this.nazionalitaCreata.emit(creata);
      this.notifications.success('Nazionalità creata', `"${nome}" è stata aggiunta.`);
    } catch (error) {
      this.notifications.errorFrom(error, 'Creazione non riuscita');
    } finally {
      this.salvandoNazionalita.set(false);
    }
  }

  protected submit(): void {
    const dataNascita = this.dataNascita();
    const idNazionalita = this.idNazionalita();
    if (this.saving() || !this.valid() || !dataNascita || idNazionalita === null) {
      return;
    }

    this.save.emit({
      nome: this.nome().trim(),
      cognome: this.cognome().trim(),
      dataNascita: toIsoDate(dataNascita),
      idNazionalita,
    });
  }
}

/** "yyyy-MM-dd" → Date locale (mezzanotte), senza shift di fuso orario. */
function toDate(iso: string | undefined): Date | null {
  if (!iso) {
    return null;
  }

  const [year, month, day] = iso.split('-').map(Number);
  return year && month && day ? new Date(year, month - 1, day) : null;
}

/** Date locale → "yyyy-MM-dd", il formato atteso dal backend (LocalDate). */
function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}
