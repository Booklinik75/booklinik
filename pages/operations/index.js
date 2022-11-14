import { useState } from "react";
import PhotoBanner from "../../components/PhotoBanner";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import Head from "next/head";
import OperationCategory from "../../components/OperationCategory";
import Link from "next/link";
import ContactHelper from "../../components/ContactHelper";
import { motion, AnimatePresence } from "framer-motion";
import firebase from "firebase/clientApp";
import {
  getOperationCategories,
  getSurgeries,
  getBackEndAsset,
} from "../../utils/ServerHelpers";
import { IoIosArrowDown } from "react-icons/io";

export const getStaticProps = async (context) => {
  const operationCategories = await getOperationCategories();
  const surgeries = await getSurgeries();

  await Promise.all(
    operationCategories.map(async (operationCategory, index, array) => {
      let image = await getBackEndAsset(operationCategory.photo);
      operationCategories[index].photo = image;
    })
  );

  const categoriesOrder = await firebase
    .firestore()
    .collection("settings")
    .doc("surgeryCategoriesOrdering")
    .get();

  // array that sorts operationCategories based on orderSurgeryCategories
  const sortedOperationCategories = categoriesOrder
    .data()[0]
    .map(
      (category) =>
        operationCategories.filter(
          (obj) => obj.id === Object.keys(category)[0]
        )[0]
    );

  return {
    props: {
      surgeries,
      operationCategories: sortedOperationCategories,
    },
  };
};

const OperationsList = ({
  surgeries,
  operationCategories,
  categoriesOrder,
}) => {
  const fileName =
    "https://firebasestorage.googleapis.com/v0/b/booklinik.appspot.com/o/frontendassets%2Ff3f4e34aca2cab87619cb04c6610b4c7%20copie.jpg?alt=media&token=c402bd27-0ea9-411a-9960-78ce51c29558";
  const [openDropdown, setOpenDropdown] = useState(false);
  const [category, setCategory] = useState(operationCategories[0].name);

  return (
    <div>
      <Head>
        <title>Booklinik | Les opérations</title>
      </Head>
      <Navigation />
      <PhotoBanner
        extraLarge={true}
        fileName={fileName}
        fullWidth={true}
        overlay={true}
        title="Opérations"
      />

      <div className="relative w-full max-w-[20rem]">
        <div
          className="mx-4  text-xl flex items-center  w-full bg-white shadow  bg-opacity-75 space-x-2 space-y-2 justify-between p-5 text-black cursor-pointer"
          onClick={() => setOpenDropdown((openDropdown) => !openDropdown)}
        >
        Recherchez une opération <IoIosArrowDown size="20" className="text-shamrock" />
        {/* category} <IoIosArrowDown size="20" className="text-shamrock" /> */}
        </div>
        <AnimatePresence>
          {openDropdown && (
            <motion.div
              initial={{ opacity: 0, y: "-6px" }}
              animate={{ opacity: 1, y: "0px" }}
              exit={{ opacity: 0, y: "-6px" }}
              className="mx-4  absolute top-[100%] z-20 operation-categories flex flex-col bg-white shadow w-full overflow-y-scroll space-x-2 space-y-2 text-black max-h-[20rem]"
            >
              {operationCategories.map((category) => (
                <div
                  key={`${category.slug}-nav`}
                  onClick={() => {
                    setCategory(category.name);
                    setOpenDropdown(false);
                  }}
                  className="!m-0"
                >
                  <a
                    className="text-black text-xl block hover:bg-gray-100 w-full p-5 py-3 cursor-pointer"
                    href={`#${category.slug}`}
                  >
                    {`${category.name} `}
                  </a>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {operationCategories.map((category) => (
        <div key={category.slug}>
          <OperationCategory operation={category} surgeries={surgeries} />
        </div>
      ))}

      <ContactHelper />
      <Footer />
    </div>
  );
};

export default OperationsList;