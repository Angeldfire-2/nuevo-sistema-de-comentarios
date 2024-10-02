const firebaseConfig = {
    apiKey: "AIzaSyBIj4lTxuwoXt0I76sRaVT3SAcGGV_sHfI",
    authDomain: "database-angeldfire2.firebaseapp.com",
    projectId: "database-angeldfire2",
    storageBucket: "database-angeldfire2.appspot.com",
    messagingSenderId: "451528930740",
    appId: "1:451528930740:web:de90af58ac38c911d6eee1",
    measurementId: "G-7ZR5CPDS6J"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();