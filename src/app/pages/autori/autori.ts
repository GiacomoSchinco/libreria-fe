import { Component, inject, signal } from '@angular/core';
import { AutoreService } from '../../services/autore';
import { NazionalitaService } from '../../services/nazionalita';
import { ConfirmDialogService } from '../../services/confirm-dialog';
import { NotificationService } from '../../services/notification';
import { rxResource } from '@angular/core/rxjs-interop';
import { firstValueFrom } from 'rxjs';
import { TableModule } from 'primeng/table';
import { Button } from 'primeng/button';
import { DatePipe } from '@angular/common';

import { AutoreDialogComponent } from '../../components/autore-dialog/autore-dialog';
import { Autore, AutoreRequest } from '../../interfaces/autore';

@Component({
  selector: 'app-autori',
  imports: [TableModule, Button, DatePipe, AutoreDialogComponent],
  templateUrl: './autori.html',
  styleUrl: './autori.css',
})
export class Autori {
  private readonly autoreService = inject(AutoreService);
  private readonly nazionalitaService = inject(NazionalitaService);
  private readonly confirmDialog = inject(ConfirmDialogService);
  private readonly notifications = inject(NotificationService);

  protected readonly pageIndex = signal(0);
  protected readonly pageSize = signal(10);

  protected readonly dialogVisible = signal(false);
  protected readonly saving = signal(false);
  protected readonly deleting = signal<number | null>(null);
  /** Autore in modifica; null quando il dialog crea un nuovo autore. */
  protected readonly editing = signal<Autore | null>(null);

  protected readonly autori = rxResource({
    params: () => ({ page: this.pageIndex(), size: this.pageSize() }),
    stream: ({ params }) => this.autoreService.getPage(params.page, params.size),
  });

  protected readonly nazionalitaOptions = rxResource({
    stream: () => this.nazionalitaService.getAll(),
  });

  protected onPage(event: { first: number; rows: number }): void {
    this.pageSize.set(event.rows);
    this.pageIndex.set(Math.floor(event.first / event.rows));
  }

  protected openCreate(): void {
    this.editing.set(null);
    this.dialogVisible.set(true);
  }

  protected openEdit(autore: Autore): void {
    this.editing.set(autore);
    this.dialogVisible.set(true);
  }

  protected onDialogVisibleChange(visible: boolean): void {
    this.dialogVisible.set(visible);
    if (!visible) {
      this.editing.set(null);
    }
  }

  /** La lista nazionalità è cambiata (creata al volo dal dialog): ricarico le opzioni. */
  protected onNazionalitaCreata(): void {
    this.nazionalitaOptions.reload();
  }

  protected async save(request: AutoreRequest): Promise<void> {
    const editing = this.editing();
    this.saving.set(true);

    try {
      if (editing) {
        await firstValueFrom(this.autoreService.update(editing.id, request));
      } else {
        await firstValueFrom(this.autoreService.create(request));
      }

      this.dialogVisible.set(false);
      this.editing.set(null);
      this.autori.reload();
      this.notifications.success(
        editing ? 'Autore aggiornato' : 'Autore creato',
        `${request.nome} ${request.cognome} ${editing ? 'è stato salvato.' : 'è stato aggiunto.'}`,
      );
    } catch (error) {
      this.notifications.errorFrom(error, editing ? 'Modifica non riuscita' : 'Creazione non riuscita');
    } finally {
      this.saving.set(false);
    }
  }

  protected async delete(autore: Autore): Promise<void> {
    const confirmed = await this.confirmDialog.confirmDelete(
      `l'autore "${autore.nome} ${autore.cognome}"`,
    );
    if (!confirmed) {
      return;
    }

    this.deleting.set(autore.id);

    try {
      await firstValueFrom(this.autoreService.delete(autore.id));
      this.autori.reload();
      this.notifications.success(
        'Autore eliminato',
        `${autore.nome} ${autore.cognome} è stato rimosso.`,
      );
    } catch (error) {
      this.notifications.errorFrom(error, 'Eliminazione non riuscita');
    } finally {
      this.deleting.set(null);
    }
  }
}
