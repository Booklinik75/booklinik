import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import PhotoBanner from "../components/PhotoBanner";
import Image from "next/image";
import StepDash from "../components/StepDash";
import ContactHelper from "../components/ContactHelper";
import Head from "next/head";

const KeySteps = () => {
  const body =
    "Parce qu'il est important de préparer au mieux votre opération, nous avons listé pour vous vos étapes clés";
  const fileName =
    "https://firebasestorage.googleapis.com/v0/b/booklinik.appspot.com/o/frontendassets%2Fmanuel-moreno-DGa0LQ0yDPc-unsplash%20copie.jpg?alt=media&token=0c8dabb0-60b6-4342-a771-e1f550b3db5e";
  return (
    <div>
      <Head>
        <title>Booklinik | Les étapes clés</title>
      </Head>
      <Navigation />

      <PhotoBanner
        title="Les etapes clés"
        body={body}
        fileName={fileName}
        discover={true}
        fullWidth={true}
      />

      <div className="flex flex-col items-center mb-10" id="content">
        <div className="flex flex-col items-center w-2/3 space-y-10 my-6">
          <p className="text-xs uppercase">1. Premiers pas</p>
          <h2 className="font-bold text-3xl">
            Réservez votre opération et votre voyage
          </h2>
          <p className="text-center w-full lg:w-2/3">
            Remplissez le formulaire avec tous les détails sur
            l&apos;intervention chirurgicale désirée, les dates, la destination
            et l&apos;hotel.
          </p>
        </div>
      </div>

      <StepDash />

      <div className="bg-white py-12">
        <div className="mx-4 xl:mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 items-center gap-10">
          <div className="flex flex-col" id="content">
            <div className="flex flex-col my-6">
              <p className="text-xs uppercase">
                2. L&apos;examen de votre dossier
              </p>
              <h2 className="font-bold text-3xl mb-6 mt-2">
                Nous examinons votre dossier
              </h2>
              <p className="w-full leading-relaxed">
                Les équipes médicale évaluent votre dossier et statuent sur la
                possibilité pour vous d&apos;être opéré. Si la réponse est
                positive votre recevrez : <br />– Le descriptif de votre séjour
                à la clinique <br />– Le descriptif de vos soins
              </p>
            </div>
          </div>
          <div className="text-right">
            <Image
              src="https://firebasestorage.googleapis.com/v0/b/booklinik.appspot.com/o/frontendassets%2Fscott-graham-OQMZwNd3ThU-unsplash%20copie.jpg?alt=media&token=7455e41b-d4b8-481e-9341-2ca39a29ccab"
              alt="TBD"
              width={500}
              height={300}
              objectFit="cover"
              className="rounded-xl"
            />
          </div>
        </div>
      </div>

      <StepDash />

      <div className="bg-white py-12">
        <div className="mx-4 xl:mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 items-center gap-10">
          <div className="text-left">
            <Image
              src="https://firebasestorage.googleapis.com/v0/b/booklinik.appspot.com/o/frontendassets%2Fmargo-brodowicz-KZHhnb6XsQI-unsplash%20copie.jpg?alt=media&token=608f61f8-e864-45f2-aba7-1ae2aee68e5f"
              alt="TBD"
              width={500}
              height={300}
              objectFit="cover"
              className="rounded-xl"
            />
          </div>
          <div className="flex flex-col" id="content">
            <div className="flex flex-col my-6">
              <p className="text-xs uppercase">
                3. L&apos;organisation de votre départ
              </p>
              <h2 className="font-bold text-3xl mb-6 mt-2">
                C&apos;est l&apos;heure du départ
              </h2>
              <p className="w-full leading-relaxed">
                Une fois votre reservation booklinik effectuée, nous organisons
                les modalités de votre séjour dans les meilleures conditions.
              </p>
            </div>
          </div>
        </div>
      </div>

      <StepDash />

      <div className="flex flex-col items-center mb-10" id="content">
        <div className="flex flex-col items-center w-2/3 space-y-10 my-6">
          <p className="text-xs uppercase">
            4. L&apos;équipe dédiée dès votre arrivée
          </p>
          <h2 className="font-bold text-3xl">
            Vous êtes arrivé à destination, et nous nous occupons de tout
          </h2>
          <p className="text-center w-full lg:w-2/3">
            Dès votre arrivée à l&apos;aéroport, booklinik vous propose les
            services de chauffeurs et traducteurs, qui seront à votre
            disposition durant toute la durée de votre séjour.
          </p>
        </div>
      </div>

      <StepDash />

      <div className="bg-white py-12">
        <div className="mx-4 xl:mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 items-center gap-10">
          <div className="flex flex-col" id="content">
            <div className="flex flex-col my-6">
              <p className="text-xs uppercase">5. L&apos;hospitalisation</p>
              <h2 className="font-bold text-3xl mb-6 mt-2">
                Fermez les yeux et laissez vous guider
              </h2>
              <p className="w-full leading-relaxed">
                Nous veillerons à votre installation dans la clinique et serons
                présents lors de la visite du médecin. <br />
                Avant l&apos;intervention, nous nous assurerons votre bien-être
                en vous offrant le meilleur service.
              </p>
            </div>
          </div>
          <div className="text-right">
            <Image
              src="https://firebasestorage.googleapis.com/v0/b/booklinik.appspot.com/o/frontendassets%2Fpaul-postema-mr0Dp231IEw-unsplash%20copie.jpg?alt=media&token=4abd2ea0-e874-429a-8638-cedd91b0851f"
              alt="TBD"
              width={500}
              height={300}
              objectFit="cover"
              className="rounded-xl"
            />
          </div>
        </div>
      </div>

      <StepDash />

      <div className="bg-white py-12">
        <div className="mx-4 xl:mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 items-center gap-10">
          <div className="text-left">
            <Image
              src="https://firebasestorage.googleapis.com/v0/b/booklinik.appspot.com/o/frontendassets%2Folga-guryanova-tMFeatBSS4s-unsplash%20copie.jpg?alt=media&token=f31744ba-91b1-485d-83cf-84d472c4619b"
              alt="TBD"
              width={500}
              height={300}
              objectFit="cover"
              className="rounded-xl"
            />
          </div>
          <div className="flex flex-col" id="content">
            <div className="flex flex-col my-6">
              <p className="text-xs uppercase">6. La convalescence</p>
              <h2 className="font-bold text-3xl mb-6 mt-2">
                L&apos;heure du repos à sonné
              </h2>
              <p className="w-full leading-relaxed">
                Après l&apos;intervention, vous serez transféré dans
                l&apos;hotel que vous aurez choisi au préalable sur
                booklinik.com. Votre chauffeur vous conduira à la clinique pour
                votre consultation post-opératoire.
              </p>
            </div>
          </div>
        </div>
      </div>

      <StepDash />

      <div className="flex flex-col items-center mb-10" id="content">
        <div className="flex flex-col items-center w-2/3 space-y-10 my-6">
          <p className="text-xs uppercase">7. Le retour</p>
          <h2 className="font-bold text-3xl">Lorem ipsum</h2>
          <p className="text-center w-full lg:w-2/3">
            À la fin de votre séjour médical, un représentant booklinik vous
            accompagnera jusqu&apos;à l&apos;aéroport et s&apos;assurera de
            votre embarquement.
          </p>
        </div>
      </div>

      <StepDash />
      <div className="bg-white py-12">
        <div className="mx-4 xl:mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 items-center gap-10">
          <div className="flex flex-col" id="content">
            <div className="flex flex-col my-6">
              <p className="text-xs uppercase">8. Le suivi</p>
              <h2 className="font-bold text-3xl mb-6 mt-2">
                Nous vous accompagnons
              </h2>
              <p className="w-full leading-relaxed">
                Dès votre retour, vous disposerez de tous les éléments de
                contact pour faire part de vos remarques ou de vos questions
                suite à l&apos;intervention.
              </p>
            </div>
          </div>
          <div className="text-right">
            <Image
              src="https://firebasestorage.googleapis.com/v0/b/booklinik.appspot.com/o/frontendassets%2Ftoa-heftiba-4xe-yVFJCvw-unsplash%20copie.jpg?alt=media&token=3bf63796-d012-4606-9dbf-14008d155110"
              alt="TBD"
              width={500}
              height={300}
              objectFit="cover"
              className="rounded-xl"
            />
          </div>
        </div>
      </div>

      <ContactHelper />
      <Footer />
    </div>
  );
};

export default KeySteps;
