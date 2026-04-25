import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-taetigkeiten-time-box',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './taetigkeiten-time-box.component.html',
  styleUrl: './taetigkeiten-time-box.component.scss'
})
export class TaetigkeitenTimeBoxComponent {
  @Input() value: number = 0;
  @Input() min: number = 0;
  @Input() max: number = 24;
  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;
  @Input() decreaseDisabled: boolean = false;
  @Input() increaseDisabled: boolean = false;

  @Output() valueChange = new EventEmitter<number>();

  get nextValue(): number {
    const next = this.value + 1;
    return next > this.max ? this.max : next;
  }

  get previousValue(): number {
    const prev = this.value - 1;
    return prev < this.min ? this.min : prev;
  }

  get canIncrease(): boolean {
    return this.value < this.max;
  }

  get canDecrease(): boolean {
    return this.value > this.min;
  }

  increase(): void {
    if (this.disabled || this.increaseDisabled || !this.canIncrease) return;
    this.valueChange.emit(this.nextValue);
  }

  decrease(): void {
    if (this.disabled || this.decreaseDisabled || !this.canDecrease) return;
    this.valueChange.emit(this.previousValue);
  }

  onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const parsed = parseInt(target.value, 10);
    if (isNaN(parsed)) return;
    const clamped = Math.max(this.min, Math.min(this.max, parsed));
    this.valueChange.emit(clamped);
  }
}
