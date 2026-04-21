import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { format, min } from 'date-fns';
import { FlatNode } from '../../models/Flat-node';
import {GermanDate, ParsedDateTime, Time24h} from '../../models/ui-models/date-time-ui';
 @Injectable({
  providedIn: 'root'
})
export class DateUtilsService {


  constructor(private datePipe: DatePipe) { }

  static formateDateWithoutSeconds (date : Date) : string{
     return date.toLocaleString('de-DE', {
       day: '2-digit',
       month: '2-digit',
       year: 'numeric',
       hour: '2-digit',
       minute: '2-digit'
     }).replace(', ', ' - ');
 }

   static formatDateTimeWithoutSeconds(date: Date | undefined | null): string {
     if (!date) return '';

      let displayDate = new Date(date);

      if (isNaN(displayDate.getTime())) {
       console.error('Invalid date:', date);
       return '';
     }


     const isMidnight = displayDate.getHours() === 0 && displayDate.getMinutes() === 0;

      if (isMidnight) {
       displayDate = new Date(displayDate.getTime() - 24 * 60 * 60 * 1000);
     }

     // Format using toLocaleString
     let formatted = displayDate.toLocaleString('de-DE', {
       day: '2-digit',
       month: '2-digit',
       year: 'numeric',
       hour: '2-digit',
       minute: '2-digit'
     });


     if (isMidnight) {
       // Extract date part and append 24:00
       const datePart = formatted.split(',')[0]; // "05.02.2026"
       formatted = `${datePart} - 24:00`;
     } else {
       // Normal format: replace ", " with " - "
       formatted = formatted.replace(', ', ' - ');
     }

     return formatted;
   }

  formatDate(date: string, format : string): string {
    const formatedDate = this.datePipe.transform(date, format, 'de-DE');
    if (formatedDate == null) {
      return '';
    }
    return formatedDate;
  }


   static parseGermanDate(dateString: string | undefined | null): Date | null {
     if (!dateString) return null;

      const regex = /^(\d{2})\.(\d{2})\.(\d{4})$/;
     const match = dateString.trim().match(regex);

     if (!match) {
       console.error('Invalid date format (expected dd.mm.yyyy):', dateString);
       return null;
     }

      const [, dayStr, monthStr, yearStr] = match;
     const day = parseInt(dayStr, 10);
     const month = parseInt(monthStr, 10) - 1; // JavaScript months are 0-based
     const year = parseInt(yearStr, 10);

      const date = new Date(year, month, day);

      if (isNaN(date.getTime()) ||
       date.getDate() !== day ||
       date.getMonth() !== month ||
       date.getFullYear() !== year) {
       console.error('Invalid date values:', dateString);
       return null;
     }

     return date;
   }


   static parseGermanDateTimeToComponents(dateString: string | undefined | null): ParsedDateTime {
     if (!dateString) return null;

      const regex = /^(\d{2})\.(\d{2})\.(\d{4}) - (\d{2}):(\d{2})$/;
     const match = dateString.trim().match(regex);

     if (!match) {
       console.error('Invalid date format:', dateString);
       return null;
     }

      const [, dayStr, monthStr, yearStr, hoursStr, minutesStr] = match;

      const day = parseInt(dayStr, 10);
     const month = parseInt(monthStr, 10);
     const year = parseInt(yearStr, 10);
     const hours = parseInt(hoursStr, 10);
     const minutes = parseInt(minutesStr, 10);

      if (hours < 0 || hours > 24 || minutes < 0 || minutes > 59) {
       console.error('Invalid time values:', hours, minutes);
       return null;
     }

      const date: GermanDate = `${dayStr}.${monthStr}.${yearStr}`;
     const time: Time24h = `${hoursStr}:${minutesStr}`;

      const isMidnight = hours === 24 && minutes === 0;

     const normalizedHours = isMidnight ? 0 : hours;
     const normalizedMinutes = minutes; // Always unchanged
     const normalizedTime: Time24h = `${String(normalizedHours).padStart(2, '0')}:${String(normalizedMinutes).padStart(2, '0')}`;

      let displayDay = day;
     let displayMonth = month;
     let displayYear = year;

     if (isMidnight) {
       // Move to next day
       const tempDate = new Date(year, month - 1, day + 1);
       displayDay = tempDate.getDate();
       displayMonth = tempDate.getMonth() + 1;
       displayYear = tempDate.getFullYear();
     }

     const displayDate: GermanDate =
       `${String(displayDay).padStart(2, '0')}.${String(displayMonth).padStart(2, '0')}.${displayYear}`;

      const dateObject = new Date(displayYear, displayMonth - 1, displayDay, normalizedHours, normalizedMinutes, 0, 0);


     return {
       date,
       time,
       normalizedTime,
       displayDate,
       hours,
       minutes,
       normalizedHours,
       normalizedMinutes,
       isMidnight,
       dateObject,
       isoString: dateObject.toISOString()
     };
   }


