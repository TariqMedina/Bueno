//get all dependencies
import firebase from 'firebase';
import firebaseui from 'firebaseui';

//db creds

const config = {
    apiKey: "AIzaSyBsSZElW0_DrYaIFdzLBEuWfVJmtf8mMhM",
    authDomain: "bueno-f4782.firebaseapp.com",
    databaseURL: "https://bueno-f4782.firebaseio.com",
    projectId: "bueno-f4782",
    storageBucket: "bueno-f4782.appspot.com",
    messagingSenderId: "928953978862"
};

// This must run before any other firebase functions
//   window.firebase.initializeApp(config)
firebase.initializeApp(config);

// This sets up firebaseui
const ui = new firebaseui.auth.AuthUI(firebase.auth())

export const provider = new firebase.auth.GoogleAuthProvider();


// export const providers = {
//     googleProvider: new firebase.auth.GoogleAuthProvider(),
//     fbprovider = new firebase.auth.FacebookAuthProvider()
//   };

export const auth = firebase.auth();

export default firebase;

// This is our firebaseui configuration object
export const uiConfig = ({
    signInFlow: 'popup',
    signInSuccessUrl: '/',
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
    ],
    tosUrl: '/terms-of-service' // This doesn't exist yet
  })
  

  
  // This adds firebaseui to the page
  // It does everything else on its own
  
  export const startFirebaseUI = function (elementId) {
    ui.start(elementId, uiConfig)
  }
  
  
