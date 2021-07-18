import React from "react";
import Image from "next/image";
import NavigationItem from "./NavigationItem";
import Logo from "../public/booklinik-logo.svg";
import Link from "next/link";
import { FaBars } from "react-icons/fa";

export default function Navigation() {
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <div className="w-full">
      <div className="flex flex-wrap py-2">
        <div className="w-full px-2">
          <nav className="relative flex flex-wrap items-center justify-between px-2 py-2">
            <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
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
                  "lg:flex flex-grow items-center bg-white lg:bg-transparent shadow lg:shadow-none p-5" +
                  (menuOpen ? " flex" : " hidden")
                }
                id="example-navbar-info"
              >
                <ul className="flex flex-col lg:flex-row list-none lg:ml-auto">
                  <NavigationItem title="Opérations" />
                  <NavigationItem title="Cliniques" />
                  <NavigationItem title="Destinations" />
                  <NavigationItem title="Nos valeurs" />
                  <NavigationItem
                    title="Offres Spéciales"
                    extraStyle="text-shamrock"
                  />
                  <NavigationItem title="Connexion" />
                </ul>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}
