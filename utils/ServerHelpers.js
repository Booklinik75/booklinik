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

export async function getOperationCategories() {
  const snapshot = await firebase
    .firestore()
    .collection("operationCategories")
    .get();
  return snapshot.docs.map((doc) => doc.data());
}

export async function getCities() {
  const snapshot = await firebase.firestore().collection("cities").get();
  return snapshot.docs.map((doc) => doc.data());
}

export async function getCountries() {
  const snapshot = await firebase.firestore().collection("countries").get();
  return snapshot.docs.map((doc) => doc.data());
}

export async function getHotels() {
  const snapshot = await firebase.firestore().collection("hotels").get();
  return snapshot.docs.map((doc) => doc.data());
}

export async function getBackEndAsset(path) {
  const storageRef = await firebase
    .storage()
    .ref()
    .child(path)
    .getDownloadURL()
    .then((url) => {
      return url;
    });

  return storageRef;
}

export async function getOperationData(slug) {
  try {
    const snapshot = await firebase
      .firestore()
      .collection("operationCategories")
      .where("slug", "==", slug)
      .get();

    const operationData = {
      data: snapshot.docs[0].data(),
      id: snapshot.docs[0].id,
    };

    return {
      props: operationData,
    };
  } catch (error) {
    return serverRedirect("/dashboard/admin/operations");
  }
}

export async function getCityData(slug) {
  try {
    const snapshot = await firebase
      .firestore()
      .collection("cities")
      .where("slug", "==", slug)
      .get();

    const cityData = {
      data: snapshot.docs[0].data(),
      id: snapshot.docs[0].id,
    };

    return {
      props: cityData,
    };
  } catch (error) {
    return serverRedirect("/dashboard/admin/cities");
  }
}

export async function getCountryData(slug) {
  try {
    const snapshot = await firebase
      .firestore()
      .collection("countries")
      .where("slug", "==", slug)
      .get();

    const countryData = {
      data: snapshot.docs[0].data(),
      id: snapshot.docs[0].id,
    };

    return {
      props: countryData,
    };
  } catch (error) {
    return serverRedirect("/dashboard/admin/countries");
  }
}

export async function getHotelData(slug) {
  try {
    const snapshot = await firebase
      .firestore()
      .collection("hotels")
      .where("slug", "==", slug)
      .get();

    const countryData = {
      data: snapshot.docs[0].data(),
      id: snapshot.docs[0].id,
    };

    return {
      props: countryData,
    };
  } catch (error) {
    return serverRedirect("/dashboard/admin/hotels");
  }
}
