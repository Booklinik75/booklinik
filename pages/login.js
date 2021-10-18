import Link from "next/link";
import Logo from "../public/booklinik-logo.svg";
import Image from "next/image";
import SideBanner from "../public/assets/login.jpeg";
import firebase from "../firebase/clientApp";
import { useRouter } from "next/router";
import { useState } from "react";
import { BiError } from "react-icons/bi";
import DashboardButton from "../components/DashboardButton";
import { checkAuth, serverRedirect } from "utils/ServerHelpers";

export const getServerSideProps = async (ctx) => {
  const auth = await checkAuth(ctx);
  if (auth.props.userProfile) return serverRedirect("/dashboard");

  return {
    props: {
      auth,
    },
  };
};

const Login = () => {
  const [formData, updateFormData] = useState({ email: "", password: "" });
  const router = useRouter();
  const [error, setError] = useState(null);
  const [isLoading, setLoading] = useState("idle");

  function doLogIn() {
    const { email, password } = formData;
    setLoading("loading");
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        var user = userCredential.user;
        router.push("/dashboard");
      })
      .catch((error) => {
        setError(error.message);
        setLoading("idle");
      });
  }

  const handleChange = (e) => {
    updateFormData({
      ...formData,

      // Trimming any whitespace
      [e.target.name]: e.target.value.trim(),
    });
  };

  return (
    <div className="h-screen relative">
      <div className="nav top-0 absolute flex flex-row w-full justify-between z-50 p-10 bg-white shadow-lg">
        <Link href="/">
          <a>
            <Image src={Logo} alt="Booklinik" />
          </a>
        </Link>

        <div className="flex flex-row gap-1 ">
          <p>Vous n&apos;avez pas encore de compte ?</p>
          <Link href="/signup">
            <a className="text-gray-700 hover:underline">S&apos;inscrire</a>
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-10 h-full">
        <div className="flex items-center col-span-10 lg:col-span-6">
          <div className="mx-auto w-1/2 space-y-6">
            <h1 className="text-4xl">Bonjour !</h1>
            {error && (
              <p className="text-red-500 flex items-center text-sm gap-1">
                <BiError />
                {error}
              </p>
            )}
            <form
              className="flex flex-col w-full space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                doLogIn();
              }}
            >
              <label
                className="text-xs uppercase text-gray-500 w-full"
                htmlFor="email"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded border-2 outline-none border-gray-300 p-3 transition hover:border-bali focus:border-shamrock"
              />
              <label
                className="text-xs uppercase text-gray-500 w-full"
                htmlFor="password"
              >
                Mot de passe
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full rounded border-2 outline-none border-gray-300 p-3 transition hover:border-bali focus:border-shamrock focus:border-2"
              />
              <Link href="/reset-password">
                <a className="text-bali text-sm hover:underline">
                  Mot de passe oublié ?
                </a>
              </Link>
              <div className="flex flex-row justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Vous n&apos;avez pas encore de compte ?
                  </p>
                  <Link href="/signup">
                    <a className="text-sm text-gray-500 transition hover:underline">
                      S&apos;inscrire
                    </a>
                  </Link>
                </div>
                <div>
                  <DashboardButton
                    defaultText="Se&nbsp;connecter"
                    status={isLoading}
                  ></DashboardButton>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="relative hidden col-span-4 lg:block">
          <Image
            src={SideBanner}
            layout="fill"
            objectFit="cover"
            className="h-full"
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
