import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { ButtonDirective } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

import { LibroService } from '../../services/libro';

@Component({
  selector: 'app-libri',
  imports: [ButtonDirective, RouterLink, TableModule, TagModule],
  templateUrl: './libri.html',
  styleUrl: './libri.css',
})
export class Libri {
  private readonly libroService = inject(LibroService);

  protected readonly pageIndex = signal(0);
  protected readonly pageSize = signal(10);

  protected readonly libri = rxResource({
    params: () => ({ page: this.pageIndex(), size: this.pageSize() }),
    stream: ({ params }) => this.libroService.getPage(params.page, params.size),
  });

  protected onPage(event: { first: number; rows: number }): void {
    this.pageSize.set(event.rows);
    this.pageIndex.set(Math.floor(event.first / event.rows));
  }
}