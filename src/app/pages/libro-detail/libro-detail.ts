import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ButtonDirective } from 'primeng/button';
import { CardModule } from 'primeng/card';

import { LibroService } from '../../services/libro';

@Component({
  selector: 'app-libro-detail',
  imports: [ButtonDirective, CardModule, RouterLink],
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
}