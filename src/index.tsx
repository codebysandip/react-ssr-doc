import { createContextClient } from "core/functions/create-context.js";
import { CompModule } from "core/models/route.model.js";
import { Provider } from "react-redux";
import { useLocation } from "react-router";
import { useParams, useSearchParams } from "react-router-dom";
import { ssrConfig } from "src/react-ssr.config.js";
import { App } from "./app.js";

import { useRef } from "react";
import { ContextProvider } from "./core/contexts/context-data.context.js";
import { configureHttpClient } from "./core/functions/configure-http-client.js";
import { ContextDataWithStore } from "./core/models/context-with-store.model.js";
import { ContextData } from "./core/models/context.model.js";
import { AppStore } from "./redux/create-store.js";
import "./style.scss";

configureHttpClient();

export default function ReactSsrApp(props: ReactSsrAppProps) {
  const isFirstRendering = useRef<boolean>(true);
  const store = useRef<AppStore | null>(null);
  const location = useLocation();
  const searchParams = useSearchParams();
  const params = useParams();

  const ctx: ContextData = process.env.IS_SERVER
    ? (props.ctx as ContextData)
    : createContextClient(location, searchParams[0], params as Record<string, string>);

  if (!process.env.IS_SERVER) {
    if (isFirstRendering.current) {
      isFirstRendering.current = false;
      // ssrConfig.configureStore already called on server
      // before creating it on client check code should running on client
      // if we will again call here then new store will get created and we will lost page data
      if (ssrConfig.configureStore) {
        // this will create store and will save store object in ctx for future use
        ssrConfig.configureStore(props.module, props.ctx || ctx);
      }
      store.current = (ctx as ContextDataWithStore).store;
    } else {
      (ctx as ContextDataWithStore).store = store.current as AppStore;
    }
  }

  return (
    <Provider store={(props.ctx as ContextDataWithStore)?.store || store.current}>
      <ContextProvider ctx={ctx}>
        {props.appComp ? props.appComp : <App module={props.module} />}
      </ContextProvider>
    </Provider>
  );
}

interface ReactSsrAppProps {
  module: CompModule;
  /**
   * ctx prop will have value only on SSR
   * on client side it will always be undefined
   */
  ctx?: ContextData;
  /**
   * appComp used here for cypress component testing
   */
  appComp?: React.ReactNode;
}
