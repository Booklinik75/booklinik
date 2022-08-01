import Link from "next/link";
import Logo from "../public/booklinik-logo.svg";
import Image from "next/image";
import SideBanner from "../public/assets/login.jpeg";
import firebase from "../firebase/clientApp";
import { useRouter } from "next/router";
import { useState } from "react";
import DashboardButton from "../components/DashboardButton";
import * as Yup from "yup";
import { BiError } from "react-icons/bi";
import { checkAuth, serverRedirect } from "utils/ServerHelpers";
import errors from "utils/firebase_auth_errors";
import * as Sentry from "@sentry/browser";
import MD5 from "crypto-js/md5";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";


export const getServerSideProps = async (ctx) => {
  const auth = await checkAuth(ctx);
  if (auth.props.userProfile) return serverRedirect("/dashboard");
 
  return {
    props: {
      auth,
    },
  };
};

const ModalNoSignUp=({
  visible,
  onClose,
  children
  
}) =>{
    const [form, setForm] = useState({
      email: "",
      password:"",
      message: "",
      name: "",
      phoneNumber: "",
      value :"",
    });
   
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formSent, setFormSent] = useState(false);
    const [errors, setErrros] = useState({});
    const [isLoading, setLoading] = useState("idle");
    const router = useRouter();
   {children}
    function WithoutRegistration(){
      const {email,password,message,name,phoneNumber,value}=form
      setLoading("loading");

      const { errors, valid } = validateContactForm(form);
      if (!valid) {
        setLoading("idle");
        setErrros(errors);
        setIsSubmitting(false);
      }   else {
        firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(async (userCredential) => {
          // update current user
          var user = userCredential.user;
  
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
      });
      }
    }

    const handleFormSubmit = (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      WithoutRegistration()
  
   
    };
  
    const handleFormChange = (e) => {
      setForm({
        ...form,
        [e.target.name]:
          e.target.name === "phoneNumber"
            ? e.target.value
                .replace(/[^0-9.]/g, "")
                .replace(/(\..*?)\..*/g, "$1")
                .trim()
            : e.target.value,
      });
      console.log(JSON.stringify(e.target.value)+"=============HandleformChange value modal")
    };
  
    const handlePhoneNumber = (phone) => {
      setForm({
        ...form,
        phoneNumber: `+${phone}`,
      });
      console.log(phone+"=============Handleform tel value modal")
    };
  
  
    const getInitialState = () => {
        const value = "";
        return value;
      };
  
      const [value, setValue] = useState(getInitialState);
  
 

  if (!visible) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center">
    
       
        <div id="contactform" className="py-40" >
    <div
      className="mx-4 xl:mx-auto max-w-7xl py-14 my-10 rounded-xl bg-shamrock grid gric-cols-1 lg:grid-cols-2 gap-10 px-10 text-white placeholder-white"

    >
      <div className="text-white">
        <p className="uppercase text-sm mb-2">Une question ?</p>
        <h2 className="text-4xl mb-2">
          CONSULTATION MEDICALE GRATUITE par nos médecins.
        </h2>
        <h2 className="text-2xl mb-2 mt-4">
          Remplisez le formulaire nous vous contacterons sous 24h.
        </h2>
        <p className="mt-4 mb-2">Par téléphone au</p>
        <Link href="tel:0186653500">
          <a className="hover:underline text-xl font-bold flex items-center">
            +33 1 86 65 35 00
          </a>
        </Link>
      </div>
      <form  onSubmit={handleFormSubmit}>
        <div className="space-y-6">
          {!formSent ? (
            <>
              <div>
                <p className="uppercase text-sm mb-2">Nom</p>
                <input
                  type="text"
                  className={`w-full bg-transparent border-b outline-none placeholder-white ${
                    errors && errors.name ? "border-red-600 " : "border-white"
                  } p-3`}
                  placeholder="Nom"
                  name="name"
                  value={form.name}
                  onChange={handleFormChange}
                />
                {errors && errors.name ? (
                  <span className="text-red-600 text-sm mt-3">
                    {errors.name}
                  </span>
                ) : (
                  ""
                )}
              </div>


              <div
                className={`${
                  errors && errors.phoneNumber ? "error-input" : ""
                }`}
              >
                <p className="uppercase text-sm mb-2">Numéro de téléphone</p>
                <PhoneInput
                  country={"fr"}
                  value={form.phoneNumber}
                  onChange={(phone) => handlePhoneNumber(phone)}
                />
                {errors && errors.phoneNumber ? (
                  <span className="text-red-600 text-sm mt-3">
                    {errors.phoneNumber}
                  </span>
                ) : (
                  ""
                )}
              </div>

              <div>
                <p className="uppercase text-sm mb-2">Votre email</p>
                <input
                  type="email"
                  className={`w-full bg-transparent border-b outline-none placeholder-white ${
                    errors && errors.email ? "border-red-600 " : "border-white"
                  } p-3`}
                  placeholder="Email"
                  name="email"
                  value={form.email}
                  onChange={handleFormChange}
                />
                {errors && errors.email ? (
                  <span className="text-red-600 text-sm mt-3">
                    {errors.email}
                  </span>
                ) : (
                  ""
                )}
              </div>
              <div>
                <p className="uppercase text-sm mb-2">Mot de passe</p>
                <input
                  type="password"
                  className={`w-full bg-transparent border-b outline-none placeholder-white "border-white"
                  p-3`}
                  placeholder="mdp"
                  name="password"
                  value={form.password}
                  onChange={handleFormChange}
                />
           
              </div>

             

              <div>
                <p className="uppercase text-sm mb-2">Votre message</p>
                <textarea
                  className={`w-full h-24 bg-white bg-opacity-10 border-b outline-none placeholder-white ${
                    errors && errors.message
                      ? "border-red-600 "
                      : "border-white"
                  } p-3`}
                  placeholder="J&lsquo;ai une question à propos de ..."
                  value={form.message}
                  name="message"
                  onChange={handleFormChange}
                ></textarea>
                {errors && errors.message ? (
                  <span className="text-red-600 text-sm mt-3">
                    {errors.message}
                  </span>
                ) : (
                  ""
                )}


              </div>
              <div className="w-full">
                <button
                  type="submit"
                  className="float-right rounded bg-white bg-opacity-10 p-3 transition hover:bg-opacity-100 hover:text-shamrock"
          
                >
                  Envoyer
                </button>
                <button
                  type="submit"
                  className="float-right rounded bg-white bg-opacity-10 p-3 transition hover:bg-opacity-100 hover:text-shamrock"
                  onClick={onClose}
                >
                  Fermer
                </button>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-center">
                Votre message a bien été envoyé. Nous vous recontacterons dans
                les plus brefs délais.
              </p>
            </div>
          )}
        </div>
      </form>
    </div>
  </div>
        </div>
   
  )
}

export default  ModalNoSignUp;