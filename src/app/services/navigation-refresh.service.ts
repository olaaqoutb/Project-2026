import { Injectable } from '@angular/core';
import {ReplaySubject, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavigationRefreshService {


  private refreshSubject = new Subject<string>();
  refresh$ = this.refreshSubject.asObservable();

  constructor() { }

  triggerRefresh(route: string): void {
    this.refreshSubject.next(route);
  }
}
