import { Component, effect, input, model, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';

/**
 * Dialog riutilizzabile per creare un elemento che ha come unico dato il nome
 * (generi, nazionalità, ...). Non chiama il backend: emette il nome inserito.
 */
@Component({
  selector: 'app-nome-dialog',
  imports: [Dialog, InputText, Button, FormsModule],
  templateUrl: './nome-dialog.html',
  styleUrl: './nome-dialog.css',
})
export class NomeDialogComponent {
  readonly visible = model.required<boolean>();
  readonly header = input('Nuovo elemento');
  readonly label = input('Nome');
  readonly placeholder = input('');
  /** Valore con cui precompilare il campo (per la modifica). */
  readonly value = input('');
  readonly saving = input(false);
  readonly maxLength = input(100);
  readonly save = output<string>();

  protected readonly nome = signal('');

  constructor() {
    effect(() => {
      if (this.visible()) {
        this.nome.set(this.value());
      }
    });
  }

  protected submit(): void {
    const nome = this.nome().trim();
    if (this.saving() || nome.length === 0) {
      return;
    }

    this.save.emit(nome);
  }
}
