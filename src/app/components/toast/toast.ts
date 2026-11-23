import { Component } from '@angular/core';
import { Toast } from 'primeng/toast';

/**
 * Unico host dei toast, montato nel root.
 * L'API per mostrarli è NotificationService.
 */
@Component({
  selector: 'app-toast',
  imports: [Toast],
  templateUrl: './toast.html',
  styleUrl: './toast.css',
})
export class ToastComponent {}
