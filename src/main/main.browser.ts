import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from '../app/app.module';
import {environment} from '../environments/environment';
import 'hammerjs';

import { environmentLoader as environmentLoaderPromise } from '../assets/services/environmentLoader';


// if (environment.production) {
//   enableProdMode();
// }

environmentLoaderPromise.then(env => {
  if (env.production) {
    enableProdMode();
  }
  environment.BASE_URL = env.BASE_URL;
  environment.websocket_url = env.websocket_url;
  environment.apiGatewayUrl = env.apiGatewayUrl; 
  environment.notificationDuration = env.notificationDuration;
  environment.timerInterval = env.timerInterval;
  environment.timerThreatConfigInterval = env.timerThreatConfigInterval;
  environment.expiryDays = env.expiryDays;
  environment.languagesSupported = env.languagesSupported;
  environment.reportChartSliderInterval = env.reportChartSliderInterval;
  environment.keycloakUrl = env.keycloakUrl;
  environment.grantType  = env.grantType;
  environment.tokenVerifyClientId = env.tokenVerifyClientId;
  environment.tokenVerifySecret = env.tokenVerifySecret;
  environment.isMobile = env.isMobile;
  environment.stopThreatUpdate = env.stopThreatUpdate;
  environment.threatMessageUrl = env.threatMessageUrl;
  environment.stopCallInterval = env.stopCallInterval;
  environment.threatNotificationPopupInterval = env.threatNotificationPopupInterval;
  environment.tabletMacAdddress = env.tabletMacAdddress;

  platformBrowserDynamic().bootstrapModule(AppModule);
  // document.addEventListener('DOMContentLoaded', () => {
  //   platformBrowserDynamic().bootstrapModule(AppModule);
  // });
});


// document.addEventListener('DOMContentLoaded', () => {
//   platformBrowserDynamic().bootstrapModule(AppModule);
// });
