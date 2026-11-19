import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Avatar } from 'primeng/avatar';
import { ButtonDirective } from 'primeng/button';
import { Divider } from 'primeng/divider';
import { Message } from 'primeng/message';
import { Skeleton } from 'primeng/skeleton';
import { Tag } from 'primeng/tag';

import { LibroService } from '../../services/libro';

@Component({
  selector: 'app-libro-detail',
  imports: [Avatar, ButtonDirective, DatePipe, Divider, Message, RouterLink, Skeleton, Tag],
  templateUrl: './libro-detail.html',
  styleUrl: './libro-detail.css',
})
export class LibroDetail {
  private readonly libroService = inject(LibroService);
  private readonly libroId = Number(inject(ActivatedRoute).snapshot.paramMap.get('id'));

  protected readonly libro = rxResource({
    params: () => this.libroId,
    stream: ({ params: id }) => this.libroService.getById(id),
  });

  protected initial(text: string | undefined): string {
    return text?.trim().charAt(0).toUpperCase() || '?';
  }
}