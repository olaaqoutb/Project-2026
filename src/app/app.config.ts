import {
  APP_INITIALIZER,
  ApplicationConfig,
  importProvidersFrom, inject,
  LOCALE_ID,
  provideAppInitializer,
  provideZoneChangeDetection
} from '@angular/core';
import {provideRouter, RouteReuseStrategy, withHashLocation, withRouterConfig} from '@angular/router';

import { routes } from './app.routes';
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {initializeApp} from './services/app-initializer';
import {PersonService} from './services/person.service';
import {catchError, forkJoin, lastValueFrom, tap} from 'rxjs';
import {DatePipe, registerLocaleData} from '@angular/common';
import {
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
  MatSnackBarConfig,
} from '@angular/material/snack-bar';
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';
import {provideAnimations} from '@angular/platform-browser/animations';
import {PersonenService} from './services/personen.service';
import {StatusPanelInterceptor} from './interceptors/status-panel.interceptor';
import {ProxyInterceptor} from './config/interceptors/proxy.interceptor';
 import {ProxyConfigService} from './config/services/proxy-config.service';
import {environment} from '../environments/environment-proxy';
import {MockBackendInterceptor} from './mock/mock-backend.interceptor';
 registerLocaleData(localeDe, 'de-DE', localeDeExtra);



export class NoReuseStrategy implements RouteReuseStrategy {
  shouldDetach() { return false; }
  store() {}
  shouldAttach() { return false; }
  retrieve() { return null; }
  shouldReuseRoute() { return false; } // <-- key line
}



export const appConfig: ApplicationConfig = {
  providers: [
                provideZoneChangeDetection({ eventCoalescing: true }),
                provideRouter(routes, withHashLocation() ),
       { provide: RouteReuseStrategy, useClass: NoReuseStrategy },

    provideHttpClient( withInterceptorsFromDi() ),

                {
                  provide: APP_INITIALIZER,
                  useFactory: (userService: PersonenService) => () => {
                    {
                      console.log('Initializing application - loading user data...');

                      return lastValueFrom(
                        forkJoin({
                          loggedInPerson: userService.loadLoggedInPerson(),
                          allPersons: userService.getAllPersons(),
                          anwesendPersonen : userService.getAnwesendPersonen()

                        }).pipe(
                          // Optional: Handle errors gracefully
                          catchError((error) => {
                            console.error(' Application initialization failed:', error);
                            throw error; // Re-throw to prevent app startup
                          })
                        )
                      ).then(() => {
                        console.log('Application initialized successfully');
                      });
                    }
                  },
                  deps: [PersonenService],
                  multi: true
                },
                provideAnimations(),
                {
                  provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
                  useValue: {
                    duration: 3000,
                    horizontalPosition: 'center',
                    verticalPosition: 'bottom',
                  } as MatSnackBarConfig,
                },
                importProvidersFrom(
                          MatProgressSpinnerModule,
                          MatTreeModule,
                          MatIconModule,
                          MatButtonModule,
                          MatFormFieldModule,
                          MatInputModule,
                          MatSelectModule,
                          MatSnackBarModule,
                          MatCheckboxModule,
                          MatDatepickerModule,
                          MatNativeDateModule
                        ),
                { provide: LOCALE_ID, useValue: 'de-DE' },

                DatePipe,

          // Mock backend MUST be registered before ProxyInterceptor so it can
          // short-circuit requests while URLs are still relative (e.g. "personen").
          {
            provide: HTTP_INTERCEPTORS,
            useClass: MockBackendInterceptor,
            multi: true
          },
          {
            provide: HTTP_INTERCEPTORS,
            useClass: ProxyInterceptor,
            multi: true
          },

          provideAppInitializer(() => {
            const proxyService = inject(ProxyConfigService);
            return proxyService.loadConfig().catch(error => {
              console.error('proxyService.loadConfig()', error);
            });
          })
  ]
};


