import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-pdf-lesen-dialog',
  imports: [
            MatDialogModule,
            MatButtonModule,
            MatIconModule
          ],
  templateUrl: './pdf-lesen-dialog.component.html',
  styleUrl: './pdf-lesen-dialog.component.scss'
})
export class PdfLesenDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<PdfLesenDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close(false); // Return false for "No"
  }

  onYesClick(): void {
    this.dialogRef.close(true); // Return true for "Yes"
  }
}
