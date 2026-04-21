import {Component, inject, Inject} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-info-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './info-dialog.component.html',
  styleUrl: './info-dialog.component.scss'
})
export class InfoDialogComponent {
  data = inject(MAT_DIALOG_DATA);  // ← use inject() instead of constructor
  constructor( ) {
    console.log('InfoDialogComponent data:', this.data);  // ← add this
  }
}
