import firebase from "firebase/compat/app";

const config = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_CONFIG_apiKey,
	authDomain: process.env.NEXT_PUBLIC_FIREBASE_CONFIG_authDomain,
	projectId: process.env.NEXT_PUBLIC_FIREBASE_CONFIG_projectId,
	storageBucket: process.env.NEXT_PUBLIC_FIREBASE_CONFIG_storageBucket,
	messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_CONFIG_messagingSenderId,
	appId: process.env.NEXT_PUBLIC_FIREBASE_CONFIG_appId,
	measurementId: process.env.NEXT_PUBLIC_FIREBASE_CONFIG_measurementId,
};

const firebaseWebApp = firebase.initializeApp(config);

export { firebaseWebApp };
