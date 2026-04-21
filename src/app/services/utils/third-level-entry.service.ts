import { Injectable } from '@angular/core';
 import { TimeUtilityService } from './time-utility.service';
import { TaetigkeitNode } from '../../models/taetigkeit-node';

@Injectable({
  providedIn: 'root'
})
export class ThirdLevelEntryService {

  constructor(private timeUtilityService: TimeUtilityService) {}

  addNewActivity(
    formValue: any,
    treeData: TaetigkeitNode[],
    findOrCreateMonthNodeFn: (monthYear: string) => TaetigkeitNode,
    findOrCreateDayNodeFn: (monthNode: TaetigkeitNode, dayKey: string, date: Date) => TaetigkeitNode,
  ): TaetigkeitNode {
    const startDate: Date = formValue.startDatum;
    const monthYear = this.timeUtilityService.getMonthYearString(startDate);
    const monthNode = findOrCreateMonthNodeFn(monthYear);
    const dayKey = this.timeUtilityService.formatDayName(startDate);
    const dayNode = findOrCreateDayNodeFn(monthNode, dayKey, startDate);


    const newActivityData = { ...formValue };
    const timeRange = `${formValue.startStunde}:${formValue.startMinuten} - ${formValue.endeStunde}:${formValue.endeMinuten}`;
    const gebuchtTime = 0;
    const newStempelzeitData = {
      id: `new-${Date.now()}`,
      login: startDate.toISOString(),
      logoff: startDate.toISOString(),
      zeitTyp: 'BEREITSCHAFT',
      version: 1,
      deleted: false,
      anmerkung: formValue.anmerkung || ''
    };

    dayNode.children = dayNode.children || [];
    dayNode.children.push({ ...newActivityData, stempelzeitData: newStempelzeitData, timeRange, gebuchtTime });

    return dayNode;
  }
}