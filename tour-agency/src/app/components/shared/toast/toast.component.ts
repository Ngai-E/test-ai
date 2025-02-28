import { Component, OnInit, OnDestroy } from '@angular/core';
import { ToastService } from '../../../services/toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toast',
  template: `
    <div *ngIf="toast" class="toast-container" [ngClass]="toast?.type || ''">
      <div class="toast-message">{{ toast?.message }}</div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 25px;
      border-radius: 4px;
      color: white;
      z-index: 1000;
      animation: slideIn 0.3s ease-in-out;
    }

    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    .success {
      background-color: #4caf50;
    }

    .error {
      background-color: #f44336;
    }

    .info {
      background-color: #2196f3;
    }

    .warning {
      background-color: #ff9800;
    }

    .toast-message {
      font-size: 16px;
      margin: 0;
    }
  `]
})
export class ToastComponent implements OnInit, OnDestroy {
  toast: { type: string, message: string } | null = null;
  private toastSubscription?: Subscription;

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    this.toastSubscription = this.toastService.toast$.subscribe(toast => {
      this.toast = toast;
      if (toast) {
        setTimeout(() => {
          this.toast = null;
        }, 3000);
      }
    });
  }

  ngOnDestroy() {
    if (this.toastSubscription) {
      this.toastSubscription.unsubscribe();
    }
  }
}
