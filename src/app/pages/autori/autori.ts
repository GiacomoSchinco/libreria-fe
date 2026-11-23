import { Component, inject, signal } from '@angular/core';
import { AutoreService } from '../../services/autore';
import { rxResource } from '@angular/core/rxjs-interop';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-autori',
  imports: [TableModule],
  templateUrl: './autori.html',
  styleUrl: './autori.css',
})
export class Autori {
  private readonly autoreService = inject(AutoreService);
  protected readonly pageIndex = signal(0);
  protected readonly pageSize = signal(10);
  protected readonly autori = rxResource({
    params: () => ({ page: this.pageIndex(), size: this.pageSize() }),
    stream: ({ params }) => this.autoreService.getPage(params.page, params.size),
  });
    protected onPage(event: { first: number; rows: number }): void {
    this.pageSize.set(event.rows);
    this.pageIndex.set(Math.floor(event.first / event.rows));
  }
}
