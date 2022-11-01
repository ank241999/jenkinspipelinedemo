// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  BASE_URL: 'http://localhost:4200',
  websocket_url: "ws://localhost:9001/hello",
  apiGatewayUrl: 'kong',
  notificationDuration: 3000,
  timerInterval: 6000,
  timerThreatConfigInterval: 60000,
  expiryDays: 1,
  languagesSupported: ['en-US', 'fr-FR', 'es-ES', 'de'],
  reportChartSliderInterval: 30000,
  keycloakUrl: '/auth/realms/OauthToken/protocol/openid-connect',
  grantType: 'password',
  tokenVerifyClientId: 'ams-token-service',
  tokenVerifySecret: '37834659-97e4-4e08-aca8-2343f2c293b5',
  isMobile: false,
  stopThreatUpdate: true,
  threatMessageUrl: 'http://104.198.155.142:8123',
  stopCallInterval: 5000,
  threatNotificationPopupInterval: 600000,
  tabletMacAdddress: '2e:8b:7d:95:d9:e2'
};
