import { useEffect, useState } from "react";
import "../styles/globals.css";
import { AuthProvider } from "../utils/UserContext";
import { BookProvider } from "utils/bookContext";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import { ToastContainer } from "react-toastify";
import Head from "next/head";
import moment from "moment";
import "moment/locale/fr";
import "react-toastify/dist/ReactToastify.css";
import "react-dropdown/style.css";
import Loading from "components/Loading";
import { useRouter } from "node_modules/next/dist/client/router";
import "tippy.js/dist/tippy.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import TagManager from 'react-gtm-module';
import ModalOuibounce from "components/ModalOuibounce";
import Script from 'next/script'
moment.locale("fr");

function BooklinikClient({ Component, pageProps }) {
  const router = useRouter();

  const [loadingAnimation, setLoadingAnimation] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const handleOnClose= () => {
    
    setShowModal(false);

  };

  useEffect(() => {
    setTimeout(() => {
      setShowModal(true);
  }, 20000);
  }, []);


  const booking={
    surgeries: [
      {
        surgeryCategory: "",
        surgeryCategoryName: "",
        surgery: "",
        surgeryPrice: 0,
        surgeryName: "",
        surgeryMinDays: 0,
        cities: [],
      },
    ],
    startDate: new Date(),
    endDate: "",
    totalSelectedNights: 0,
    extraTravellers: 0,
    extraChilds: 0,
    extraBabies: 0,
    totalExtraTravellersPrice: 0,
    city: "",
    hotel: "",
    hotelPrice: 0,
    hotelPhotoLink: "",
    hotelName: "",
    hotelRating: "",
    hotelId: "",
    room: "",
    roomName: "",
    roomPrice: 0,
    roomPhotoLink: "",
  
  }

  
 
  useEffect(() => {
    window.$crisp = [];
    window.CRISP_WEBSITE_ID = "ab422553-9bcf-4ce4-ac32-d53b0d6e3b6b";
    (() => {
      const d = document;
      const s = d.createElement("script");
      s.src = "https://client.crisp.chat/l.js";
      s.async = 1;
      d.getElementsByTagName("body")[0].appendChild(s);
    })();

    // axeptio
    window.axeptioSettings = {
      clientId: process.env.NEXT_PUBLIC_AXEPTIO_CLIENT_ID,
      cookiesVersion: process.env.NEXT_PUBLIC_AXEPTIO_COOKIES_VERSION,
    };

    (function (d, s) {
      var t = d.getElementsByTagName(s)[0],
        e = d.createElement(s);
      e.async = true;
      e.src = "https://static.axept.io/sdk-slim.js";
      t.parentNode.insertBefore(e, t);
    })(document, "script");

    // weglot
    function handleWeglot(d, s) {
      var t = d.getElementsByTagName(s)[0],
        e = d.createElement(s);

      e.async = true;
      e.src = "https://cdn.weglot.com/weglot.min.js";
      setTimeout(() => {});
      e.onload = () => {
        Weglot.initialize({
          api_key: "wg_48e609e9c8a8b4e4ecb5962b26f12a824",
        });

        const getAllLanguageSwitch = document.querySelectorAll(
          ".language-switcher-container"
        );

        function handleWeglotSwitcher() {
          var myDiv = document.getElementById("language-switcher");

          if (myDiv) {
            var availableLanguages = Weglot.options.languages
              ?.map(function (language) {
                return language.language_to;
              })
              .concat(Weglot.options.language_from);

            var selectList = document.createElement("ul");
            myDiv.appendChild(selectList);

            var currentLang = Weglot.getCurrentLang();
            var currentLangguage = document.createElement("div");
            currentLangguage.classList.add("language-switcher-container");
            currentLangguage.onclick = () =>
              selectList.classList.toggle("show");
            currentLangguage.innerHTML = `
              <div>
              <img
                src="https://flagcdn.com/w20/${
                  currentLang === "en" ? "gb" : currentLang
                }.png"
              /> ${Weglot.getLanguageName(currentLang)}
              </div>
              <svg width="10" height="10" viewBox="0 0 37 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 2L18.5 18.5L35 2" stroke="#33C383" stroke-width="8" stroke-linecap="round"/>
              </svg>

              `;
            myDiv.appendChild(currentLangguage);

            //Create and append the options
            for (var i = 0; i < availableLanguages?.length; i++) {
              var lang = availableLanguages[i];
              console.log(lang);

              var li = document.createElement("li");
              li.classList.add("list-switcher");
              li.dataset.lang = lang;
              li.innerHTML += `<img
              src="https://flagcdn.com/w20/${lang === "en" ? "gb" : lang}.png"
            /> ${Weglot.getLanguageName(lang)}`;
              if (lang === currentLang) {
                li.selected = "selected";
              }
              selectList.appendChild(li);
            }

            const allSwitchers = document.querySelectorAll(".list-switcher");
            allSwitchers.forEach((switcher) =>
              switcher.addEventListener("click", function () {
                Weglot.switchTo(this.getAttribute("data-lang"));
                selectList.classList.remove("show");
              })
            );

            Weglot.on("languageChanged", function (lang) {
              const langName = Weglot.getLanguageName(lang);
              console.log(langName);
              currentLangguage.innerHTML = `
              <div>
              <img
                src="https://flagcdn.com/w20/${lang === "en" ? "gb" : lang}.png"
              /> ${langName}
              </div>
              <svg width="10" height="10" viewBox="0 0 37 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 2L18.5 18.5L35 2" stroke="#33C383" stroke-width="8" stroke-linecap="round"/>
              </svg>

              `;
            });
          }
        }

        if (window.location.pathname === "/") {
          Weglot.on("initialized", handleWeglotSwitcher);
        } else {
          if (getAllLanguageSwitch.length < 1) {
            handleWeglotSwitcher();
          }
        }

        // if(window.loca)
      };
      t.parentNode.insertBefore(e, t);
    }
    handleWeglot(document, "script");

    // check if there is localStorage for book when user not logged in
    if (
      router.pathname.split("/")[1] !== "signup" &&
      router.query.i === "anonBooking" &&
      localStorage.getItem("bookBooklinik")
    ) {
      localStorage.removeItem("bookBooklinik");
    }
    // set loading animation each page loaded
    const handleStart = () => setLoadingAnimation(true);
    const handleComplete = () => setLoadingAnimation(false);
    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    //Google TagManager

    const tagManagerArgs = {
        gtmId: 'GTM-NGCD8B7'
    }

    TagManager.initialize(tagManagerArgs)

    // Cleanup event listeners
    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);
   
  return (
    <>
     
      <AuthProvider>
       
        <BookProvider>
          <Head>
            <link
              rel="apple-touch-icon"
              sizes="180x180"
              href="/apple-touch-icon.png"
            />
            <link
              rel="icon"
              type="image/png"
              sizes="32x32"
              href="/favicon-32x32.png"
            />
            <link
              rel="icon"
              type="image/png"
              sizes="16x16"
              href="/favicon-16x16.png"
            />
            <link rel="manifest" href="/site.webmanifest" />
            <link
              rel="mask-icon"
              href="/safari-pinned-tab.svg"
              color="#33c783"
            />
            <meta name="msapplication-TileColor" content="#33c783" />
            <meta name="theme-color" content="#33c783" />
          </Head>
          <Script id="google-tag-manager" strategy="afterInteractive">
{`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-TB3SWNW');

`}    </Script>
          {loadingAnimation && <Loading />}
          <Component {...pageProps} />
         
       
       
          <ToastContainer />
      
        <ModalOuibounce onClose={handleOnClose} showModal={showModal}/>

         </BookProvider>
        
      </AuthProvider>
    
    </>
  );
}

export default BooklinikClient;
