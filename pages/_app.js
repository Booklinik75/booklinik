import "../styles/globals.css";
import { AuthProvider } from "../utils/UserContext";
import { ToastContainer } from "react-toastify";
import Head from "next/head";
import "@uiw/react-md-editor/dist/markdown-editor.css";
import "@uiw/react-markdown-preview/dist/markdown.css";
import "../styles/calendar.css";

import "react-toastify/dist/ReactToastify.css";

function BooklinikClient({ Component, pageProps }) {
  return (
    <AuthProvider>
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
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#33c783" />
        <meta name="msapplication-TileColor" content="#33c783" />
        <meta name="theme-color" content="#33c783" />
      </Head>
      <Component {...pageProps} />
      <ToastContainer />
    </AuthProvider>
  );
}

export default BooklinikClient;
