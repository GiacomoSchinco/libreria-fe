import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Avatar } from 'primeng/avatar';
import { ButtonDirective } from 'primeng/button';
import { Divider } from 'primeng/divider';
import { Skeleton } from 'primeng/skeleton';
import { Tag } from 'primeng/tag';

import { LibroService } from '../../services/libro';

@Component({
  selector: 'app-libro-detail',
  imports: [Avatar, ButtonDirective, DatePipe, Divider, RouterLink, Skeleton, Tag],
  templateUrl: './libro-detail.html',
  styleUrl: './libro-detail.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LibroDetail {
  private readonly libroService = inject(LibroService);
  private readonly libroId = Number(inject(ActivatedRoute).snapshot.paramMap.get('id'));

  protected readonly libro = rxResource({
    params: () => this.libroId,
    stream: ({ params: id }) => this.libroService.getById(id),
  });

  protected readonly autoriLabel = computed(() => {
    const autori = this.libro.value()?.autori ?? [];
    return autori.length ? autori.map((autore) => `${autore.nome} ${autore.cognome}`).join(' · ') : '—';
  });

  protected initial(text: string | undefined): string {
    return text?.trim().charAt(0).toUpperCase() || '?';
  }
}