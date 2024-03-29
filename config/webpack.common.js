/** @type {import("webpack").Configuration} */

import { CleanWebpackPlugin } from "clean-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import Dotenv from "dotenv-webpack";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import webpack from "webpack";
import nodeExternals from "webpack-node-externals";
import MetaInfoPlugin from "./plugins/meta-info.plugin.js";

import { readFileSync } from "fs";
import { join } from "path";
import { getPath, isLocalFn, isServerFn } from "./functions/helper-functions.js";

/**
 * Common webpack config that will used for production as well as development env
 * @param {Object} env environment key value pair
 * @returns webpack common config
 */
export default function (env, args, isProd = false) {
  const packageJson = JSON.parse(
    readFileSync(join(process.cwd(), "package.json"), { encoding: "utf-8" }),
  );
  const tsconfigJson = JSON.parse(
    readFileSync(join(process.cwd(), "tsconfig.json"), { encoding: "utf-8" }),
  );

  /**
   * Is Build running for Server or Client
   */
  const isServer = isServerFn(env);
  /**
   * Is Build running for local development
   */
  const isLocal = isLocalFn(env);
  /**
   * React client side css, js and other static will go here after build
   */
  const clientBuildPath = getPath("build/public");
  /**
   * Output folder for client as well as server
   */
  const outFolder = isServer ? getPath("build") : clientBuildPath;
  const isDev = env.ENV === "development";
  const isCypress = env.ENV === "cypress";

  const entry = {};
  if (isServer) {
    /**
     * entry.server will produce server.js in build folder
     */
    entry.server = getPath("src/ssr/server.ts");
  } else {
    /**
     * entry.server will produce client.js in build/public folder
     */
    entry.client = [getPath("src/client.tsx")];
    if (isLocal && isDev) {
      entry.client.push(
        "webpack-hot-middleware/client?reload=true&noInfo=true&timeout=10000",
        "/node_modules/react-refresh/runtime.js",
      );
    }
  }
  if ((isLocal || isCypress || process.env.WITH_API) && isServer) {
    entry.testApi = getPath("test-api/test-api.ts");
  }
  /**
   * Add webpack env key and value to webpack DefinePlugin.
   * This will allow to replace process.env.key to value in React and Node
   */
  const definePluginObj = {};
  Object.keys(env).forEach((key) => {
    try {
      definePluginObj[`process.env.${key}`] = JSON.parse(env[key]);
    } catch {
      definePluginObj[`process.env.${key}`] = JSON.stringify(env[key]);
    }
  });

  // get all env which starts from REACT_ from process.env and add in definePluginObj
  // Object.keys(process.env).forEach(key => {
  //   if (key.startsWith("REACT_")) {
  //     definePluginObj[`process.env.${key}`] = JSON.stringify(process.env[key]);
  //   }
  // });

  const miniCssFileName = !(isLocal || isCypress)
    ? "assets/css/style.[contenthash].css"
    : "assets/css/style.css";
  const miniCssChunkName = !(isLocal || isCypress)
    ? "assets/css/[name].[contenthash].chunk.css"
    : "assets/css/[name].chunk.css";
  let slash = "/";
  if (process.platform === "win32") {
    slash = "\\";
  }

  const plugins = [
    new webpack.DefinePlugin(definePluginObj),
    new MiniCssExtractPlugin({
      filename: miniCssFileName,
      chunkFilename: miniCssChunkName,
    }),
    new Dotenv({
      path: `env/.env.${env.ENV}`,
    }),
    new webpack.NormalModuleReplacementPlugin(/.js$/, (resource) => {
      if (resource.context.indexOf("node_modules") !== -1) {
        return;
      }

      const context = resource.context
        .replace(process.cwd(), "")
        .replace(`${slash}node_modules`, "")
        .substring(1)
        .split(slash)[0];
      if (
        packageJson.dependencies[resource.request] ||
        packageJson.devDependencies[resource.request] ||
        context === "config"
      ) {
        return;
      }
      resource.request = resource.request.replace(/.js$/, "");
      if (resource.request.indexOf("redux.imports") !== -1) {
        resource.request = resource.request.replace("redux.imports", "redux.imports.prod");
      }
    }),
  ];

  if (isServer) {
    plugins.push(new CleanWebpackPlugin());
    plugins.push(new Dotenv({
      path: join(process.cwd(), "..", `docker-pull-auto-gd/env/react-ssr-doc/${env.ENV}.env`),
      defaults: true
    }));
  } else {
    plugins.push(
      new webpack.ProvidePlugin({
        process: "process/browser",
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: getPath("favicon.ico"),
            to: join(clientBuildPath, "favicon.ico"),
            force: true,
          },
          {
            from: getPath("robots.txt"),
            to: join(clientBuildPath, "robots.txt"),
          },
          {
            from: getPath("src/manifest.json"),
            to: join(clientBuildPath, "manifest.json"),
          },
          {
            from: getPath("src/assets/images/home"),
            to: join(clientBuildPath, "assets/images/home"),
            toType: "dir",
          },
          {
            from: getPath("src/assets/icons"),
            to: join(clientBuildPath, "assets/icons"),
            toType: "dir",
          },
        ],
      }),
      new MetaInfoPlugin({ path: getPath("build/meta.json") }),
    );
  }

  const alias = {};
  const aliasPaths = tsconfigJson.compilerOptions.paths;
  Object.keys(aliasPaths).forEach((key) => {
    const aliasKey = key.replace("/*", "");
    alias[aliasKey] = getPath(aliasPaths[key][0].replace("/*", ""));
  });

  const config = {
    entry,
    output: {
      filename: `[name]${!(isLocal || isCypress) && !isServer ? ".[contenthash]" : ""}.js`,
      chunkFilename: `[name]${!(isLocal || isCypress) && !isServer ? ".[contenthash]" : ""
        }.chunk.js`,
      path: outFolder,
      publicPath: "/",
      chunkFormat: isServer ? "module" : "array-push",
      assetModuleFilename: `assets/images/[name].[hash][ext]`,
    },
    experiments: {
      outputModule: true,
    },
    watch: isLocal,
    watchOptions: {
      ignored: ["**/node_modules", "**/config", "cypress"],
    },
    resolve: {
      alias: {
        ...alias,
      },
      extensions: [".ts", ".tsx", ".js", ".scss", ".css"],
      fallback: {},
    },
    target: isServer ? "node" : "web",
    externals: isServer
      ? [
        nodeExternals({
          importType: function (moduleName) {
            return moduleName;
          },
        }),
        "react-helmet",
      ]
      : [],
    externalsPresets: { node: isServer },
    module: {
      rules: [
        {
          test: /.(ts|tsx)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: "swc-loader",
              options: {
                parseMap: isCypress,
                jsc: {
                  parser: {
                    syntax: "typescript",
                    dynamicImports: true,
                  },
                  transform: {
                    react: {
                      runtime: "automatic",
                      refresh: isLocal && !isServer && env.ENV !== "cypress",
                    },
                  },
                },
                isModule: true,
                sourceMaps: isLocal || isCypress,
                inlineSourcesContent: isLocal || isCypress,
                module: {
                  type: "es6",
                  lazy: true,
                },
              },
            },
          ],
        },
        {
          test: /\.css$/,
          use: isServer ? ["ignore-loader"] : [MiniCssExtractPlugin.loader, "css-loader"],
        },
        {
          test: /\.s[ac]ss$/i,
          use: isServer
            ? ["ignore-loader"]
            : [
              // Creates `style` nodes from JS strings
              MiniCssExtractPlugin.loader,
              // Translates CSS into CommonJS
              "css-loader",
              // Compiles Sass to CSS
              "sass-loader",
            ],
        },
        {
          test: /\.(png|jpe?g|gif|svg|woff2?)$/i,
          type: "asset/resource",
          generator: {
            emit: !isServer,
          },
        },
      ],
    },
    plugins,
  };
  if (isCypress) {
    // Add instrument code for code coverage
    config.module.rules[0].use.unshift("@jsdevtools/coverage-istanbul-loader");
  }
  return config;
}
