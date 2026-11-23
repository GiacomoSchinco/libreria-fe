import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { firstValueFrom } from 'rxjs';
import { TableModule } from 'primeng/table';
import { Button } from 'primeng/button';
import { Tooltip } from 'primeng/tooltip';

import { CasaEditriceService } from '../../services/casa-editrice';
import { ConfirmDialogService } from '../../services/confirm-dialog';
import { NotificationService } from '../../services/notification';
import { NomeDialogComponent } from '../../components/nome-dialog/nome-dialog';
import { PageHeader } from '../../components/page-header/page-header';
import { EmptyState } from '../../components/empty-state/empty-state';
import { CasaEditrice } from '../../interfaces/casa-editrice';

@Component({
  selector: 'app-case-editrici',
  imports: [TableModule, Button, Tooltip, NomeDialogComponent, PageHeader, EmptyState],
  templateUrl: './case-editrici.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaseEditrici {
  private readonly casaEditriceService = inject(CasaEditriceService);
  private readonly confirmDialog = inject(ConfirmDialogService);
  private readonly notifications = inject(NotificationService);

  protected readonly deleting = signal<number | null>(null);
  protected readonly dialogVisible = signal(false);
  protected readonly saving = signal(false);
  /** Casa editrice in modifica; null quando il dialog ne crea una nuova. */
  protected readonly editing = signal<CasaEditrice | null>(null);

  protected readonly caseEditrici = rxResource({
    stream: () => this.casaEditriceService.getAll(),
  });

  protected readonly subtitle = computed(() => {
    const totale = this.caseEditrici.value()?.length;
    if (totale === undefined) {
      return 'Tutte le case editrici registrate.';
    }
    return totale === 1 ? '1 casa editrice registrata.' : `${totale} case editrici registrate.`;
  });

  protected openCreate(): void {
    this.editing.set(null);
    this.dialogVisible.set(true);
  }

  protected openEdit(casaEditrice: CasaEditrice): void {
    this.editing.set(casaEditrice);
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
        await firstValueFrom(this.casaEditriceService.update(editing.id, nome));
      } else {
        await firstValueFrom(this.casaEditriceService.create(nome));
      }

      this.dialogVisible.set(false);
      this.editing.set(null);
      this.caseEditrici.reload();
      this.notifications.success(
        editing ? 'Casa editrice aggiornata' : 'Casa editrice creata',
        editing ? `"${nome}" è stata salvata.` : `"${nome}" è stata aggiunta.`,
      );
    } catch (error) {
      this.notifications.errorFrom(error, editing ? 'Modifica non riuscita' : 'Creazione non riuscita');
    } finally {
      this.saving.set(false);
    }
  }

  protected async delete(casaEditrice: CasaEditrice): Promise<void> {
    const confirmed = await this.confirmDialog.confirmDelete(
      `la casa editrice "${casaEditrice.nome}"`,
    );
    if (!confirmed) {
      return;
    }

    this.deleting.set(casaEditrice.id);

    try {
      await firstValueFrom(this.casaEditriceService.delete(casaEditrice.id));
      this.caseEditrici.reload();
      this.notifications.success(
        'Casa editrice eliminata',
        `"${casaEditrice.nome}" è stata rimossa.`,
      );
    } catch (error) {
      this.notifications.errorFrom(error, 'Eliminazione non riuscita');
    } finally {
      this.deleting.set(null);
    }
  }
}
