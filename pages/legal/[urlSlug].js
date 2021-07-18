import Link from "next/link";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import ContactHelper from "../../components/ContactHelper";

export const getStaticPaths = async () => {
  const res = await fetch("http://localhost:8000/legal");
  const data = await res.json();

  // map data to an array of path objects with params (id)
  const paths = data.map((legal) => {
    return {
      params: { urlSlug: legal.urlSlug.toString() },
    };
  });

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async (context) => {
  const slug = context.params.urlSlug;
  const res = await fetch("http://localhost:8000/legal?urlSlug=" + slug);
  const data = await res.json();

  const resPaths = await fetch("http://localhost:8000/legal");
  const pathData = await resPaths.json();

  return {
    props: {
      legal: data[0],
      paths: pathData,
    },
  };
};

const LegalPage = ({ legal, paths }) => {
  return (
    <div>
      <Navigation />
      <div>
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-10 mx-4 xl:mx-auto max-w-7xl py-12">
          <div className="col-span-6 lg:col-span-2 space-y-2">
            {paths.map((path) => (
              <Link href={"/legal/" + path.urlSlug} key={path.id}>
                <a
                  className={
                    "block hover:underline " +
                    (legal.urlSlug === path.urlSlug
                      ? "font-semibold text-shamrock"
                      : "")
                  }
                >
                  {path.navTitle}
                </a>
              </Link>
            ))}
          </div>
          <div className="col-span-6 lg:col-span-4">
            <h1 className="text-2xl font-semibold mb-6">{legal.pageTitle}</h1>
            <p className="text-justify">{legal.body}</p>
          </div>
        </div>
      </div>
      <ContactHelper />
      <Footer />
    </div>
  );
};

export default LegalPage;
