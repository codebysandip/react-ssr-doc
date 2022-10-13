import express from "express";
import { join } from "path";

import bodyParser from "body-parser";
import * as contentfulRaw from "contentful";
import helmet from "helmet";
import NodeCache from "node-cache";
import { createRequire } from "node:module";
import { API_URL, LOCAL_API_SERVER } from "src/const.js";
import { configureHttpClient } from "src/core/functions/configure-http-client.js";
import {
  removeFieldsKey,
  removeSysAndMetaData,
} from "src/core/functions/remove-sys-and-meta-data.js";
import { proxyMiddleware } from "src/ssr/middlewares/proxy-middleware.js";
import { getWebpackBuildMetaJson } from "./functions/get-webpack-build-meta-json.js";
import { processRequest } from "./middlewares/process-request.middleware.js";
import { StaticRoute } from "./middlewares/static-files.middleware.js";

const require = createRequire(import.meta.url);
const contentful = ((contentfulRaw as any).default ?? contentfulRaw) as typeof contentfulRaw;
// const contentful = require("contentful");
console.log("contentful!!", contentful);
const contentfulClient = contentful.createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

(global as any).staticPageCache = new NodeCache();
// page components can use metaJson to load page css on before loading of client Js
// this will enable fix the issue of CLS. Without css page will render without styling
global.metaJson = getWebpackBuildMetaJson();

const app = express();
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "script-src": "'self' 'unsafe-inline' 'unsafe-eval'",
        "img-src": "'self' data: https://images.ctfassets.net",
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  }),
);
if (process.env.ENV === "cypress") {
  require("@cypress/code-coverage/middleware/express")(app);
}

configureHttpClient();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// eslint-disable-next-line @typescript-eslint/no-var-requires
if (process.env.IS_LOCAL) {
  // Following code is just for reference
  // If api is not available and you want to return dummy response
  // create a test api in test-api.ts and add here
  // Don't forget to remove proxy otherwise response will always come from test api
  app.get("/api/products", proxyMiddleware(LOCAL_API_SERVER));
}

app.get("*.(css|js|svg|jpg|jpeg|png|woff|woff2)", StaticRoute);

// Tell express for public folder
app.use(express.static(join(process.cwd(), "build/public")));

if (!API_URL) {
  throw new Error(
    "Please add .env file if not available. Add LOCAL_API_SERVER and API_BASE_URL in .env file",
  );
}

app.get("/api/cms/:pageId", (req, resp) => {
  const query: Record<string, any> = { content_type: req.params.pageId, include: 4 };
  if (req.query.pageType === "DOC_PAGE") {
    query.content_type = "documentationPage";
    query["fields.navigation.sys.contentType.sys.id"] = "navigation";
    query["fields.navigation.fields.url"] = `/doc/${req.params.pageId}`;
  }
  contentfulClient
    .getEntries(query)
    .then((entries) => {
      let entry = entries.items[0] as Record<string, any>;
      if (!entry) {
        resp.status(404).json({});
        return;
      }
      const lastUpdated = entry.sys.updatedAt;
      removeSysAndMetaData(entry);
      entry = removeFieldsKey(entry);
      resp.json({ ...entry, lastUpdated });
    })
    .catch((error) => {
      console.error("Contentful error", error);
      resp.status(404).json({});
    });
});

app.get("/api/cms/entries/:contentType", (req, resp) => {
  contentfulClient
    .getEntries({ content_type: req.params.contentType, include: 5 })
    .then((entries: Record<string, any>) => {
      removeSysAndMetaData(entries);
      entries = removeFieldsKey(entries);

      resp.json(entries);
    })
    .catch((error) => {
      console.error("Contentful error", error);
      resp.status(404).json({});
    });
});

app.get("/api/cms/search/:searchText", (req, resp) => {
  contentfulClient
    .getEntries({ query: req.params.searchText, include: 4 })
    .then((entries: Record<string, any>) => {
      removeSysAndMetaData(entries);
      entries = removeFieldsKey(entries);

      resp.json(entries);
    })
    .catch((error) => {
      console.error("Contentful error", error);
      resp.status(204).json({});
    });
});

// proxy to api to tackle cors problem
app.all("/api/*", proxyMiddleware(API_URL));

// Get all request of node server
app.get("*", processRequest());
let PORT = parseInt(process.env.PORT || "5000");
PORT = process.env.IS_LOCAL ? PORT + 1 : PORT;

const startServer = () => {
  app.listen(PORT, () => {
    if (!process.env.IS_LOCAL) {
      console.log(`App listening on port: ${PORT}`);
    }
  });
};
startServer();
