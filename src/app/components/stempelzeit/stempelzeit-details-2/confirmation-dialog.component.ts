import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-confirmation-dialog',
  template: `
    <div class="confirmation-dialog">
      <div class="dialog-header">
        <h2 class="dialog-title">{{ data.title }}</h2>
      </div>

      <div class="dialog-content">
        <p class="dialog-message">{{ data.message }}</p>

        <div class="dialog-actions">
          <button
            mat-button
            class="cancel-btn"
            (click)="onCancel()">
            {{ data.cancelText }}
          </button>
          <button
            mat-raised-button
            class="confirm-btn"
            (click)="onConfirm()">
            {{ data.confirmText }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .confirmation-dialog {
      min-width: 400px;
      max-width: 500px;
      border-radius: 8px;
      overflow: hidden;
    }

    .dialog-header {
      background: #f5f5f5;
      padding: 20px 24px;
      border-bottom: 1px solid #e0e0e0;
    }

    .dialog-title {
      margin: 0;
      font-size: 18px;
      font-weight: 500;
      color: #333;
    }

    .dialog-content {
      padding: 24px;
    }

    .dialog-message {
      margin: 0 0 24px 0;
      font-size: 14px;
      line-height: 1.5;
      color: #666;
    }

    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }

    .cancel-btn {
      color: #666;
      border: 1px solid #ddd;
      padding: 0 20px;
      min-width: 80px;
    }

    .confirm-btn {
      background-color: #314458;
      color: white;
      padding: 0 20px;
      min-width: 80px;
    }

    // .confirm-btn:hover {
    //   background-color: #c62828;
    // }
  `],
  imports: [CommonModule, MatButtonModule, MatDialogModule]
})
export class ConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      title: string;
      message: string;
      confirmText: string;
      cancelText: string;
    }
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}