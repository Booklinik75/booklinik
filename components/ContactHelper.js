import { useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import * as Sentry from "@sentry/browser";
import moment from "moment";
import { useRouter } from "next/router";
import validateContactForm from "../utils/validateContactForm";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const ContactHelper = () => {
  const [form, setForm] = useState({
    email: "",
    message: "",
    name: "",
    phoneNumber: "",
    operation: "",
    value: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSent, setFormSent] = useState(false);
  const [errors, setErrros] = useState({});
  const templateSendgridId = "d-dfba23955a2547b490f764c0965ecfb1";

  const router = useRouter(); //stop
  function gtag_report_conversion(url) {
    var callback = function () {
      if (typeof url != "undefined") {
        window.location = url;
      }
    };
    gtag("event", "conversion", {
      send_to: "AW-11382787557/3yTwCN3Uy-8YEOWb3rMq",
      event_callback: callback,
    });
    return false;
  }
  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { errors, valid } = validateContactForm(form);
    if (!valid) {
      console.log("__________validation formulaire Fause______________");

      setErrros(errors);
      setIsSubmitting(false);
    } else {
      console.log("__________validation formulaire Vraie______________");
      console.log(form);

      form;

      fetch("/api/mail", {
        method: "post",
        body: JSON.stringify({
          recipient: "info@booklinik.com",
          templateId: templateSendgridId,
          dynamicTemplateData: {
            email: form.email,
            name: form.name,
            phoneNumber: form.phoneNumber,
            datetime: moment(new Date()).format("LLLL"),
            message: form.message,
            path: router.asPath,
            operation: form.operation,
            value: value,
          },
        }),
      })
        .then(() => {
          gtag_report_conversion();
          setFormSent(true);

          /*fetch("/api/mail", {
            method: "post",
            body: JSON.stringify({
              recipient: form.email,
              templateId: "d-dfba23955a2547b490f764c0965ecfb1 ",
              dynamicTemplateData: {
                email: form.email,
                name: form.name,
                phoneNumber: form.phoneNumber,
                datetime: moment(new Date()).format("LLLL"),
                message: form.message,
                operation: form.operation,
                value: value,
              },
            }),
          });*/
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

  const getInitialState = () => {
    const value = "";
    return value;
  };

  const [value, setValue] = useState(getInitialState);

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <div id="contactform" className="py-40">
      <div className="mx-4 xl:mx-auto max-w-7xl py-14 my-10 rounded-xl bg-shamrock grid gric-cols-1 lg:grid-cols-2 gap-10 px-10 text-white placeholder-white">
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
              01 86 65 35 00
            </a>
          </Link>
        </div>
        <form onSubmit={handleFormSubmit}>
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
                    autoFormat={false}
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
                  <p className="uppercase text-sm mb-2">Votre emailss</p>
                  <input
                    type="email"
                    className={`w-full bg-transparent border-b outline-none placeholder-white ${
                      errors && errors.email
                        ? "border-red-600 "
                        : "border-white"
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
                  <label className="uppercase text-sm mb-2">
                    Sélectionnez votre opération
                    <select
                      value={value}
                      onChange={handleChange}
                      className="w-full bg-transparent border-b outline-none placeholder-white  text-xl hover:text-shamrock block hover:bg-gray-100 w-full p-5 py-3 cursor-pointer"
                    >
                      <option value="Greffe de cheveux">
                        Greffe de cheveux
                      </option>
                      <option value="Chirurgie mammaire">
                        Chirurgie mammaire
                      </option>
                      <option value="Chirurgie du nez">Chirurgie du nez</option>
                      <option value="Chirurgie des fesses">
                        Chirurgie des fesses
                      </option>
                      <option value="Chirurgie du visage">
                        Chirurgie du visage
                      </option>
                      <option value="Chirurgie du corps">
                        Chirurgie du corps
                      </option>
                      <option value="Medecine esthétique">
                        Médecine esthétique
                      </option>
                      <option value="Chirurgie de l oeil">
                        Chirurgie de l oeil
                      </option>
                      <option value="Chirurgie dentaires">
                        Chirurgie dentaires
                      </option>
                      <option value="Autre">Autre </option>
                    </select>
                    {value == "Autre" ? (
                      <span className=" text-sm mt-3">
                        <div>
                          <input
                            type="text"
                            className="w-full bg-transparent border-b outline-none placeholder-white py-5"
                            placeholder="Précisez..."
                            name="operation"
                            value={form.operation}
                            onChange={handleFormChange}
                          />
                        </div>
                      </span>
                    ) : (
                      ""
                    )}
                  </label>
                </div>

                <div>
                  <p className="uppercase text-sm mb-2">Votre message</p>
                  <textarea
                    className={`w-full h-24 bg-white bg-opacity-10 border-b outline-none placeholder-whiteborder-white
                     p-3`}
                    placeholder="J&lsquo;ai une question à propos de ..."
                    value={form.message}
                    name="message"
                    onChange={handleFormChange}
                  ></textarea>
                </div>
                <div className="w-full">
                  <button
                    type="submit"
                    className="float-right rounded bg-white bg-opacity-10 p-3 transition hover:bg-opacity-100 hover:text-shamrock"
                    disabled={isSubmitting}
                  >
                    Envoyer
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
  );
};

export default ContactHelper;
