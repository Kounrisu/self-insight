import { Provider } from '@angular/core';
import { INSIGHT_METHODS } from '../core/insight';
import { chineseZodiacMethod } from './chinese-zodiac.method';
import { ichingMethod } from './iching.method';
import { luckMethod } from './luck.method';
import { numerologyMethod } from './numerology.method';
import { planetsMethod } from './planets.method';
import { westernZodiacMethod } from './western-zodiac.method';

/** Order here is the order of the cards. Remove a line to drop a method. */
export const INSIGHT_METHOD_PROVIDERS: Provider[] = [
  westernZodiacMethod,
  chineseZodiacMethod,
  numerologyMethod,
  planetsMethod,
  ichingMethod,
  luckMethod,
].map((useValue) => ({ provide: INSIGHT_METHODS, useValue, multi: true }));
