import Link from "next/link";
import Navigation from "../../../components/Navigation";
import Footer from "../../../components/Footer";
import ContactHelper from "../../../components/ContactHelper";
import Head from "next/head";
import Image from "next/image";
import MDEditor from "@uiw/react-md-editor";
import RelatedElement from "../../../components/RelatedSuggestionElement";
import ReactCompareImage from 'react-compare-image';
import {
  getBackEndAsset,
  getOperationCategories,
  getOperationData,
  getRelatedSurgeries,
  getSurgeries,
  getSurgeryData,
  getDoctorSurgeries,
  getAfterBeforeSurgeries
} from "../../../utils/ServerHelpers";

export const getStaticPaths = async () => {
  const surgeryCategories = await getOperationCategories();
  const surgeries = await getSurgeries();

  const paths = [];

  surgeryCategories.map((category) => {
    return surgeries.map((surgery) => {
      return category.slug === surgery.category
        ? paths.push({
            params: { category: category.slug, operation: surgery.slug },
          })
        : "";
    });
  });

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async (context) => {
  const { operation, category } = context.params;
  const surgeryData = await getSurgeryData(operation);
  const categoryData = await getOperationData(category);
  const categoryPhoto = await getBackEndAsset(categoryData.data.photo);
  const relatedSurgeries = await getRelatedSurgeries(surgeryData.data.category);
  const doctorSurgeries= await getDoctorSurgeries(surgeryData.data.name)
  const beforeAfter=await getAfterBeforeSurgeries(surgeryData.data.slug)

  return {
    props: {
      surgeryData,
      categoryPhoto,
      relatedSurgeries,
      doctorSurgeries,
      beforeAfter
    },
    revalidate: 120,
  };
};

const OperationPage = ({ surgeryData, categoryPhoto, relatedSurgeries, doctorSurgeries,beforeAfter }) => {

  return (
    <div className="space-y-6">
      <Head>
        <title>Booklinik | {surgeryData.data.name}</title>
      </Head>
      <Navigation />
      <div className="mx-4 space-y-10">
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-3 lg:col-span-1 bg-gray-100 p-14 space-y-4">
            <h1 className="text-5xl">{surgeryData.data.name}</h1>
            <p className="text-shamrock">
              À partir de {surgeryData.data.startingPrice} €
            </p>
            <pre>{surgeryData.data.excerpt} </pre>
            <Link href="/book" passHref={true}>
              <button className="text-white bg-shamrock rounded px-6 py-3 transition border border-shamrock hover:text-shamrock hover:bg-white">
                Estimez mon séjour
              </button>
            </Link>
          </div>
          <div className="col-span-1 lg:col-span-2 w-full relative">
            <Image
              src={surgeryData.data.photoUrl || categoryPhoto}
              layout="fill"
              objectFit="cover"
              objectPosition="center center"
              alt="TBD"
            />{" "}
          </div>
        </div>
      </div>
      <div className="mx-4 xl:mx-auto max-w-7xl space-y-10">
        <div>
          <MDEditor.Markdown source={surgeryData.data.descriptionBody} />
        </div>
        <div className="space-y-6">
          <h2 className="text-2xl">Opérations similaires</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedSurgeries.map((surgery) => {
               console.log(surgery)
              return (
                <RelatedElement
                  title={surgery.name}
                  target={`/operations/${surgery.category}/${surgery.slug}`}
                  key={surgery.slug}
                  picture={surgery.photoUrl || categoryPhoto}
              //  picture={surgeryData.data.photoUrl || categoryPhoto} // meme photo

                />
              );
            })}
          </div>
         
        </div>
        {doctorSurgeries[0].doctor?(
       
        <div className="space-y-6">
          {console.log(beforeAfter)}
          <h2 className="text-2xl">Médecin</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {doctorSurgeries[0].doctor.map((surgery) => {
              return (
                <RelatedElement
                  title={surgery.name}
                  target={`/operations/${surgery.category}/${surgery.slug}`}
                  key={surgery.id}
                  picture={surgery.photoUrl}
              //  picture={surgeryData.data.photoUrl || categoryPhoto} // meme photo

                />
              );
            })}
          </div>
          
       
        
        </div>
        
        

     ) :(
      ""
    )}
     
     {beforeAfter.length>0?(
       <div className="space-y-6">
          <h2 className="text-2xl">Avant/aprés</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {beforeAfter.map((slide) => {
       
              return (

                  <div key={slide.title} className="col-span-1 rounded relative h-60 transition shadow hover:shadow-lg group">
                   <ReactCompareImage 

                  leftImage={slide.leftimage}
                  rightImage={slide.rightimage} />
                   
                  </div>
           

           )
          })}

        


        </div>

        </div>



     ) :(
      ""
    )}
  
     </div>
    
     <ContactHelper />
     <Footer />
   </div>
 );
};
export default OperationPage;
