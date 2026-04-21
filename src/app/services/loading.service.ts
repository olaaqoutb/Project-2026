import {inject, Injectable} from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {GetitRest2Service} from './getit-rest-2.service';
import {ApiMussPdfLesen} from '../models/ApiMussPdfLesen';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {

  getitRestService = inject(GetitRest2Service);

  private loadingSubject = new BehaviorSubject<boolean>(false);
  private loadingCounter = 0;

  constructor() {
  }

  get loading$(): Observable<boolean> {
    return this.loadingSubject.asObservable();
  }

  showLoading(): void {
    this.loadingCounter++;
    this.loadingSubject.next(true);
  }

  hideLoading(): void {
    this.loadingCounter--;
    if (this.loadingCounter <= 0) {
      this.loadingCounter = 0;
      this.loadingSubject.next(false);
    }
  }

  mussPdfLesenCheck(): Observable<ApiMussPdfLesen> {
    return this.getitRestService.mussInfoPdfLesen();
  }

  hatInfoPdfGelesen(){
    return this.getitRestService.hatInfoPdfGelesen();
  }

}
