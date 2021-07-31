import nookies from "nookies";
import firebase from "../firebase/clientApp";
import { firebaseAdmin } from "../firebase/clientAdmin";

export async function getUserToken(ctx) {
  try {
    const cookies = nookies.get(ctx);

    if (!cookies.token) {
      return null;
    }

    const token = await firebaseAdmin.auth().verifyIdToken(cookies.token);

    return token;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function isUserAdmin(ctx) {
  const token = await getUserToken(ctx);

  try {
    if (token) {
      const userDocRef = firebase
        .firestore()
        .collection("users")
        .doc(token.uid);

      console.log(token);

      const doc = await userDocRef.get();

      if (doc.exists) {
        if (doc.data().role != "admin") {
          return false;
        }
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  } catch (error) {
    return error;
  }
}

export const serverRedirect = (path = "/login") => {
  return {
    redirect: {
      permanent: false,
      destination: path,
    },
    props: {},
  };
};

export async function getUserProfile(ctx) {
  const token = await getUserToken(ctx);
  try {
    if (token) {
      const userDocRef = firebase
        .firestore()
        .collection("users")
        .doc(token.uid);

      const doc = await userDocRef.get();

      if (doc.exists) {
        const docData = doc.data();

        if (
          docData.birthdate &&
          docData.birthdate.nanoseconds !== undefined &&
          docData.birthdate.seconds !== undefined
        ) {
          const birthdate = new firebase.firestore.Timestamp(
            docData.birthdate.seconds,
            docData.birthdate.nanoseconds
          ).toDate();

          docData.birthdate = birthdate.toISOString();
        }

        return docData;
      } else {
        return null;
      }
    } else {
      return null;
    }
  } catch (error) {
    return error;
  }
}

export async function checkAuth(ctx) {
  const token = await getUserToken(ctx);

  if (!token) {
    return serverRedirect("/login");
  } else {
    const userProfile = await getUserProfile(ctx);

    return {
      props: { userProfile, token },
    };
  }
}

export async function checkAdmin(ctx) {
  const adminState = await isUserAdmin(ctx);

  if (!adminState) {
    return serverRedirect("/dashboard");
  } else {
    const userProfile = await getUserProfile(ctx);

    return {
      props: { userProfile },
    };
  }
}

export async function getMedicalQuestions() {
  const snapshot = await firebase
    .firestore()
    .collection("medicalQuestions")
    .get();
  return snapshot.docs.map((doc) => doc.data());
}
