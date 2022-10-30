import { Header } from "core/components/app/header/header.js";
import { LeftSideMenu } from "core/components/app/left-side-menu/left-side-menu.comp.js";
import { SsrHead } from "core/components/ssr-head/ssr-head.comp.js";
import { useEffect, useState } from "react";
import { matchPath, useLocation } from "react-router";
import { Route, Routes } from "react-router-dom";
import { setDocHeader } from "./app.redux.js";
import { NO_HEADER_PATHS } from "./const.js";
import { DocHeader } from "./core/components/app/doc-header/doc-header.comp.js";
import { Footer } from "./core/components/app/footer/footer.comp.js";
import LazyRoute from "./core/components/lazy-route/lazy-route.component.js";
import { Toaster } from "./core/components/toaster/toaster.comp.js";
import { useAppDispatch, useAppSelector } from "./core/hook.js";
import { CompModule } from "./core/models/route.model.js";
import { Routes as PageRoutes } from "./routes.js";

export function App(props: AppProps) {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const pageType = useAppSelector((state) => state.app.pageType);

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
    pageType !== "DOC_PAGE" && dispatch(setDocHeader(undefined));
    window.scrollTo({ top: 0 });
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
    <div className={`page-wrapper ${pageType === "CONTENT_PAGE" && "landing-page"}`}>
      {/* Use SsrHead component to set common Head tags */}
      {process.env.IS_SERVER && <SsrHead />}
      {/* Header and footer should not visible on error page if header/footer is dynamic.
      Why? because may be error page coming because of Header/Footer api */}
      {showHeader && <Header />}
      <div className={pageType === "DOC_PAGE" ? "doc-wrapper" : "cards-section text-center"}>
        <div className="container">
          {pageType === "DOC_PAGE" && <DocHeader />}

          <div className={pageType === "DOC_PAGE" ? "doc-body row" : ""}>
            <div className={pageType === "DOC_PAGE" ? "doc-content col-md-9 col-12 order-1" : ""}>
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
            {pageType === "DOC_PAGE" && <LeftSideMenu />}
          </div>
        </div>
      </div>
      <Toaster />
      {showHeader && <Footer />}
    </div>
  );
}

export interface AppProps {
  module?: CompModule;
  pageProps?: any;
}
