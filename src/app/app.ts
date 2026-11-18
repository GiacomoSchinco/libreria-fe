import { Component, computed, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SearchIcon } from 'primeng/icons/search';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';

interface Book {
  readonly id: number;
  readonly title: string;
  readonly author: string;
  readonly genre: string;
  readonly year: number;
  readonly available: boolean;
}

const CATALOGUE: readonly Book[] = [
  { id: 1, title: 'Il nome della rosa', author: 'Umberto Eco', genre: 'Romanzo', year: 1980, available: true },
  { id: 2, title: 'Se una notte d’inverno un viaggiatore', author: 'Italo Calvino', genre: 'Romanzo', year: 1979, available: false },
  { id: 3, title: 'La coscienza di Zeno', author: 'Italo Svevo', genre: 'Classico', year: 1923, available: true },
  { id: 4, title: 'Il gattopardo', author: 'Giuseppe Tomasi di Lampedusa', genre: 'Storico', year: 1958, available: true },
  { id: 5, title: 'Le città invisibili', author: 'Italo Calvino', genre: 'Narrativa', year: 1972, available: false },
  { id: 6, title: 'Uno, nessuno e centomila', author: 'Luigi Pirandello', genre: 'Classico', year: 1926, available: true },
  { id: 7, title: 'Se questo è un uomo', author: 'Primo Levi', genre: 'Memoir', year: 1947, available: false },
  { id: 8, title: 'Il barone rampante', author: 'Italo Calvino', genre: 'Narrativa', year: 1957, available: true },
];

@Component({
  selector: 'app-root',
  imports: [
    ButtonModule,
    CardModule,
    DividerModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    SearchIcon,
    TableModule,
    TagModule,
    ToolbarModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly appName = signal('Libreria');
  protected readonly query = signal('');
  protected readonly onlyAvailable = signal(false);
  protected readonly books = signal<readonly Book[]>(CATALOGUE);

  protected readonly visibleBooks = computed(() => {
    const term = this.query().trim().toLowerCase();
    const onlyAvailable = this.onlyAvailable();

    return this.books().filter((book) => {
      if (onlyAvailable && !book.available) {
        return false;
      }

      if (!term) {
        return true;
      }

      return `${book.title} ${book.author} ${book.genre}`.toLowerCase().includes(term);
    });
  });

  protected readonly availableCount = computed(() => this.books().filter((book) => book.available).length);

  protected onSearch(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  protected toggleAvailability(book: Book): void {
    this.books.update((books) =>
      books.map((current) => (current.id === book.id ? { ...current, available: !current.available } : current)),
    );
  }
}
