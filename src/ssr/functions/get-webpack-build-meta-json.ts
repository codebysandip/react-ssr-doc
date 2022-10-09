import { existsSync, readFileSync } from "node:fs";
import { join } from "path";

/**
 * Get hash of main js and css of webpack build.
 * This hash generated by MethInfoPlugin (config/meta-info.plugin.js)
 * @returns Hash of main css and js
 */
export function getWebpackBuildMetaJson(): MetaJson {
  let metaJsonStr = "";
  const path = join(process.cwd(), "build/meta.json");
  if (existsSync(path)) {
    metaJsonStr = readFileSync(path, { encoding: "utf8" });
  } else {
    throw new Error(`meta.json not found at path: ${path}`);
  }
  if (metaJsonStr) {
    try {
      return JSON.parse(metaJsonStr) as MetaJson;
    } catch {
      throw new Error(`Invalid meta.json at path ${path}`);
    }
  } else {
    throw new Error("Empty meta.json");
  }
}

export interface MetaJson {
  mainJs: string;
  mainStyle: string;
  chunkCss: Record<string, string>;
}
