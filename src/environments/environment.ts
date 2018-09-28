// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyDXzdskRbzm7eryia7CzQULvumms4kvzPA',
    authDomain: 'chatmap-f9fb4.firebaseapp.com',
    databaseURL: 'https://chatmap-f9fb4.firebaseio.com',
    projectId: 'chatmap-f9fb4',
    storageBucket: 'chatmap-f9fb4.appspot.com',
    messagingSenderId: '313871994122'
  },
  // googleMapsKey: {apiKey: 'AIzaSyDXzdskRbzm7eryia7CzQULvumms4kvzPA'}
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
