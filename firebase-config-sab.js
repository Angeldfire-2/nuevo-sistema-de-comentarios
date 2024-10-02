const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY_SAB,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN_SAB,
    projectId: process.env.REACT_APP_PROJECT_ID_SAB,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET_SAB,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID_SAB,
    appId: process.env.REACT_APP_APP_ID_SAB
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
