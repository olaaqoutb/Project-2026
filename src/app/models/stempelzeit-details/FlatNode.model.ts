import { FormData } from './FormData.model';
import { TimeEntry } from './TimeEntry.model';
import {ApiStempelzeit} from '../ApiStempelzeit';

export interface FlatNode {
  date?: string,
  expandable: boolean;
  name: string;
  level: number;
  hasNotification: boolean;
  formData?: FormData;
  timeEntry?: ApiStempelzeit;
}