   static parseGermanDateTimeToComponents1(dateString: string | undefined | null): {
     date: string;      // "05.02.2026"
     time: string;      // "24:00" or "14:30"
     normalizedTime: string; // "00:00" (if 24:00)
     displayDate: string;    // "06.02.2026" (adjusted if 24:00)
   } | null {
     if (!dateString) return null;

     const regex = /^(\d{2})\.(\d{2})\.(\d{4}) - (\d{2}):(\d{2})$/;
     const match = dateString.trim().match(regex);

     if (!match) {
       console.error('Invalid date format:', dateString);
       return null;
     }

     const [, dayStr, monthStr, yearStr, hoursStr, minutesStr] = match;

     const date = `${dayStr}.${monthStr}.${yearStr}`;
     const time = `${hoursStr}:${minutesStr}`;

      const hours = parseInt(hoursStr, 10);
     const day = parseInt(dayStr, 10);

     let normalizedTime = time;
     let displayDate = date;

     if (hours === 24) {
       normalizedTime = '00:00';

       // Calculate next day
       const currentYear = parseInt(yearStr, 10);
       const currentMonth = parseInt(monthStr, 10);
       const nextDayDate = new Date(currentYear, currentMonth - 1, day + 1);

       const nextDay = String(nextDayDate.getDate()).padStart(2, '0');
       const nextMonth = String(nextDayDate.getMonth() + 1).padStart(2, '0');
       const nextYear = nextDayDate.getFullYear();

       displayDate = `${nextDay}.${nextMonth}.${nextYear}`;
     }

     return {
       date,           // Original date from string
       time,           // Original time from string
       normalizedTime, // Adjusted time (24:00 → 00:00)
       displayDate     // Adjusted date if 24:00
     };
   }

   static  convertToISO(dateString: string): string {
     const [day, month, year] = dateString.split('.');
     return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
   }

  static getDateWithoutTime(date: string | Date): Date {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  }


  static  isDayEquals(d1: Date | null, d2: Date | null): boolean {
    if (d1 === null && d2 === null) {
      return true;
    } else if (d1 === null || d2 === null) {
      return false;
    }

    const formatDate = (date: Date): string => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    return formatDate(d1) === formatDate(d2);
  }


  static isMonthEquals(d1: Date | null, d2: Date | null): boolean {
    if (!d1 && !d2) {
      return true;
    } else if (!d1 || !d2) {
      return false;
    }

    const formatDate = (date: Date) => date.toISOString().slice(0, 7); // Extract "YYYY-MM"

    return formatDate(d1) === formatDate(d2);
  }

   formatEndAs24(date: Date | null, dateFormat: string): string | null {
    if (!date) {
        return null;
    }

    const formattedTime = format(date, 'HHmm'); // Get time in "HHmm" format

    if (formattedTime === '0000') {
        const lastDay = this.getLastDay(date);
        const hPos = dateFormat.indexOf('HH');
        let result = format(lastDay, dateFormat);
        result = result.substring(0, hPos) + '24' + result.substring(hPos + 2);
        return result;
    }

    return format(date, dateFormat);
  }

  getLastDay(date: Date): Date {
    const lastDay = new Date(date);
    lastDay.setDate(lastDay.getDate() - 1);
    return lastDay;
  }


  static formatDateToISO(date: Date, isBeginOfDay : boolean): string {
      const yyyy = date.getFullYear();
      const MM = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
      const dd = String(date.getDate()).padStart(2, '0');
      let hh = '00';
      let mm = '00'
      if(!isBeginOfDay){
        hh = '23';
        mm = '59';
      }
      // String(date.getHours()).padStart(2, '0');
      const ss ='00'; // String(date.getSeconds()).padStart(2, '0');
    //  const ms = String(date.getMilliseconds()).padStart(3, '0');

      return `${yyyy}-${MM}-${dd}T${hh}:${mm}:${ss}`;

  }


  static formatDateToISOFull(date: Date): string {



    const yyyy = date.getFullYear();
    const MM = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const dd = String(date.getDate()).padStart(2, '0');
    let hh = String(date.getHours()).padStart(2, '0');
    let mm = String(date.getMinutes()).padStart(2, '0');

    const ss ='00';
    const ms = String(date.getMilliseconds()).padStart(3, '0');

    return `${yyyy}-${MM}-${dd}T${hh}:${mm}:${ss}.${ms}`;

  }

