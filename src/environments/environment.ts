// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyC8zYfkXXcJRhE-fnFs3EVmuHyN2MXEUPk',
    authDomain: 'lecoinduprof-v2-dev.web.app',
    databaseURL: 'https://lecoinduprof-v2-dev.firebaseio.com',
    projectId: 'lecoinduprof-v2-dev',
    storageBucket: 'gs://lecoinduprof-v2-dev.appspot.com/',
    messagingSenderId: '<your-messaging-sender-id>'
  },
  tosUrl: 'https://lecoinduprof-v2-dev.firebaseio.com/app/tos',
  privacyPolicyUrl: 'https://lecoinduprof-v2-dev.firebaseio.com/app/privacyPolicyUrl',
  googleMapApiKey: 'AIzaSyDtELC4i2mXzBeUI6yisMX8iH_a-dMUKIo'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
import 'zone.js/dist/zone-error'; // Included with Angular CLI.
