import { Component } from '@angular/core';
import { ConfirmDialog } from 'primeng/confirmdialog';

/**
 * Unico host del dialog di conferma, montato nel root.
 * L'API per aprirlo è ConfirmDialogService.
 */
@Component({
  selector: 'app-confirm-dialog',
  imports: [ConfirmDialog],
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.css',
})
export class ConfirmDialogComponent {}
