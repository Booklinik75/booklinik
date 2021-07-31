import * as firebaseAdmin from "firebase-admin";

if (!firebaseAdmin.apps.length) {
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert({
      privateKey: process.env.NEXT_ADMIN_FIREBASE_PRIVATE_KEY,
      clientEmail: process.env.NEXT_ADMIN_FIREBASE_CLIENT_EMAIL,
      projectId: process.env.NEXT_ADMIN_FIREBASE_PROJECT_ID,
    }),
    databaseURL: "https://booklinik.firebaseio.com",
  });
}

export { firebaseAdmin };
