import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { firstValueFrom, map } from 'rxjs';
import { Button, ButtonDirective } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

import { LibroService } from '../../services/libro';
import { GenereService } from '../../services/genere';
import { AutoreService } from '../../services/autore';
import { NazionalitaService } from '../../services/nazionalita';
import { NotificationService } from '../../services/notification';
import { LibroDialogComponent } from '../../components/libro-dialog/libro-dialog';
import { Libro, LibroRequest } from '../../interfaces/libro';

@Component({
  selector: 'app-libri',
  imports: [Button, ButtonDirective, RouterLink, TableModule, TagModule, LibroDialogComponent],
  templateUrl: './libri.html',
  styleUrl: './libri.css',
})
export class Libri {
  private readonly libroService = inject(LibroService);
  private readonly genereService = inject(GenereService);
  private readonly autoreService = inject(AutoreService);
  private readonly nazionalitaService = inject(NazionalitaService);
  private readonly notifications = inject(NotificationService);

  protected readonly pageIndex = signal(0);
  protected readonly pageSize = signal(10);

  protected readonly dialogVisible = signal(false);
  protected readonly saving = signal(false);
  /** Libro in modifica; null quando il dialog crea un nuovo libro. */
  protected readonly editing = signal<Libro | null>(null);

  protected readonly libri = rxResource({
    params: () => ({ page: this.pageIndex(), size: this.pageSize() }),
    stream: ({ params }) => this.libroService.getPage(params.page, params.size),
  });

  protected readonly generiOptions = rxResource({
    stream: () => this.genereService.getAll(),
  });

  /** Gli autori non hanno un endpoint "tutti": ne chiedo una pagina ampia per la select. */
  protected readonly autoriOptions = rxResource({
    stream: () => this.autoreService.getPage(0, 500).pipe(map((page) => page.content)),
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

  protected openEdit(libro: Libro): void {
    this.editing.set(libro);
    this.dialogVisible.set(true);
  }

  protected onDialogVisibleChange(visible: boolean): void {
    this.dialogVisible.set(visible);
    if (!visible) {
      this.editing.set(null);
    }
  }

  protected onNazionalitaCreata(): void {
    this.nazionalitaOptions.reload();
  }

  protected async save(request: LibroRequest): Promise<void> {
    const editing = this.editing();
    this.saving.set(true);

    try {
      if (editing) {
        await firstValueFrom(this.libroService.update(editing.id, request));
      } else {
        await firstValueFrom(this.libroService.create(request));
      }

      this.dialogVisible.set(false);
      this.editing.set(null);
      this.libri.reload();
      this.notifications.success(
        editing ? 'Libro aggiornato' : 'Libro creato',
        editing
          ? `"${request.titolo}" è stato salvato.`
          : `"${request.titolo}" è stato aggiunto al catalogo.`,
      );
    } catch (error) {
      this.notifications.errorFrom(error, editing ? 'Modifica non riuscita' : 'Creazione non riuscita');
    } finally {
      this.saving.set(false);
    }
  }
}
