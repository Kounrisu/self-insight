import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { INSIGHT_METHOD_PROVIDERS } from './methods';

export const appConfig: ApplicationConfig = {
  providers: [provideBrowserGlobalErrorListeners(), ...INSIGHT_METHOD_PROVIDERS],
};
