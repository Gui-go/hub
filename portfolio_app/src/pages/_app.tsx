// import '../styles/globals.css';
// import type { AppProps } from 'next/app';
// import Navbar from '../components/layout/Navbar';
// import Footer from '../components/layout/Footer';

// export default function App({ Component, pageProps }: AppProps) {
//   return (
//     <div className="min-h-screen flex flex-col">
//       <Navbar />
//       <main className="flex-grow">
//         <Component {...pageProps} />
//       </main>
//       <Footer />
//     </div>
//   );
// }


// import { useEffect } from "react";
// import type { AppProps } from "next/app";
// import { useRouter } from "next/router";
// import * as gtag from "../lib/gtag";
// import '../styles/globals.css';
// import Navbar from '../components/layout/Navbar';
// import Footer from '../components/layout/Footer';

// export default function App({ Component, pageProps }: AppProps) {
//   const router = useRouter();

//   useEffect(() => {
//     const handleRouteChange = (url: string) => {
//       gtag.pageview(url);
//     };

//     router.events.on("routeChangeComplete", handleRouteChange);
//     return () => router.events.off("routeChangeComplete", handleRouteChange);
//   }, [router.events]);

//   return (
//     <div className="min-h-screen flex flex-col">
//       <Navbar />
//       <main className="flex-grow">
//         <Component {...pageProps} />
//       </main>
//       <Footer />
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import Script from "next/script";
import * as gtag from "../lib/gtag";
import '../styles/globals.css';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import CookieConsentBanner from "../components/CookieConsentBanner";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent") === "true";
    setHasConsent(consent);
  }, []);

  useEffect(() => {
    if (!hasConsent) return;

    const handleRouteChange = (url: string) => {
      gtag.pageview(url);
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => router.events.off("routeChangeComplete", handleRouteChange);
  }, [router.events, hasConsent]);

  return (
    <>
      {/* Conditionally load GA script only if consent is given */}
      {hasConsent && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
            strategy="afterInteractive"
          />
          <Script id="gtag-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gtag.GA_TRACKING_ID}', {
                page_path: window.location.pathname,
              });
            `}
          </Script>
        </>
      )}

      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Component {...pageProps} />
        </main>
        <Footer />
      </div>

      {/* Show banner only if not accepted */}
      <CookieConsentBanner />
    </>
  );
}
