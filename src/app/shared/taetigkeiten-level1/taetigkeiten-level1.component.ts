import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-taetigkeiten-level1',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
  ],
  templateUrl: './taetigkeiten-level1.component.html',
  styleUrl: './taetigkeiten-level1.component.scss',
})
export class TaetigkeitenLevel1Component {
  @Input() formGroup!: FormGroup;
  @Input() title: string = '';
  @Input() isEditing: boolean = false;
}
