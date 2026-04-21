import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {StatusMessage, StatusPanelService} from '../../../services/utils/status-panel-status.service';
 @Component({
  selector: 'app-status-panel-list',
  imports: [CommonModule],
  templateUrl: './status-panel-list.component.html',
  styleUrl: './status-panel-list.component.scss'
})
export class StatusPanelListComponent {

   statusService = inject(StatusPanelService);

   readonly messages$ = this.statusService.messages$;
   readonly isExpanded$ = this.statusService.isExpanded$;



   formatMessage(request : StatusMessage) : string{
     if(request.requestId?.toLowerCase().toLowerCase() === 'unknown'){
       return this.formatTime(request.timestamp) + ': ' + request.message;
     }else{
       return this.formatTime(request.timestamp) + ': RequestId ['+ request.requestId +'] '  + request.message;
     }
   }
   /**
    * Format timestamp to HH:MM:SS
    */
   formatTime(date: Date): string {
     const time = date.toLocaleTimeString('de-DE', {
       hour: '2-digit',
       minute: '2-digit',
       second: '2-digit'
     });

     const ms = String(date.getMilliseconds()).padStart(3, '0');
     return `${time}.${ms}`; // German format uses comma for decimals
   }

   /**
    * Get status icon
    */
   getStatusIcon(status: StatusMessage['status']): string {
     return status === 'success' ? '✅' : '❌';
   }

   /**
    * Get status color
    */
   getStatusColor(status: StatusMessage['status']): string {
     return status === 'success' ? '#034a20' : '#e60718';
   }

   /**
    * Shorten URL for display
    */
   shortenUrl(url: string): string {
     try {
       const parsed = new URL(url);
       return `${parsed.pathname}${parsed.search}`;
     } catch {
       return url;
     }
   }

   /**
    * Handle double-click to toggle expanded/collapsed
    */
   onDoubleClick(): void {
     this.statusService.toggleExpanded();
   }

   /**
    * Clear all messages
    */
   clear(): void {
     this.statusService.clear();
   }

   /**
    * Get latest message for collapsed view
    */
   getLatestMessage(): StatusMessage | undefined {
     return this.statusService.getLatestMessage();
   }

   /**
    * Get last 10 messages for expanded view
    */
   getLast10Messages(): StatusMessage[] {
     return this.statusService.getLastNMessages(10);
   }
}
