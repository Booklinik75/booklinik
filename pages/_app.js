import "../styles/globals.css";
import { AuthProvider } from "../utils/UserContext";

function BooklinikClient({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default BooklinikClient;
