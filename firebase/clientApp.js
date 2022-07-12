import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const clientCredentials = {
  apiKey: "AIzaSyB1VHWNa1jfKGTk_ZoPiBzajBRM11eOATY",
  authDomain: "booklinik.firebaseapp.com",
  projectId: "booklinik",
  storageBucket: "booklinik.appspot.com",
  messagingSenderId:"984943990435",
  appId: "1:984943990435:web:021374fe5ca06832df9116",
};

if (!firebase.apps.length) {
  firebase.initializeApp(clientCredentials);
}

export default firebase;
