import Script from 'next/script';

export default function Dashboard() {
  return (
    <>
      <link rel="alternate" hreflang="fr" href="https://www.booklinik.com" />
      <link rel="alternate" hreflang="en" href="https://en.booklinik.com" />
      <link rel="alternate" hreflang="tr" href="https://tr.booklinik.com" />
      <link rel="alternate" hreflang="es" href="https://es.booklinik.com" />
      <Script type="text/javascript" src="https://cdn.weglot.com/weglot.min.js" />
      <Script>
        {`
          Weglot.initialize({
              api_key: 'wg_48e609e9c8a8b4e4ecb5962b26f12a824'
          });
        `}
      </Script>
    </>
  );
}