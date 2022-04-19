import { useEffect, useState } from "react";
import Image from "next/image";
import NavigationItem from "./NavigationItem";
import Logo from "../public/booklinik-logo.svg";
import Link from "next/link";
import { FaBars, FaChevronRight } from "react-icons/fa";
import { VscLoading } from "react-icons/vsc";
import firebase from "../firebase/clientApp";
import { useAuthState } from "react-firebase-hooks/auth";
import { motion, AnimatePresence } from "framer-motion";
import { FaPhone } from "react-icons/fa";

export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, loading, error] = useAuthState(firebase.auth());
  const [dropdownVisibility, setDropdownVisibility] = useState(false);

  return (
    <div className="w-full z-50 mb-8 top-0 h-20">
      <div className="flex flex-wrap">
        <div className="w-full">
          <nav className="flex flex-wrap items-center justify-between py-2 top-0 fixed w-full z-50 bg-white drop-shadow-sm">
            <div className="xl:container w-full relative px-4 mx-auto flex flex-wrap items-center justify-between">
              <div className="w-full relative flex justify-between lg:w-auto px-4 lg:static lg:block lg:justify-start">
                <Link href="/">
                  <a className="text-sm font-bold leading-relaxed inline-block mr-4 py-2 shamrockspace-nowrap uppercase text-shamrock">
                    <Image src={Logo} alt="Booklinik+ Logo" />
                  </a>
                </Link>
                <button className="  mx-10 image-clignote text-white bg-shamrock rounded-2xl px-6 py-3  transition border border-shamrock hover:text-shamrock hover:bg-white">
              Consultation Gratuite
            </button>
                <button
                  className="text-shamrock cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none "
                  type="button"
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  { menuOpen === false ? (
                  <FaBars />
                  )
                  : (
                    <FaChevronRight />
                  )}

                </button>
              </div>
              <div
                className={
                  "lg:flex flex-grow  lg:items-center bg-white lg:bg-transparent shadow h-[calc(100vh-3.75rem)] lg:h-[unset] w-[70%] lg:w-[unset] max-w-xs lg:max-w-full lg:shadow-none lg:p-5 absolute right-0 top-[calc(100%+.5rem)] lg:static z-30 " +
                  (menuOpen ? " flex" : " hidden")
                }
              >
                <ul className="flex flex-col w-full lg:w-[unset] justify-between lg:justify-start h-[calc(100%-5.5rem)] lg:h-[unset] lg:items-center lg:flex-row list-none lg:ml-auto transition">

                  <div className="flex flex-col lg:flex-row">
                    <NavigationItem title="Opérations" target="/operations" />
                    <NavigationItem title="Cliniques" target="/cliniques" />
                    <NavigationItem
                      title="Destinations"
                      target="/destinations"
                    />
                    <div
                      className="relative"
                      onMouseEnter={() => setDropdownVisibility(true)}
                      onMouseLeave={() => setDropdownVisibility(false)}
                    >
                      <NavigationItem
                        title="À propos"
                        propos
                        target="/a-propos"
                      />

                      <AnimatePresence>
                        {dropdownVisibility && (
                          <motion.div
                            initial={{ opacity: 0, y: "-6px" }}
                            animate={{ opacity: 1, y: "0px" }}
                            exit={{ opacity: 0, y: "-6px" }}
                            className="lg:absolute lg:p-3 bg-white lg:border lg:border-shamrock rounded w-full gap-2 flex flex-col min-w-max gshadow right-0"
                          >
                            <Link href="/a-propos" className="">
                              <a className="w-full p-5 py-3 pl-[4rem] lg:pl-2 lg:p-2 uppercase lg:normal-case text-sm lg:text-base border-b-2 border-gray-100 lg:border-none transition hover:cursor-pointer hover:bg-gray-100 rounded">
                                À propos de nous
                              </a>
                            </Link>
                            <Link href="/etapes">
                              <a className="w-full p-5 py-3 pl-[4rem] lg:pl-2 lg:p-2 uppercase lg:normal-case text-sm lg:text-base border-b-2 border-gray-100 lg:border-none transition hover:cursor-pointer hover:bg-gray-100 rounded">
                                Comment ça marche ?
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
                    <li className="hidden lg:block lg:mt-[0.5rem]">|</li>
                    {loading && (
                      <VscLoading className="ml-3 animate-spin lg:mt-[.5rem]" />
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
                    <li className="hidden lg:block lg:mt-[0.5rem]">| &nbsp;</li>
                    <li className="hidden lg:flex group gap-1 items-center">
                      <Link href="tel:0186653500">
                        <a className="gap-2 text-lg items-center flex transition-colors text-shamrock">
                          <FaPhone className="stroke-1  text-shamrock" />
                        </a>
                      </Link>
                    </li>
                  </div>

                  <div className="flex flex-col-reverse lg:flex-row items-center">
                    <NavigationItem
                      title="Estimation - Réservation"
                      extraStyle="gap-2 text-lg lg:hidden items-center mx-5 lg:mx-0 !justify-center lg:justify-start normal-case !py-3 rounded flex bg-shamrock lg:bg-transparent text-white lg:text-shamrock"
                      target="/book"
                      navBottom
                    />
                    <NavigationItem
                      title=" +33 1 86 65 35 00"
                      extraStyle="gap-2 text-lg  items-center mx-5 lg:mx-0 !justify-center lg:justify-start !py-3 rounded flex bg-shamrock lg:bg-transparent text-white lg:text-shamrock"
                      target="tel:0186653500"
                      navBottom
                      phone
                    />
                    <ul
                      id="language-switcher"
                      className="language-switcher border-0 px-3 py-2 lg:p-0 flex items-center no-underline leading-snug lg:hover:underline font-medium gap-2 text-lg mx-5 lg:mx-0 !justify-center lg:justify-start normal-case rounded lg:bg-transparent text-white lg:text-shamrock"
                    ></ul>
                  </div>
                  {/*
                  <li className="hidden lg:flex group gap-1 items-center">

                    <Link href="tel:0186653500">
                      <a className="gap-2 text-lg items-center flex transition-colors text-shamrock">
                        <FaPhone className="stroke-1  text-shamrock"/>
                        +33 1 86 65 35 00
                      </a>
                    </Link>
                  </li>
                  */}
                </ul>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}
