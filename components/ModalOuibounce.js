import {React,useState} from 'react'
import Link from 'node_modules/next/link';
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import moment from "moment";
import * as Sentry from "@sentry/browser";
import validateModalOuibounce from 'utils/validateModalOuibounce';

const ModalOuibounce = (props) => {
    const [form, setForm] = useState({
        email: "",
        firstname: "",
        lastname: "",
        phoneNumber: "",
        message:""
      });
      const [isSubmitting, setIsSubmitting] = useState(false);
      const [formSent, setFormSent] = useState(false);
      const [errors, setErrros] = useState({});

      const handleFormSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
    
        const { errors, valid } = validateModalOuibounce(form);
        if (!valid) {
          setErrros(errors);
          setIsSubmitting(false);
        } else {
          fetch("/api/mail", {
            method: "post",
            body: JSON.stringify({
              recipient: "info@booklinik.com",
              templateId: "d-6b9ed961cfdc44228824603584a8b740",
              dynamicTemplateData: {
                    email: form.email,
                    firstname: form.firstname,
                    lastname: form.lastname,
                    phoneNumber: form.phoneNumber,
                    datetime: moment(new Date()).format("LLLL"),
                  
                  
              },
            }),
          })
            .then(() => {
              setFormSent(true);
    
              fetch("/api/mail", {
                method: "post",
                body: JSON.stringify({
                  recipient: form.email,
                  templateId: "d-57cbc54b5ac345beb1bfc6509381ccee",
                  dynamicTemplateData: {
                    email: form.email,
                    firstname: form.firstname,
                    lastname: form.lastname,
                    phoneNumber: form.phoneNumber,
                    datetime: moment(new Date()).format("LLLL"),
                    
                  
                  },
                }),
              });
            })
            .catch((error) => {
              Sentry.captureException(error);
            })
            .finally(() => {
              setIsSubmitting(false);
              setErrros({});
            });
        }
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
      };
    
      const handlePhoneNumber = (phone) => {
        setForm({
          ...form,
          phoneNumber: `+${phone}`,
        });
      };



      if (!props.shouldDisplay) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50 overflow-auto">
    <div id="contactform" className="py-40 mt-15 	absolute ">
       <div className="mx-4  xl:mx-auto  py-14 my-10 rounded-xl bg-shamrock grid gric-cols-1  gap-0 px-10 text-white placeholder-white ">
          <div className="space-y-6 h-full">
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
           
             <form onSubmit={handleFormSubmit}>
            <div className="space-y-6">
            {!formSent ? (
            <>
              <div>
                <p className="uppercase text-sm mb-2">Prénom</p>
                <input
                  type="text"
                  className={`w-full bg-transparent border-b outline-none placeholder-white ${
                    errors && errors.firstname ? "border-red-600 " : "border-white"
                  } p-3`}
                  placeholder="Prénom"
                  name="firstname"
                  value={form.firstname}
                  onChange={handleFormChange}
                />
                {errors && errors.firstname ? (
                  <span className="text-red-600 text-sm mt-3">
                    {errors.firstname}
                  </span>
                ) : (
                  ""
                )}
              </div>
              <div>
                <p className="uppercase text-sm mb-2">Nom de famille</p>
                <input
                  type="text"
                  className={`w-full bg-transparent border-b outline-none placeholder-white ${
                    errors && errors.lastname ? "border-red-600 " : "border-white"
                  } p-3`}
                  placeholder="Prénom"
                  name="lastname"
                  value={form.lastname}
                  onChange={handleFormChange}
                />
                {errors && errors.lastname ? (
                  <span className="text-red-600 text-sm mt-3">
                    {errors.lastname}
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

             
              <div className="flex-wrap ">
                <button
                  type="submit"
                  className="mx-2 float-right rounded bg-white bg-opacity-10 border border-white-500 px-5 py-3 transition hover:bg-opacity-100 hover:text-shamrock"
                  disabled={isSubmitting}
                >
                  Envoyer
                </button>
                <button
                   type="submit"
                   className="mx-1 float-right rounded bg-white  text-gray-500  border border-gray-500 px-5 py-3 transition hover:bg-gray-500 hover:text-white"
                   onClick={props.handleDismiss}
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
              <button
                   type="submit"
                   className="mx-1 float-right rounded bg-white  text-gray-500  border border-gray-500 px-5 py-3 transition hover:bg-gray-500 hover:text-white"
                   onClick={props.handleDismiss}
                   >
                Fermer
                </button>
            </div>
          )}
            </div>
            </form>
          </div>
       </div>
    </div>
 </div>
  )
  }

  export default ModalOuibounce;