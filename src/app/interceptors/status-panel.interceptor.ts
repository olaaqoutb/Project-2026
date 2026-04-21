import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent, HttpResponse, HttpErrorResponse
} from '@angular/common/http';
import {Observable, finalize, tap, catchError, throwError} from 'rxjs';
import {StatusPanelService} from '../services/utils/status-panel-status.service';



@Injectable()
export class StatusPanelInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Skip tracking for assets and config
    if (req.url.startsWith('/assets/') || req.url.includes('config.json')) {
      return next.handle(req);
    }

    const startTime = Date.now();
    const requestId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

     console.log('Request started:', requestId, req.method, req.url);



     return next.handle(req).pipe(
       tap((event: HttpEvent<unknown>) => {
         console.log('HTTP Event:', event.constructor.name, requestId);

        if (event instanceof HttpResponse) {
          const duration = Date.now() - startTime;

           console.log(' Success:', requestId, event.status, duration + 'ms');

        }
      }),

       catchError((error: HttpErrorResponse) => {
        const duration = Date.now() - startTime;

         console.log(' Error:', requestId, error.status, error.statusText, duration + 'ms');


        // Re-throw error to not break the app
        return throwError(() => error);
      }),

      finalize(() => {
        console.log('  Finalize:', requestId);
      })
    );
  }
}
