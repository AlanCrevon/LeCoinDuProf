// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyC8zYfkXXcJRhE-fnFs3EVmuHyN2MXEUPk',
    authDomain: 'lecoinduprof-v2-dev.firebaseapp.com',
    databaseURL: 'https://lecoinduprof-v2-dev.firebaseio.com',
    projectId: 'lecoinduprof-v2-dev',
    storageBucket: 'lecoinduprof-v2-dev.appspot.com',
    messagingSenderId: '86601526918',
    appId: '1:86601526918:web:c089e31d32a308326e6b07'
  },
  tosUrl: 'https://lecoinduprof-v2-dev.firebaseio.com/app/tos',
  privacyPolicyUrl: 'https://lecoinduprof-v2-dev.firebaseio.com/app/privacyPolicyUrl',
  // Note : This key is invalidated
  googleMapApiKey: 'AIzaSyDtELC4i2mXzBeUI6yisMX8iH_a-dMUKIo',
  title: {
    default: 'DEV LeCoinDuProf'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
import 'zone.js/dist/zone-error'; // Included with Angular CLI.
