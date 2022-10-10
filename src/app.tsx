import { Header } from "core/components/header/header.js";
import { SsrHead } from "core/components/ssr-head/ssr-head.comp.js";
import { useEffect, useState } from "react";
import { matchPath, useLocation } from "react-router";
import { Route, Routes } from "react-router-dom";
import { NO_HEADER_PATHS } from "./const.js";
import LazyRoute from "./core/components/lazy-route/lazy-route.component.js";
import { LeftSideMenu } from "./core/components/left-side-menu/left-side-menu.comp.js";
import { Toaster } from "./core/components/toaster/toaster.comp.js";
import { useAppDispatch } from "./core/hook.js";
import { CompModule } from "./core/models/route.model.js";
import { Routes as PageRoutes } from "./routes.js";

export function App(props: AppProps) {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const checkHeader = () => {
    let isHeaderVisible = true;
    for (const path of NO_HEADER_PATHS) {
      if (matchPath(path, location.pathname)) {
        isHeaderVisible = false;
        break;
      }
    }
    return isHeaderVisible;
  };
  const [showHeader, setShowHeader] = useState(checkHeader());

  useEffect(() => {
    const isHeaderVisible = checkHeader();
    if (isHeaderVisible !== showHeader) {
      setShowHeader(isHeaderVisible);
    }
  }, [location.pathname]);

  useEffect(() => {
    // ignoring if statement for code coverage as we don't include PWA while testing cypress
    /* istanbul ignore if  */
    if ("serviceWorker" in navigator) {
      // listening onmessage event to receive message from service worker
      navigator.serviceWorker.onmessage = function (evt) {
        const message = JSON.parse(evt.data);

        const isRefresh = message.type === "refresh";

        // check for message type of refresh
        // we enabled api caching in service worker. First api service from cache if available then
        // service worker calls api to fetch response and saves in cache and also return back us via postMessage with type refresh
        if (isRefresh) {
          console.log("serviceWorker updated in background!!", message);
          if (message.extra) {
            dispatch({
              type: message.extra,
              payload: message.data,
            });
          }
        }
      };
    }
  }, []);

  return (
    <div className="page-wrapper">
      {/* Use SsrHead component to set common Head tags */}
      {process.env.IS_SERVER && <SsrHead />}
      {/* Header and footer should not visible on error page if header/footer is dynamic.
      Why? because may be error page coming because of Header/Footer api */}
      {showHeader && <Header />}
      <div className="doc-wrapper">
        <div className="container">
          <div id="doc-header" className="doc-header text-center">
            <h1 className="doc-title">
              <svg
                className="svg-inline--fa fa-paper-plane icon"
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                data-icon="paper-plane"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                data-fa-i2svg=""
              >
                <path
                  fill="currentColor"
                  d="M511.6 36.86l-64 415.1c-1.5 9.734-7.375 18.22-15.97 23.05c-4.844 2.719-10.27 4.097-15.68 4.097c-4.188 0-8.319-.8154-12.29-2.472l-122.6-51.1l-50.86 76.29C226.3 508.5 219.8 512 212.8 512C201.3 512 192 502.7 192 491.2v-96.18c0-7.115 2.372-14.03 6.742-19.64L416 96l-293.7 264.3L19.69 317.5C8.438 312.8 .8125 302.2 .0625 289.1s5.469-23.72 16.06-29.77l448-255.1c10.69-6.109 23.88-5.547 34 1.406S513.5 24.72 511.6 36.86z"
                ></path>
              </svg>
              Quick Start
            </h1>
            <div className="meta">
              <svg
                className="svg-inline--fa fa-clock"
                aria-hidden="true"
                focusable="false"
                data-prefix="far"
                data-icon="clock"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                data-fa-i2svg=""
              >
                <path
                  fill="currentColor"
                  d="M232 120C232 106.7 242.7 96 256 96C269.3 96 280 106.7 280 120V243.2L365.3 300C376.3 307.4 379.3 322.3 371.1 333.3C364.6 344.3 349.7 347.3 338.7 339.1L242.7 275.1C236 271.5 232 264 232 255.1L232 120zM256 0C397.4 0 512 114.6 512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0zM48 256C48 370.9 141.1 464 256 464C370.9 464 464 370.9 464 256C464 141.1 370.9 48 256 48C141.1 48 48 141.1 48 256z"
                ></path>
              </svg>{" "}
              Last updated: June 13th, 2022
            </div>
          </div>
          <div className="doc-body row">
            <div className="doc-content col-md-9 col-12 order-1">
              <div className="content-inner">
                <Routes>
                  {PageRoutes.map((r, idx) => {
                    return (
                      <Route
                        path={r.path}
                        element={
                          <LazyRoute
                            moduleProvider={r.component}
                            module={props.module}
                            {...props}
                          />
                        }
                        key={idx}
                      />
                    );
                  })}
                </Routes>
              </div>
            </div>
            <LeftSideMenu />
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}

export interface AppProps {
  module?: CompModule;
  pageProps?: any;
}
