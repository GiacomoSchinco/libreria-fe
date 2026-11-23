import { Component, inject, signal } from '@angular/core';
import { NazionalitaService } from '../../services/nazionalita';
import { rxResource } from '@angular/core/rxjs-interop';
import { firstValueFrom } from 'rxjs';
import { TableModule } from 'primeng/table';
import { Button } from 'primeng/button';

import { ConfirmDialogService } from '../../services/confirm-dialog';
import { NotificationService } from '../../services/notification';
import { Nazionalita as NazionalitaModel } from '../../interfaces/nazionalita';

@Component({
  selector: 'app-nazionalita',
  imports: [TableModule, Button],
  templateUrl: './nazionalita.html',
  styleUrl: './nazionalita.css',
})
export class Nazionalita {
  private readonly nazionalitaService = inject(NazionalitaService);
  private readonly confirmDialog = inject(ConfirmDialogService);
  private readonly notifications = inject(NotificationService);

  protected readonly deleting = signal<number | null>(null);

  protected readonly nazionalita = rxResource({
    stream: () => this.nazionalitaService.getAll(),
  });

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
