import { NativeDateAdapter } from '@angular/material/core';
import { Injectable } from '@angular/core';

@Injectable()
export class CustomDateAdapter extends NativeDateAdapter {
 override format(date: Date): string {
  const day = this.to2digit(date.getDate());
  const month = this.to2digit(date.getMonth() + 1);
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
}


  private to2digit(n: number): string {
    return ('00' + n).slice(-2);
  }
  override parse(value: any): Date | null {
    if (typeof value === 'string') {
      const trimmed = value.trim();

      // "DD.MM.YYYY" / "D.M.YYYY" / "D.M.YY"
      if (trimmed.indexOf('.') > -1) {
        const [d, m, y] = trimmed.split('.');
        const day = Number(d);
        const month = Number(m) - 1;
        let year = Number(y);
        if (!isNaN(year) && y && y.length === 2) {
          year += year < 70 ? 2000 : 1900;
        }
        if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
        return new Date(year, month, day);
      }

      // Numeric-only shortcut: "01012022" -> 01.01.2022, "010122" -> 01.01.2022
      if (/^\d{6}$|^\d{8}$/.test(trimmed)) {
        const day = Number(trimmed.slice(0, 2));
        const month = Number(trimmed.slice(2, 4)) - 1;
        let year = Number(trimmed.slice(4));
        if (trimmed.length === 6) year += year < 70 ? 2000 : 1900;
        return new Date(year, month, day);
      }
    }
    const timestamp = typeof value === 'number' ? value : Date.parse(value);
    return isNaN(timestamp) ? null : new Date(timestamp);
  }
}