import { useState } from "react";
import Image from "next/image";
import NavigationItem from "./NavigationItem";
import Logo from "../public/booklinik-logo.svg";
import Link from "next/link";
import { FaBars } from "react-icons/fa";
import { VscLoading } from "react-icons/vsc";
import firebase from "../firebase/clientApp";
import { useAuthState } from "react-firebase-hooks/auth";
import { motion, AnimatePresence } from "framer-motion";

export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, loading, error] = useAuthState(firebase.auth());
  const [dropdownVisibility, setDropdownVisibility] = useState(false);

  return (
    <div className="w-full">
      <div className="flex flex-wrap py-2">
        <div className="w-full px-2">
          <nav className="relative flex flex-wrap items-center justify-between px-2 py-2">
            <div className="container relative px-4 mx-auto flex flex-wrap items-center justify-between">
              <div className="w-full relative flex justify-between lg:w-auto px-4 lg:static lg:block lg:justify-start">
                <Link href="/">
                  <a className="text-sm font-bold leading-relaxed inline-block mr-4 py-2 shamrockspace-nowrap uppercase text-shamrock">
                    <Image src={Logo} alt="Booklinik+ Logo"></Image>
                  </a>
                </Link>
                <button
                  className="text-shamrock cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
                  type="button"
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  <FaBars />
                </button>
              </div>
              <div
                className={
                  "lg:flex flex-grow items-center bg-white lg:bg-transparent shadow lg:shadow-none p-5 absolute top-[calc(100%+1rem)] lg:static right-6 bg-white z-30 lg:bg-transparent" +
                  (menuOpen ? " flex" : " hidden")
                }
              >
                <ul className="flex flex-col items-center lg:flex-row list-none lg:ml-auto transition">
                  <NavigationItem title="Opérations" target="/operations" />
                  <NavigationItem title="Cliniques" target="/cliniques" />
                  <NavigationItem title="Destinations" target="/destinations" />
                  <div
                    className="relative"
                    onMouseEnter={() => setDropdownVisibility(true)}
                    onMouseLeave={() => setDropdownVisibility(false)}
                  >
                    <NavigationItem title="À propos" target="/valeurs" />

                    <AnimatePresence>
                      {dropdownVisibility && (
                        <motion.div
                          initial={{ opacity: 0, y: "-6px" }}
                          animate={{ opacity: 1, y: "0px" }}
                          exit={{ opacity: 0, y: "-6px" }}
                          className="absolute p-3 bg-white border border-shamrock rounded w-full gap-2 flex flex-col min-w-max shadow"
                        >
                          <Link href="/valeurs" className="">
                            <a className="w-full p-2 transition hover:cursor-pointer hover:bg-gray-100 rounded">
                              À propos de nous
                            </a>
                          </Link>
                          <Link href="/etapes">
                            <a className="w-full p-2 transition hover:cursor-pointer hover:bg-gray-100 rounded">
                              Les étapes clé
                            </a>
                          </Link>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <NavigationItem
                    title="Offres Spéciales"
                    extraStyle="text-shamrock"
                    target="/offres"
                  />
                  <li className="hidden lg:block">|</li>
                  {loading && (
                    <div className="ml-3 animate-spin">
                      <VscLoading />
                    </div>
                  )}
                  {user != null && loading == false ? (
                    <>
                      <NavigationItem
                        title="Espace client"
                        target="/dashboard"
                      />
                    </>
                  ) : (
                    <NavigationItem title="Connexion" target="/login" />
                  )}
                </ul>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}
