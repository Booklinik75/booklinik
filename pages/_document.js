import Document, { Html, Head, Main, NextScript } from "next/document";
import Script from "node_modules/next/script";

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head></Head>
        <body>
          <Main />
          <NextScript />
          <noscript
            dangerouslySetInnerHTML={{
              __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NGCD8B7"
            height="0" width="0" style="display:none; visibility:hidden" />`,
            }}
          />
        </body>
      </Html>
    );
  }
}
