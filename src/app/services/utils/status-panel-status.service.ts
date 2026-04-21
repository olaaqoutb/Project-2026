// services/status-panel.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {HttpErrorResponse, HttpResponse} from '@angular/common/http';

export interface StatusMessage {
  id: string;
  timestamp: Date;
  method: string;
  url: string;
  status: string;
  statusCode?: string;
  duration?: number;
  message: string;
  requestId? : string;
}

@Injectable({ providedIn: 'root' })
export class StatusPanelService {
  private readonly maxMessages = 10;

  private readonly  messagesSubject = new BehaviorSubject<StatusMessage[]>([]);
  public  readonly messages$ = this.messagesSubject.asObservable();

  private readonly isExpandedSubject = new BehaviorSubject<boolean>(false);
  public readonly isExpanded$ = this.isExpandedSubject.asObservable();

  /**
   * Add a completed message (success or error)
   * Call this AFTER the request finishes
   */

  public addMessageRequest(msg: string, method: string, duration : number, response : HttpResponse<any>  | HttpErrorResponse ) {
    const isErrorResponse = response instanceof HttpErrorResponse;
    let statusCode = response.status.toString();
    const requestId = response.headers.get('getit-request-id') || response.headers.get('getit-request-id') ||  'unknown';
    let status : string = isErrorResponse ? 'error' : 'success';

    const newMessage: StatusMessage = {
      requestId : requestId,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      method: method,
      url: response.url!,
      status: status,
      statusCode: statusCode,
      duration: duration,
      message: msg // || `${method} ${url} - ${statusCode}`
    };

    const current = this.messagesSubject.getValue();
    const updated = [newMessage, ...current].slice(0, this.maxMessages);
    console.log('========== updated-1', updated);
    this.messagesSubject.next(updated);
  }



   addMessage(
    status:string,
    method: string,
    url: string,
    statusCode?: string,
    duration?: number,
    customMessage?: string,
    requestId? : string
  ): void {
    const newMessage: StatusMessage = {
      requestId : requestId,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      method,
      url,
      status,
      statusCode,
      duration,
      message: customMessage || `${method} ${url} - ${statusCode}`
    };

    const current = this.messagesSubject.getValue();
    const updated = [newMessage, ...current].slice(0, this.maxMessages);


    console.log('========== updated-2', updated);
    this.messagesSubject.next(updated);
  }

  toggleExpanded(): void {
    const current = this.isExpandedSubject.getValue();
    this.isExpandedSubject.next(!current);
  }

  /**
   * Set expanded state explicitly
   */
  setExpanded(expanded: boolean): void {
    this.isExpandedSubject.next(expanded);
  }

  /**
   * Get latest message (for collapsed view)
   */
  getLatestMessage(): StatusMessage | undefined {
    return this.messagesSubject.getValue()[0];
  }

  /**
   * Get last N messages (for expanded view)
   */
  getLastNMessages(n: number): StatusMessage[] {
    return this.messagesSubject.getValue().slice(0, n);
  }

  /**
   * Clear all messages
   */
  clear(): void {
    this.messagesSubject.next([]);
  }

  /**
   * Check if there are any messages
   */
  hasMessages(): boolean {
    return this.messagesSubject.getValue().length > 0;
  }
}
