const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_API_KEY_SAB,
    authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN_SAB,
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID_SAB,
    storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET_SAB,
    messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID_SAB,
    appId: process.env.NEXT_PUBLIC_APP_ID_SAB
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
