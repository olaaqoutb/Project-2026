export type Time24h = `${string}:${string}`;

export type GermanDate = `${string}.${string}.${string}`;

 export interface DateTimeComponents {
   date: GermanDate;

   time: Time24h;

   normalizedTime: Time24h;

   displayDate: GermanDate;

   hours: number;

   minutes: number;

   normalizedHours: number;

   normalizedMinutes: number;

  dateObject?: Date;

  isoString?: string;


  isMidnight?: boolean;
}


export type ParsedDateTime = DateTimeComponents | null;
