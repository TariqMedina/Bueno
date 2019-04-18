import firebase from 'firebase'

const config = {
    apiKey: "AIzaSyC8ZvBPToQLDVLIko32lQZ3EayAFRSEfaU",
    authDomain: "fun-food-7787d.firebaseapp.com",
    databaseURL: "https://fun-food-7787d.firebaseio.com",
    projectId: "fun-food-7787d",
    storageBucket: "fun-food-7787d.appspot.com",
    messagingSenderId: "962035504798"
};

firebase.initializeApp(config);
export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();
export default firebase;