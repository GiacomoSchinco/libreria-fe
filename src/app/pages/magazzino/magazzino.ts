import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { firstValueFrom } from 'rxjs';
import { Button } from 'primeng/button';
import { TableModule } from 'primeng/table';

import { MagazzinoService } from '../../services/magazzino';
import { CasaEditriceService } from '../../services/casa-editrice';
import { ConfirmDialogService } from '../../services/confirm-dialog';
import { NotificationService } from '../../services/notification';
import { MagazzinoDialogComponent } from '../../components/magazzino-dialog/magazzino-dialog';
import { Magazzino as MagazzinoModel, MagazzinoRequest } from '../../interfaces/magazzino';

@Component({
  selector: 'app-magazzino',
  imports: [Button, TableModule, MagazzinoDialogComponent],
  templateUrl: './magazzino.html',
  styleUrl: './magazzino.css',
})
export class Magazzino {
  private readonly magazzinoService = inject(MagazzinoService);
  private readonly casaEditriceService = inject(CasaEditriceService);
  private readonly confirmDialog = inject(ConfirmDialogService);
  private readonly notifications = inject(NotificationService);

  protected readonly pageIndex = signal(0);
  protected readonly pageSize = signal(10);

  protected readonly dialogVisible = signal(false);
  protected readonly saving = signal(false);
  protected readonly deleting = signal<number | null>(null);
  /** Riga in modifica; null quando si aggiunge un libro al magazzino. */
  protected readonly editing = signal<MagazzinoModel | null>(null);

  protected readonly magazzino = rxResource({
    params: () => ({ page: this.pageIndex(), size: this.pageSize() }),
    stream: ({ params }) => this.magazzinoService.getPage(params.page, params.size),
  });

  protected readonly caseEditriciOptions = rxResource({
    stream: () => this.casaEditriceService.getAll(),
  });

  protected onPage(event: { first: number; rows: number }): void {
    this.pageSize.set(event.rows);
    this.pageIndex.set(Math.floor(event.first / event.rows));
  }

  protected openCreate(): void {
    this.editing.set(null);
    this.dialogVisible.set(true);
  }

  protected openEdit(riga: MagazzinoModel): void {
    this.editing.set(riga);
    this.dialogVisible.set(true);
  }

  protected onDialogVisibleChange(visible: boolean): void {
    this.dialogVisible.set(visible);
    if (!visible) {
      this.editing.set(null);
    }
  }

  protected async save(request: MagazzinoRequest): Promise<void> {
    const editing = this.editing();
    this.saving.set(true);

    try {
      if (editing) {
        await firstValueFrom(this.magazzinoService.update(editing.id, request));
      } else {
        await firstValueFrom(this.magazzinoService.create(request));
      }

      this.dialogVisible.set(false);
      this.editing.set(null);
      this.magazzino.reload();
      this.notifications.success(
        editing ? 'Magazzino aggiornato' : 'Libro aggiunto al magazzino',
        editing ? 'La riga è stata salvata.' : 'La riga è stata creata.',
      );
    } catch (error) {
      this.notifications.errorFrom(error, editing ? 'Modifica non riuscita' : 'Creazione non riuscita');
    } finally {
      this.saving.set(false);
    }
  }

  protected async delete(riga: MagazzinoModel): Promise<void> {
    const confirmed = await this.confirmDialog.confirmDelete(
      `la riga di magazzino del libro "${riga.libro.titolo}"`,
    );
    if (!confirmed) {
      return;
    }

    this.deleting.set(riga.id);

    try {
      await firstValueFrom(this.magazzinoService.delete(riga.id));
      this.magazzino.reload();
      this.notifications.success(
        'Riga eliminata',
        `"${riga.libro.titolo}" è stato rimosso dal magazzino.`,
      );
    } catch (error) {
      this.notifications.errorFrom(error, 'Eliminazione non riuscita');
    } finally {
      this.deleting.set(null);
    }
  }
}
