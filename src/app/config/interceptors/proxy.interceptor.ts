import { Injectable, inject } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ProxyConfigService } from '../services/proxy-config.service';

@Injectable()
export class ProxyInterceptor implements HttpInterceptor {
  private readonly proxyService = inject(ProxyConfigService);

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {

    if (req.url.endsWith('.js') ||
      req.url.endsWith('.css') ||
      req.url.endsWith('.ico') ||
      req.url.startsWith('/assets')) {
      return next.handle(req);
    }

    try
    {
      const basePath = this.proxyService.getBasePath();      // e.g., https://localhost:9000
      const apiPrefix = this.proxyService.getApiPrefix();    // e.g., /at.get-e/gui/getitgui/proxy/v1
      const env = this.proxyService.getEnv();                // e.g., 'e'
      const endpoint = req.url.replace(/^\/api\//, '');
      const newUrl = `${basePath}${apiPrefix}/${endpoint}`;


      const cloned = req.clone({ url: newUrl });
      return next.handle(cloned).pipe(
        catchError((error: HttpErrorResponse) => {
          console.error(`[Proxy] Request failed: ${newUrl}`, error);
          return throwError(() => error);
        })
      );
    } catch (error) {
      console.error('[Proxy] Failed to rewrite URL:', error);
      return next.handle(req);
    }
  }
}
