import spinner from "assets/images/Spinner-1s-200px.svg";
import { Helmet } from "react-helmet";

/**
 * Use this component to set common head tags like meta, link and title
 */
export function SsrHead() {
  const serviceWorker = `
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/service-worker.js", { type: "module" })
        .then((registration) => {
          console.log("SW registered: ", registration);
        })
        .catch((registrationError) => {
          console.log("SW registration failed: ", registrationError);
        });
    });
  }`;

  return (
    <Helmet>
      <title>React SSR Architecture Documentation</title>
      {process.env.ENV === "production" && <script>{`${serviceWorker}`}</script>}
      <meta
        name="description"
        content="Open Source React SSR High Performance Architecture.
      Goal of this architecture to save initial phase development"
      />
      <meta
        name="keywords"
        content="React, ReactJs, ReactJs Server Side Rendering, SSR, React SSR"
      />
      <meta charSet="utf-8" />
      <meta name="theme-color" content="#f8f9fa" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, shrink-to-fit=no, maximum-scale=5"
      />
      <link href={spinner} rel="preload" as="image" />
      {/* <link href={metaJson["ElegantIcons.woff"]} rel="preload" as="font" /> */}
      <link rel="apple-touch-icon" href="/assets/icons/ios/192.png" />
      <link
        href="https://fonts.googleapis.com/css?family=Open+Sans:300italic,400italic,600italic,700italic,800italic,400,300,600,700,800"
        rel="stylesheet"
        type="text/css"
      ></link>
      <body className="body-orange" />
    </Helmet>
  );
}
