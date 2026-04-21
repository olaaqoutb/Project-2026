import { Injectable } from '@angular/core';
import {ApiStempelzeit} from '../models/ApiStempelzeit';
import {ApiTaetigkeitsbuchung} from '../models/ApiTaetigkeitsbuchung';

@Injectable({
  providedIn: 'root'
})
export class TimeCalculationService {

  private calculateEntryMinutes(stempelzeit: ApiStempelzeit): number {
    if (!stempelzeit?.login || !stempelzeit?.logoff) {
      return 0;
    }

    const loginTime = new Date(stempelzeit.login);
    const logoffTime = new Date(stempelzeit.logoff);

    if (isNaN(loginTime.getTime()) || isNaN(logoffTime.getTime())) {
      return 0;
    }

    const diffMs = logoffTime.getTime() - loginTime.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    return Math.max(0, diffMinutes);
  }

  /**
   * Extract date string (dd.mm.yyyy) from ISO timestamp
   */
  private extractDay(isoString: string): string {
    const date = new Date(isoString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  }

  /**
   * Calculate total minutes grouped by day
   * @param stempelzeiten - Array of time records
   * @returns Map<day (dd.mm.yyyy), total minutes>
   */
  calculateMinutesByDay(stempelzeiten: ApiStempelzeit[]): Map<string, number> {
    const minutesByDay = new Map<string, number>();

    if (!stempelzeiten || stempelzeiten.length === 0) {
      return minutesByDay;
    }

    const validEntries = stempelzeiten.filter(s => !s.deleted);

    validEntries.forEach(stempelzeit => {
      const day = this.extractDay(stempelzeit.login!);
      const minutes = this.calculateEntryMinutes(stempelzeit);

      const currentTotal = minutesByDay.get(day) || 0;
      minutesByDay.set(day, currentTotal + minutes);
    });

    return minutesByDay;
  }


  calculateTaetigkeitenMinutesByDay(stempelzeiten: ApiTaetigkeitsbuchung[]): Map<string, number> {
    const minutesByDay = new Map<string, number>();

    if (!stempelzeiten || stempelzeiten.length === 0) {
      return minutesByDay;
    }

    const validEntries = stempelzeiten.filter(s => !s.deleted);

    validEntries.forEach(stempelzeit => {
      const day = this.extractDay(stempelzeit.datum!);
      const minutes = stempelzeit.minutenDauer!;

      const currentTotal = minutesByDay.get(day) || 0;
      minutesByDay.set(day, currentTotal + minutes);
    });

    return minutesByDay;
  }

  /**
   * Get sorted array of days with minutes
   */
  getSortedDaysWithMinutes(stempelzeiten: ApiStempelzeit[]): Array<{ day: string; minutes: number }> {
    const map = this.calculateMinutesByDay(stempelzeiten);

    return Array.from(map.entries())
      .map(([day, minutes]) => ({ day, minutes }))
      .sort((a, b) => {
        const [dayA, monthA, yearA] = a.day.split('.').map(Number);
        const [dayB, monthB, yearB] = b.day.split('.').map(Number);

        const dateA = new Date(yearA, monthA - 1, dayA);
        const dateB = new Date(yearB, monthB - 1, dayB);

        return dateB.getTime() - dateA.getTime();
      });
  }


  getSortedTaetigkeitenDaysWithMinutes(stempelzeiten: ApiTaetigkeitsbuchung[]): Array<{ day: string; minutes: number }> {
    const map = this.calculateTaetigkeitenMinutesByDay(stempelzeiten);

    return Array.from(map.entries())
      .map(([day, minutes]) => ({ day, minutes }))
      .sort((a, b) => {
        const [dayA, monthA, yearA] = a.day.split('.').map(Number);
        const [dayB, monthB, yearB] = b.day.split('.').map(Number);

        const dateA = new Date(yearA, monthA - 1, dayA);
        const dateB = new Date(yearB, monthB - 1, dayB);

        return dateB.getTime() - dateA.getTime();
      });
  }

  /**
   * Calculate total minutes across all days
   */
  calculateTotalMinutes(stempelzeiten: ApiStempelzeit[]): number {
    const map = this.calculateMinutesByDay(stempelzeiten);
    let total = 0;
    map.forEach(minutes => total += minutes);
    return total;
  }

  /**
   * Format minutes to HH:MM format (e.g., 90 → "01:30")
   */
  formatMinutes(minutes: number): string {
    if (!minutes || minutes < 0) {
      return '00:00';
    }

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    const hoursStr = hours.toString().padStart(2, '0');
    const minsStr = mins.toString().padStart(2, '0');

    return `${hoursStr}:${minsStr}`;
  }
}
