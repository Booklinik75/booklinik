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
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSent, setFormSent] = useState(false);
  const [errors, setErrros] = useState({});

  const router = useRouter();

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { errors, valid } = validateContactForm(form);
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
            name: form.name,
            phoneNumber: form.phoneNumber,
            datetime: moment(new Date()).format("LLLL"),
            message: form.message,
            path: router.asPath,
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
                name: form.name,
                phoneNumber: form.phoneNumber,
                datetime: moment(new Date()).format("LLLL"),
                message: form.message,
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
      phoneNumber: phone,
    });
  };

  return (
    <div
      className="mx-4 xl:mx-auto max-w-7xl py-14 my-10 rounded-xl bg-shamrock grid gric-cols-1 lg:grid-cols-2 gap-10 px-10 text-white placeholder-white"
      id="contact"
    >
      <div className="text-white">
        <p className="uppercase text-sm mb-2">Une question ?</p>
        <h2 className="text-4xl">
          Nous sommes à votre disposition si vous avez la moindre question.
        </h2>
        <p className="mt-4 mb-2">Par téléphone au</p>
        <Link href="tel:0176350968">
          <a className="hover:underline text-xl font-bold flex items-center">
            01 76 35 09 68
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
              <div className={`${errors && errors.phoneNumber ? "error-input" : ""}`}>
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
                  disabled={isSubmitting}
                >
                  Envoyer mon message
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
  );
};

export default ContactHelper;
