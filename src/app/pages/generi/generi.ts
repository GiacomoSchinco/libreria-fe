import { Component, inject, signal } from '@angular/core';
import { GenereService } from '../../services/genere';
import { rxResource } from '@angular/core/rxjs-interop';
import { firstValueFrom } from 'rxjs';
import { TableModule } from 'primeng/table';
import { Button } from 'primeng/button';

import { ConfirmDialogService } from '../../services/confirm-dialog';
import { NotificationService } from '../../services/notification';
import { Genere } from '../../interfaces/genere';
import { NomeDialogComponent } from '../../components/nome-dialog/nome-dialog';

@Component({
  selector: 'app-generi',
  imports: [TableModule, Button, NomeDialogComponent],
  templateUrl: './generi.html',
  styleUrl: './generi.css',
})
export class Generi {
  private readonly genereService = inject(GenereService);
  private readonly confirmDialog = inject(ConfirmDialogService);
  private readonly notifications = inject(NotificationService);

  protected readonly deleting = signal<number | null>(null);
  protected readonly dialogVisible = signal(false);
  protected readonly saving = signal(false);
  /** Genere in modifica; null quando il dialog crea un nuovo elemento. */
  protected readonly editing = signal<Genere | null>(null);

  protected readonly generi = rxResource({
    stream: () => this.genereService.getAll(),
  });

  protected openCreate(): void {
    this.editing.set(null);
    this.dialogVisible.set(true);
  }

  protected openEdit(genere: Genere): void {
    this.editing.set(genere);
    this.dialogVisible.set(true);
  }

  protected onDialogVisibleChange(visible: boolean): void {
    this.dialogVisible.set(visible);
    if (!visible) {
      this.editing.set(null);
    }
  }

  protected async save(nome: string): Promise<void> {
    const editing = this.editing();
    this.saving.set(true);

    try {
      if (editing) {
        await firstValueFrom(this.genereService.update(editing.id, nome));
      } else {
        await firstValueFrom(this.genereService.create(nome));
      }

      this.dialogVisible.set(false);
      this.editing.set(null);
      this.generi.reload();
      this.notifications.success(
        editing ? 'Genere aggiornato' : 'Genere creato',
        editing ? `"${nome}" è stato salvato.` : `"${nome}" è stato aggiunto.`,
      );
    } catch (error) {
      this.notifications.errorFrom(error, editing ? 'Modifica non riuscita' : 'Creazione non riuscita');
    } finally {
      this.saving.set(false);
    }
  }

  protected async delete(genere: Genere): Promise<void> {
    const confirmed = await this.confirmDialog.confirmDelete(`il genere "${genere.nome}"`);
    if (!confirmed) {
      return;
    }

    this.deleting.set(genere.id);

    try {
      await firstValueFrom(this.genereService.delete(genere.id));
      this.generi.reload();
      this.notifications.success('Genere eliminato', `"${genere.nome}" è stato rimosso.`);
    } catch (error) {
      this.notifications.errorFrom(error, 'Eliminazione non riuscita');
    } finally {
      this.deleting.set(null);
    }
  }
}
