import Head from "next/head";
import Navigation from "../components/Navigation";

export default function Home() {
  return (
    <div className="container mx-auto my-10 max-w-7xl">
      <Head>
        <title>Booklinik</title>
        <meta name="description" content="uwu" />
      </Head>

      <Navigation />
    </div>
  );
}
