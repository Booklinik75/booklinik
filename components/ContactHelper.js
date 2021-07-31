import Link from "next/link";

const ContactHelper = () => {
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
      <form action="">
        <div className="space-y-6">
          <div>
            <p className="uppercase text-sm mb-2">Votre email</p>
            <input
              type="email"
              className="w-full bg-transparent placeholder-white border-b p-3"
              placeholder="Email"
            />
          </div>
          <div>
            <p className="uppercase text-sm mb-2">Votre message</p>
            <textarea
              className="w-full h-24 bg-white bg-opacity-10 p-3 placeholder-white border-b border-white"
              placeholder="J&lsquo;ai une question à propos de ..."
            ></textarea>
          </div>
          <div className="w-full">
            <button className="float-right rounded bg-white bg-opacity-10 p-3 transition hover:bg-opacity-100 hover:text-shamrock">
              Envoyer mon message
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ContactHelper;
