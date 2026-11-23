import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonDirective } from 'primeng/button';

@Component({
  selector: 'app-home',
  imports: [RouterLink, ButtonDirective],
  templateUrl: './home.html',
  styleUrl: './home.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  protected readonly features = [
    {
      icon: 'pi pi-book',
      title: 'Catalogo',
      text: 'Schede libro complete con genere, anno e autori collegati.',
    },
    {
      icon: 'pi pi-box',
      title: 'Magazzino',
      text: 'Giacenze per titolo e casa editrice, sempre aggiornate.',
    },
    {
      icon: 'pi pi-users',
      title: 'Anagrafiche',
      text: 'Autori, generi, nazionalità e case editrici in un unico posto.',
    },
  ];
}