  static formatDateAndTimeToISOFull(date: Date, hoursMinutes : string): string {
    console.log('formatDateAndTimeToISOFull-date', date);
    const yyyy = date.getFullYear();
    const MM = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const dd = String(date.getDate()).padStart(2, '0');

    const [hours, minutes] = hoursMinutes.split(':').map(Number);

    let hh = hours;
    let mm = minutes;


    const ss ='00';
    const ms = String(date.getMilliseconds()).padStart(3, '0');

    console.log('DATE', `${yyyy}-${MM}-${dd}T${hh}:${mm}:${ss}.${ms}`);

     return `${yyyy}-${MM}-${dd}T${hh}:${mm}:${ss}.${ms}`;

  }

  static parseIsoDate(isoString: string | undefined): Date | null {
     if (!isoString) return null;

      const normalized = isoString.replace(
       /T(\d{1,2}):(\d{1,2}):(\d{1,2})/,
       (_, h, m, s) => `T${h.padStart(2, '0')}:${m.padStart(2, '0')}:${s.padStart(2, '0')}`
     );

     const date = new Date(normalized);

     // Validate
     if (isNaN(date.getTime())) {
       console.error('Invalid date:', isoString);
       return null;
     }

     return date;
   }

  static getMinutes(dateTimeString : string | undefined) : string{
    if(dateTimeString){
      const date = new Date(dateTimeString);
      const minutes = date.getMinutes();
      return minutes.toString();
    }else{
      return '';
    }

  }


  static getHours(dateTimeString : string | undefined) : string{
    if(dateTimeString){
      const date = new Date(dateTimeString);
      const hours = date.getHours();
      return hours.toString();
    }else{
      return '';
    }

  }



  getDateDisplayFromNode(node: FlatNode | null): string {
    if (!node) return '';

    const sourceString = node.dayName || node.name || '';
    if (!sourceString) return '';

    const dateMatch = sourceString.match(/(\w{2})\.\s+(\d{1,2})\.\s+(\w+)/);
    if (dateMatch) {
      const [, , day, monthName] = dateMatch;
      return `${day.padStart(2, '0')}. ${monthName}`;
    }
    return '';
  }


  static getFirstDayOfLastMonth(): string {
    const now = new Date();
    // Create date for 1st of previous month (Date constructor handles year/month rollover automatically)
    const firstDay = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    // Format as YYYY-MM-DD
    const year = firstDay.getFullYear();
    const month = String(firstDay.getMonth() + 1).padStart(2, '0'); // getMonth() is 0-indexed
    const day = String(firstDay.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  static getCurrentDay(){
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

   static getFirstDayOfMonth(selectedMonth: string): string {
     // value is expected as "MM-YYYY"
     const [monthStr, yearStr] = selectedMonth.split('-');

     const year = parseInt(yearStr, 10);
     const month = parseInt(monthStr, 10);

     // Build "ab" (first day of month)
     return  `${year}-${month.toString().padStart(2, '0')}-01`;


   }


   static getLastDayOfMonth(selectedMonth: string): string {
     // value is expected as "MM-YYYY"
     const [monthStr, yearStr] = selectedMonth.split('-');

     const year = parseInt(yearStr, 10);
     const month = parseInt(monthStr, 10);



     const lastDay = new Date(year, month, 0).getDate();

     return `${year}-${month.toString().padStart(2, '0')}-${lastDay}`;


   }


   static formatToGermanDate(date: Date): string {
     if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
       return '';
     }

     const day = date.getDate().toString().padStart(2, '0');
     const month = (date.getMonth() + 1).toString().padStart(2, '0');
     const year = date.getFullYear();

     return `${day}.${month}.${year}`;
   }


}

export function formatDateTimeGerman(date: string | Date | undefined): string {
  if (!date) return '';

  let d = new Date(date);

  // Check if date is valid
  if (isNaN(d.getTime())) return '';

   const isMidnight = d.getHours() === 0 && d.getMinutes() === 0;

   if (isMidnight) {
    d = new Date(d.getTime() - 24 * 60 * 60 * 1000); // Subtract 1 day
  }

  // German day abbreviations (2 letters)
  const dayNames = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
  const dayName = dayNames[d.getDay()];

  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();

   const hours = isMidnight ? '24' : String(d.getHours()).padStart(2, '0');
  const minutes = isMidnight ? '00' : String(d.getMinutes()).padStart(2, '0');

  return `${dayName} ${day}.${month}.${year} - ${hours}:${minutes}`;

}
