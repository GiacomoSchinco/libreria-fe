import { Component, inject, signal } from '@angular/core';
import { GenereService } from '../../services/genere';
import { rxResource } from '@angular/core/rxjs-interop';
import { firstValueFrom } from 'rxjs';
import { TableModule } from 'primeng/table';
import { Button } from 'primeng/button';

import { ConfirmDialogService } from '../../services/confirm-dialog';
import { NotificationService } from '../../services/notification';
import { Genere } from '../../interfaces/genere';

@Component({
  selector: 'app-generi',
  imports: [TableModule, Button],
  templateUrl: './generi.html',
  styleUrl: './generi.css',
})
export class Generi {
  private readonly genereService = inject(GenereService);
  private readonly confirmDialog = inject(ConfirmDialogService);
  private readonly notifications = inject(NotificationService);

  protected readonly deleting = signal<number | null>(null);

  protected readonly generi = rxResource({
    stream: () => this.genereService.getAll(),
  });

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
