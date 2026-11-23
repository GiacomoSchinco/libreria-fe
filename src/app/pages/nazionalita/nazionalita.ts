import { Component, inject, signal } from '@angular/core';
import { NazionalitaService } from '../../services/nazionalita';
import { rxResource } from '@angular/core/rxjs-interop';
import { firstValueFrom } from 'rxjs';
import { TableModule } from 'primeng/table';
import { Button } from 'primeng/button';

import { ConfirmDialogService } from '../../services/confirm-dialog';
import { NotificationService } from '../../services/notification';
import { Nazionalita as NazionalitaModel } from '../../interfaces/nazionalita';
import { NomeDialogComponent } from '../../components/nome-dialog/nome-dialog';

@Component({
  selector: 'app-nazionalita',
  imports: [TableModule, Button, NomeDialogComponent],
  templateUrl: './nazionalita.html',
  styleUrl: './nazionalita.css',
})
export class Nazionalita {
  private readonly nazionalitaService = inject(NazionalitaService);
  private readonly confirmDialog = inject(ConfirmDialogService);
  private readonly notifications = inject(NotificationService);

  protected readonly deleting = signal<number | null>(null);
  protected readonly dialogVisible = signal(false);
  protected readonly saving = signal(false);
  /** Nazionalità in modifica; null quando il dialog crea un nuovo elemento. */
  protected readonly editing = signal<NazionalitaModel | null>(null);

  protected readonly nazionalita = rxResource({
    stream: () => this.nazionalitaService.getAll(),
  });

  protected openCreate(): void {
    this.editing.set(null);
    this.dialogVisible.set(true);
  }

  protected openEdit(nazionalita: NazionalitaModel): void {
    this.editing.set(nazionalita);
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
        await firstValueFrom(this.nazionalitaService.update(editing.id, nome));
      } else {
        await firstValueFrom(this.nazionalitaService.create(nome));
      }

      this.dialogVisible.set(false);
      this.editing.set(null);
      this.nazionalita.reload();
      this.notifications.success(
        editing ? 'Nazionalità aggiornata' : 'Nazionalità creata',
        editing ? `"${nome}" è stata salvata.` : `"${nome}" è stata aggiunta.`,
      );
    } catch (error) {
      this.notifications.errorFrom(error, editing ? 'Modifica non riuscita' : 'Creazione non riuscita');
    } finally {
      this.saving.set(false);
    }
  }

  protected async delete(nazionalita: NazionalitaModel): Promise<void> {
    const confirmed = await this.confirmDialog.confirmDelete(
      `la nazionalità "${nazionalita.nome}"`,
    );
    if (!confirmed) {
      return;
    }

    this.deleting.set(nazionalita.id);

    try {
      await firstValueFrom(this.nazionalitaService.delete(nazionalita.id));
      this.nazionalita.reload();
      this.notifications.success('Nazionalità eliminata', `"${nazionalita.nome}" è stata rimossa.`);
    } catch (error) {
      this.notifications.errorFrom(error, 'Eliminazione non riuscita');
    } finally {
      this.deleting.set(null);
    }
  }
}
