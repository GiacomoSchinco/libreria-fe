import { Component, inject, signal } from '@angular/core';
import { MagazzinoService } from '../../services/magazzino';
import { rxResource } from '@angular/core/rxjs-interop';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-magazzino',
  imports: [TableModule],
  templateUrl: './magazzino.html',
  styleUrl: './magazzino.css',
})
export class Magazzino {
  private readonly magazzinoService = inject(MagazzinoService);

  protected readonly pageIndex = signal(0);
  protected readonly pageSize = signal(10);

  protected readonly magazzino = rxResource({
    params: () => ({ page: this.pageIndex(), size: this.pageSize() }),
    stream: ({ params }) => this.magazzinoService.getPage(params.page, params.size),
  });

  protected onPage(event: { first: number; rows: number }): void {
    this.pageSize.set(event.rows);
    this.pageIndex.set(Math.floor(event.first / event.rows));
  }
}
