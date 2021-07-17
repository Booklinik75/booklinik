import Link from "next/link";
import Image from "next/image";
import Logo from "../public/booklinik-logo.svg";
import {
  FaInstagram,
  FaFacebookSquare,
  FaYoutube,
  FaWhatsapp,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-100 p-10 mt-20">
      <div className="mx-4 xl:mx-auto max-w-7xl space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
          <div className="col-span-2">
            <Image src={Logo}></Image>
            <p className="w-full sm:w-2/3 font-bold">
              Estimez et réservez votre voyage médical sur mesure, en quelques
              clics.
            </p>
          </div>
          <div className="flex flex-col text-sm space-y-2">
            <p className="uppercase text-sm mb-2">À propos</p>
            <Link href="#">
              <a className="hover:underline">Nos valeurs</a>
            </Link>
            <Link href="#">
              <a className="hover:underline">Notre mission</a>
            </Link>
            <Link href="#">
              <a className="hover:underline">Les étapes clés</a>
            </Link>
            <Link href="#">
              <a className="hover:underline">Les cliniques</a>
            </Link>
          </div>
          <div className="flex flex-col text-sm space-y-2">
            <p className="uppercase text-sm mb-2">Assistance</p>
            <Link href="#">
              <a className="hover:underline">Nous contacter</a>
            </Link>
            <Link href="#">
              <a className="hover:underline">FAQ</a>
            </Link>
            <Link href="#">
              <a className="hover:underline">Options d'annulation</a>
            </Link>
            <Link href="#">
              <a className="hover:underline">Confidentialité</a>
            </Link>
          </div>
          <div className="col-span-2 space-y-2">
            <p className="uppercase text-sm mb-4">Les opérations</p>
            <div className="flex space-x-5">
              <div className="flex flex-col text-sm space-y-2">
                <Link href="#">
                  <a className="hover:underline">Greffe de poils</a>
                </Link>
                <Link href="#">
                  <a className="hover:underline">Chirurgie mammaire</a>
                </Link>
                <Link href="#">
                  <a className="hover:underline">Chirurgie du corps</a>
                </Link>
                <Link href="#">
                  <a className="hover:underline">Chirurgie des fesses</a>
                </Link>
              </div>
              <div className="flex flex-col text-sm space-y-2">
                <Link href="#">
                  <a className="hover:underline">Chirurgie du visage</a>
                </Link>
                <Link href="#">
                  <a className="hover:underline">Chirurgie de l'oeil</a>
                </Link>
                <Link href="#">
                  <a className="hover:underline">Dentaires</a>
                </Link>
                <Link href="#">
                  <a className="hover:underline text-gray-400">Voir tout +</a>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div>
          <hr />
        </div>
        <div className="flex justify-between">
          <div className="text-xs space-y-2">
            <p className="font-bold">
              &copy; {new Date().getFullYear()} Booklinik
            </p>
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
              <Link href="#">
                <a className="hover:underline">Confidentialité</a>
              </Link>
              <p className="hidden md:block">&bull;</p>
              <Link href="#" className="hover:underline">
                <a className="hover:underline">Conditions générales</a>
              </Link>
              <p className="hidden md:block">&bull;</p>
              <Link href="#" className="hover:underline">
                <a className="hover:underline">Informations d'entreprises</a>
              </Link>
            </div>
          </div>
          <div className="flex space-x-3">
            <Link href="#">
              <div className="cursor-pointer hover:text-shamrock">
                <FaInstagram size={24} />
              </div>
            </Link>
            <Link href="#">
              <div className="cursor-pointer hover:text-shamrock">
                <FaFacebookSquare size={24} />
              </div>
            </Link>
            <Link href="#">
              <div className="cursor-pointer hover:text-shamrock">
                <FaYoutube size={24} />
              </div>
            </Link>
            <Link href="#">
              <div className="cursor-pointer hover:text-shamrock">
                <FaWhatsapp size={24} />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
