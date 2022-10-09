import express from "express";
import { spawn } from "node:child_process";
import webpack from "webpack";
import WebpackDevMiddleware from "webpack-dev-middleware";
import WebpackHotMiddleware from "webpack-hot-middleware";
import webpackDevConfig from "../config/webpack.dev.js";
import webpackProdConfig from "../config/webpack.prod.js";
import { proxyMiddleware } from "../src/ssr/middlewares/proxy-middleware.js";
import { log } from "./logger.js";

const app = express();
/**
 * flag to check if server build completed for first time only
 */
let isClientBuildCompleted = false;
const PORT = parseInt(process.env.PORT || "5000");

/**
 * start SSR app server with nodemon watch. Whenever their wil be change nodemon will restart
 * SSR node server
 */
const startAppNodeServer = () => {
  spawn(`nodemon --delay 2000ms --watch "build/server.js" --exec "node build/server.js"`, {
    stdio: "inherit",
    shell: true,
  });

  spawn("nodemon --watch build/testApi.js build/testApi.js", {
    stdio: "inherit",
    shell: true,
  });

  // start server only after server build completed
  app.listen(PORT, () => {
    log(`App listening on port ${PORT}`);
  });
};

const env = process.env.ENV;
log(`environment: ${env}`);
let webpackClientConfig: any;
let webpackServerConfig: any;

const baseEnv = { IS_LOCAL: "true", IS_SERVER: "false", ENV: env };
const isDev = env === "development" || env === "cypress";
// webpack client build
if (isDev) {
  webpackClientConfig = webpackDevConfig(baseEnv, {});
} else {
  webpackClientConfig = webpackProdConfig(baseEnv, {});
}
const compiler = webpack(webpackClientConfig, () => {
  console.log("client file changed!!");
  if (!isClientBuildCompleted) {
    isClientBuildCompleted = true;
    if (env === "development") {
      setTimeout(() => {
        startAppNodeServer();
      }, 1000);
    } else {
      startAppNodeServer();
    }
  }
});

// webpack server build
baseEnv.IS_SERVER = "true";
if (isDev) {
  webpackServerConfig = webpackDevConfig(baseEnv, {});
} else {
  webpackServerConfig = webpackProdConfig(baseEnv, {});
}
webpack(webpackServerConfig, () => {
  console.log("server file changed!!");
});

// start webpack dev server for HMR
app.use(
  WebpackDevMiddleware(compiler, {
    publicPath: webpackClientConfig.output.publicPath,
    serverSideRender: true,
    writeToDisk: false,
  }),
);

app.use(
  WebpackHotMiddleware(compiler, {
    heartbeat: 10000,
  }),
);
// Redirect every request to SSR app
app.all("*", proxyMiddleware(`http://localhost:${PORT + 1}`));
