// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // SA live
  // baseUrl: 'https://api.etmana.sa/api/',
  // live EG
  // baseUrl: 'https://api.etmana.com/api/',
  // staging sa
  // baseUrl: 'https://api-staging.etmana.com.sa/api/',
  // staging eg
  baseUrl: 'https://api-staging.etmana.com/api/',
  // dev
  // baseUrl: 'https://api-trazan.etmana.com/api/',
  firebase: {
    projectId: 'etmananative',
    appId: '1:265148884807:web:a56bcd312597b3f4dd0e62',
    databaseURL: 'https://etmananative-default-rtdb.firebaseio.com',
    storageBucket: 'etmananative.appspot.com',
    apiKey: 'AIzaSyArJv2JKBQ1xOLf60iBWi4tlbV2RpGg7zM',
    authDomain: 'etmananative.firebaseapp.com',
    messagingSenderId: '265148884807',
    measurementId: 'G-JS0D944KYZ',
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
