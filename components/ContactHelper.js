import { useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import * as Sentry from "@sentry/browser";
import moment from "moment";
import { useRouter } from "next/router";

const ContactHelper = () => {
  const [form, setForm] = useState({
    email: "",
    message: "",
  });

  const router = useRouter();

  const handleFormSubmit = (e) => {
    e.preventDefault();

    fetch("/api/mail", {
      method: "post",
      body: JSON.stringify({
        recipient: "info@booklinik.com",
        templateId: "d-6b9ed961cfdc44228824603584a8b740",
        dynamicTemplateData: {
          email: form.email,
          datetime: moment(new Date()).format("LLLL"),
          message: form.message,
          path: router.asPath,
        },
      }),
    })
      .then(() => {
        toast.success("Message envoyé avec succès.");
      })
      .catch((error) => {
        console.log(error);
        toast.error("Une erreur est survenue.");
        Sentry.captureException(error);
      });
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value.trim() });
  };

  return (
    <div className="mx-4 xl:mx-auto max-w-7xl py-14 my-10 rounded-xl bg-shamrock grid gric-cols-1 lg:grid-cols-2 gap-10 px-10 items-center text-white placeholder-white">
      <div className="text-white">
        <p className="uppercase text-sm mb-2">Une question ?</p>
        <h2 className="text-4xl">
          Nous sommes à votre disposition si vous avez la moindre question.
        </h2>
        <p className="mt-4 mb-2">Par téléphone au</p>
        <Link href="tel:+33 6 78 90 12 34">
          <a className="hover:underline text-xl font-bold flex items-center">
            +33 6 78 90 12 34
          </a>
        </Link>
      </div>
      <form onSubmit={handleFormSubmit}>
        <div className="space-y-6">
          <div>
            <p className="uppercase text-sm mb-2">Votre email</p>
            <input
              type="email"
              className="w-full bg-transparent placeholder-white border-b p-3"
              placeholder="Email"
              name="email"
              value={form.email}
              onChange={handleFormChange}
            />
          </div>
          <div>
            <p className="uppercase text-sm mb-2">Votre message</p>
            <textarea
              className="w-full h-24 bg-white bg-opacity-10 p-3 placeholder-white border-b border-white"
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
            >
              Envoyer mon message
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ContactHelper;
