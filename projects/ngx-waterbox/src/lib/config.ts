import { Provider } from '@angular/core';

import { WaterboxConfig } from './types';
import { WATERBOX_CONFIG } from './tokens';

export function provideWaterboxConfig(config: WaterboxConfig): Provider[] {
  return [{ provide: WATERBOX_CONFIG, useValue: config }];
}

