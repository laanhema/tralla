import { provideEventPlugins } from '@taiga-ui/event-plugins';
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { tuiAlertOptionsProvider } from '@taiga-ui/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideEventPlugins(),
    provideHttpClient(),
    tuiAlertOptionsProvider({
      label: ({ status }: any) => status[0].toUpperCase() + status.slice(1),
      appearance: 'neutral',
      autoClose: 4000,
    }),
  ],
};
