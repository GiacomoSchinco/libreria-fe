import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom, map, of } from 'rxjs';
import { AutoComplete, AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { Button, ButtonDirective } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { Tooltip } from 'primeng/tooltip';

import { LibroService } from '../../services/libro';
import { GenereService } from '../../services/genere';
import { AutoreService } from '../../services/autore';
import { NazionalitaService } from '../../services/nazionalita';
import { NotificationService } from '../../services/notification';
import { LibroDialogComponent } from '../../components/libro-dialog/libro-dialog';
import { PageHeader } from '../../components/page-header/page-header';
import { EmptyState } from '../../components/empty-state/empty-state';
import { Libro, LibroRequest, LibroSintesi } from '../../interfaces/libro';

@Component({
  selector: 'app-libri',
  imports: [
    AutoComplete,
    Button,
    ButtonDirective,
    RouterLink,
    TableModule,
    TagModule,
    Tooltip,
    LibroDialogComponent,
    PageHeader,
    EmptyState,
  ],
  templateUrl: './libri.html',
  styleUrl: './libri.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Libri {
  private readonly libroService = inject(LibroService);
  private readonly genereService = inject(GenereService);
  private readonly autoreService = inject(AutoreService);
  private readonly nazionalitaService = inject(NazionalitaService);
  private readonly notifications = inject(NotificationService);
  private readonly router = inject(Router);

  protected readonly pageIndex = signal(0);
  protected readonly pageSize = signal(10);

  protected readonly dialogVisible = signal(false);
  protected readonly saving = signal(false);
  /** Libro in modifica; null quando il dialog crea un nuovo libro. */
  protected readonly editing = signal<Libro | null>(null);

  protected readonly suggerimenti = signal<LibroSintesi[]>([]);

  protected readonly libri = rxResource({
    params: () => ({ page: this.pageIndex(), size: this.pageSize() }),
    stream: ({ params }) => this.libroService.getPage(params.page, params.size),
  });

  protected readonly subtitle = computed(() => {
    const total = this.libri.value()?.page?.totalElements;
    if (total === undefined) {
      return 'Tutti i volumi del catalogo.';
    }
    return total === 1 ? '1 volume in catalogo.' : `${total} volumi in catalogo.`;
  });

  /* Le liste per i select del dialog servono solo quando il dialog è aperto. */
  protected readonly generiOptions = rxResource({
    params: () => this.dialogVisible(),
    stream: ({ params: open }) => (open ? this.genereService.getAll() : of([])),
  });

  /** Gli autori non hanno un endpoint "tutti": ne chiedo una pagina ampia per la select. */
  protected readonly autoriOptions = rxResource({
    params: () => this.dialogVisible(),
    stream: ({ params: open }) =>
      open ? this.autoreService.getPage(0, 500).pipe(map((page) => page.content)) : of([]),
  });

  protected readonly nazionalitaOptions = rxResource({
    params: () => this.dialogVisible(),
    stream: ({ params: open }) => (open ? this.nazionalitaService.getAll() : of([])),
  });

  protected initial(text: string | undefined): string {
    return text?.trim().charAt(0).toUpperCase() || '?';
  }

  protected autoriLabel(libro: Libro): string {
    return libro.autori.map((autore) => `${autore.nome} ${autore.cognome}`).join(', ');
  }

  protected cerca(event: AutoCompleteCompleteEvent): void {
    const query = event.query.trim();
    if (query.length < 3) {
      this.suggerimenti.set([]);
      return;
    }

    this.libroService.searchByTitolo(query).subscribe({
      next: (risultati) => this.suggerimenti.set(risultati),
      error: () => this.suggerimenti.set([]),
    });
  }

  protected apriLibro(libro: LibroSintesi): void {
    void this.router.navigate(['/libri', libro.id]);
  }

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
