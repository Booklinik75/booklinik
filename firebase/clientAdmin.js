import * as firebaseAdmin from "firebase-admin";

// get this JSON from the Firebase board
// you can also store the values in environment variables
import serviceAccount from "./booklinik-firebase-adminsdk-is5ek-5e13e433bd.json";

if (!firebaseAdmin.apps.length) {
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert({
      privateKey: serviceAccount.private_key,
      clientEmail: serviceAccount.client_email,
      projectId: serviceAccount.project_id,
    }),
    databaseURL: "https://booklinik.firebaseio.com",
  });
}

export { firebaseAdmin };
