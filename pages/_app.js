import { useEffect, useState } from "react";
import "../styles/globals.css";
import { AuthProvider } from "../utils/UserContext";
import { BookProvider } from "utils/bookContext";

import { ToastContainer } from "react-toastify";
import Head from "next/head";
import "@uiw/react-md-editor/dist/markdown-editor.css";
import "@uiw/react-markdown-preview/dist/markdown.css";
import "../styles/calendar.css";
import moment from "moment";
import "moment/locale/fr";
import "react-toastify/dist/ReactToastify.css";
import "react-dropdown/style.css";

import Loading from "components/Loading";
import { useRouter } from "node_modules/next/dist/client/router";

import "tippy.js/dist/tippy.css";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

moment.locale("fr");

function BooklinikClient({ Component, pageProps }) {
  const router = useRouter();
  const [loadingAnimation, setLoadingAnimation] = useState(false);

  useEffect(() => {
    window.$crisp = [];
    window.CRISP_WEBSITE_ID = "ab422553-9bcf-4ce4-ac32-d53b0d6e3b6b";
    (() => {
      const d = document;
      const s = d.createElement("script");
      s.src = "https://client.crisp.chat/l.js";
      s.async = 1;
      d.getElementsByTagName("body")[0].appendChild(s);
    })();

    // axeptio
    window.axeptioSettings = {
      clientId: process.env.NEXT_PUBLIC_AXEPTIO_CLIENT_ID,
      cookiesVersion: process.env.NEXT_PUBLIC_AXEPTIO_COOKIES_VERSION,
    };

    (function (d, s) {
      var t = d.getElementsByTagName(s)[0],
        e = d.createElement(s);
      e.async = true;
      e.src = "https://static.axept.io/sdk-slim.js";
      t.parentNode.insertBefore(e, t);
    })(document, "script");

    // check if there is localStorage for book when user not logged in
    if (
      router.pathname.split("/")[1] !== "signup" &&
      router.query.i === "anonBooking" &&
      localStorage.getItem("bookBooklinik")
    ) {
      localStorage.removeItem("bookBooklinik");
    }
    // set loading animation each page loaded
    const handleStart = () => setLoadingAnimation(true);
    const handleComplete = () => setLoadingAnimation(false);
    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    // Cleanup event listeners
    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  return (
    <>
      <AuthProvider>
        <BookProvider>
          <Head>
            <link
              rel="apple-touch-icon"
              sizes="180x180"
              href="/apple-touch-icon.png"
            />
            <link
              rel="icon"
              type="image/png"
              sizes="32x32"
              href="/favicon-32x32.png"
            />
            <link
              rel="icon"
              type="image/png"
              sizes="16x16"
              href="/favicon-16x16.png"
            />
            <link rel="manifest" href="/site.webmanifest" />
            <link
              rel="mask-icon"
              href="/safari-pinned-tab.svg"
              color="#33c783"
            />
            <meta name="msapplication-TileColor" content="#33c783" />
            <meta name="theme-color" content="#33c783" />
          </Head>
          {loadingAnimation && <Loading />}
          <Component {...pageProps} />
          <ToastContainer />
        </BookProvider>
      </AuthProvider>
    </>
  );
}

export default BooklinikClient;
