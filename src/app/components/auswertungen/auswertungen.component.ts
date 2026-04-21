import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-auswertungen',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="placeholder-page">
      <mat-icon class="placeholder-icon">bar_chart</mat-icon>
      <h2>Auswertungen</h2>
      <p>Diese Funktion ist in Entwicklung.</p>
    </div>
  `,
  styles: [`
    .placeholder-page {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 60vh;
      gap: 16px;
      color: #666;
    }
    .placeholder-icon { font-size: 64px; width: 64px; height: 64px; color: #bbb; }
    h2 { margin: 0; font-size: 1.5rem; }
    p { margin: 0; font-size: 1rem; }
  `]
})
export class AuswertungenComponent {}
