import { createContext, useState, useEffect } from "react";
import firebase from "../firebase/clientApp";
import nookies from "nookies";
import router, { useRouter } from "next/router";

export const AuthContext = createContext({
  user: null,
  signIn: (user) => {},
  signOut: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const value = {
    user,
    signIn: (user) => {
      setUser(user);
    },
    signOut: () => {
      setUser(null);
      firebase.auth().signOut();
      router.push("/");
    },
  };
  // listen for token changes
  // call setUser and write new token as a cookie
  useEffect(() => {
    return firebase.auth().onIdTokenChanged(async (currentUser) => {
      if (!currentUser) {
        if (user) {
          value.signOut();
        }
        nookies.set(undefined, "token", "", { path: "/" });
      } else {
        const token = await currentUser.getIdToken();
        nookies.set(undefined, "token", token, { path: "/" });
        value.signIn(currentUser);
      }
    });
  }, []);

  // force refresh the token every 10 minutes
  useEffect(() => {
    const handle = setInterval(async () => {
      const currentUser = firebase.auth().currentUser;
      if (currentUser) await currentUser.getIdToken(true);
    }, 10 * 60 * 1000);

    // clean up setInterval
    return () => clearInterval(handle);
  }, []);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
