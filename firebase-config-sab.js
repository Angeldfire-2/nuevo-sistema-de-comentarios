const firebaseConfig = {
    apiKey: process.env.API_KEY_SAB,
    authDomain: process.env.AUTH_DOMAIN_SAB,
    projectId: process.env.PROJECT_ID_SAB,
    storageBucket: process.env.STORAGE_BUCKET_SAB,
    messagingSenderId: process.env.MESSAGING_SENDER_ID_SAB,
    appId: process.env.APP_ID_SAB
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();