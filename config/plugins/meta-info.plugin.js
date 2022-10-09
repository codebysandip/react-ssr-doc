import { writeFile } from "fs";
/**
 * MetaInfoPlugin gets hash of main js and css file and
 * saves as json into specified path.
 * Later project can use hash to serve main js and css file
 */
export default class MetaInfoPlugin {
  constructor(options) {
    this.options = { path: "meta.json", ...options };
    this.metaInfo = {};
  }

  apply(compiler) {
    compiler.hooks.assetEmitted.tap(
      this.constructor.name,
      (file, { content, source, outputPath, compilation, targetPath }) => {
        if (file.match(/(style).*(\.css)$/)) {
          this.metaInfo.mainStyle = "/" + file;
        } else if (file.match(/^(client).*(\.js)$/)) {
          this.metaInfo.mainJs = "/" + file;
        } else if (file.match(/.*(.chunk.css)$/)) {
          if (!this.metaInfo.chunkCss) {
            this.metaInfo.chunkCss = {};
          }
          const splitted = file.split(".");
          const pathParts = splitted[0].split("/");
          this.metaInfo.chunkCss[pathParts[pathParts.length - 1]] = "/" + file;
        }
      },
    );

    compiler.hooks.done.tap(this.constructor.name, () => {
      const json = JSON.stringify(this.metaInfo);
      return new Promise((resolve, reject) => {
        writeFile(this.options.path, json, "utf8", (error) => {
          if (error) {
            reject(error);
            return;
          }
          resolve();
        });
      });
    });
  }
}
