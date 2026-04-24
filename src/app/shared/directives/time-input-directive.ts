import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  HostListener
} from '@angular/core';

@Directive({
  selector: '[timeInput]',
  standalone: true
})
export class TimeInputDirective implements OnInit, OnDestroy {
  @Input() timeField!: string;
  @Input() timeMax!: number;
  @Input() timeDisabled = false;
  @Output() timeValueChange = new EventEmitter<number>();

  private lastWheelAdjust = 0;
  private wheelListener!: (e: WheelEvent) => void;

  constructor(
    private el: ElementRef<HTMLInputElement>,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.applyStyles();
    this.registerWheelListener();
  }

  ngOnDestroy(): void {
    this.el.nativeElement.removeEventListener('wheel', this.wheelListener);
  }

  private applyStyles(): void {
    const el = this.el.nativeElement;
    el.style.cursor = 'default';
    el.style.caretColor = 'transparent';
    el.style.userSelect = 'none';
  }

  private registerWheelListener(): void {
    this.wheelListener = (e: WheelEvent) => {
      if (this.timeDisabled) return;
      e.preventDefault();
      const now = Date.now();
      if (now - this.lastWheelAdjust < 120) return;
      this.lastWheelAdjust = now;
      const amount = e.deltaY < 0 ? 1 : -1;
      this.ngZone.run(() => this.adjust(amount));
    };
    this.ngZone.runOutsideAngular(() => {
      this.el.nativeElement.addEventListener('wheel', this.wheelListener, { passive: false });
    });
  }

  @HostListener('focus', ['$event'])
  onFocus(event: FocusEvent): void {
    if (this.timeDisabled) {
      (event.target as HTMLInputElement).blur();
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (this.timeDisabled) return;

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.adjust(1);
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.adjust(-1);
      return;
    }

    if (/^\d$/.test(event.key)) {
      event.preventDefault();
      const digit = parseInt(event.key, 10);
      const current = this.getCurrentValue();
      const newVal = (current * 10 + digit) % 100;
      const clamped = newVal > this.timeMax ? digit : newVal;
      this.timeValueChange.emit(clamped);
      return;
    }

    const allowed = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'];
    if (!allowed.includes(event.key)) {
      event.preventDefault();
    }
  }

  private adjust(amount: number): void {
    const current = this.getCurrentValue();
    let newVal = current + amount;
    if (newVal < 0) newVal = this.timeMax;
    if (newVal > this.timeMax) newVal = 0;
    this.timeValueChange.emit(newVal);
  }

  private getCurrentValue(): number {
    const val = parseInt(this.el.nativeElement.value, 10);
    return isNaN(val) ? 0 : val;
  }
}
