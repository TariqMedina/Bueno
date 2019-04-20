import firebase from 'firebase'

const config = {
    apiKey: "AIzaSyBsSZElW0_DrYaIFdzLBEuWfVJmtf8mMhM",
    authDomain: "bueno-f4782.firebaseapp.com",
    databaseURL: "https://bueno-f4782.firebaseio.com",
    projectId: "bueno-f4782",
    storageBucket: "bueno-f4782.appspot.com",
    messagingSenderId: "928953978862"
};

firebase.initializeApp(config);
export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();
export default firebase;