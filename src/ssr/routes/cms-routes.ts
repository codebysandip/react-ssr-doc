import * as contentfulRaw from "contentful";
import { removeFieldsKey, removeSysAndMetaData } from "core/functions/remove-sys-and-meta-data.js";
import { Request, Response } from "express";
import { sendResponse } from "../functions/send-response.js";

const contentful = ((contentfulRaw as any).default ?? contentfulRaw) as typeof contentfulRaw;

const contentfulClient = contentful.createClient({
  space: process.env.REACT_CONTENTFUL_SPACE_ID,
  accessToken: process.env.REACT_CONTENTFUL_ACCESS_TOKEN,
  timeout: 5000,
});

export function GetCmsPage(req: Request, resp: Response) {
  const query: Record<string, any> = { content_type: req.params.pageId, include: 4 };
  if (req.query.pageType === "DOC_PAGE") {
    query.content_type = "documentationPage";
    query["fields.navigation.sys.contentType.sys.id"] = "navigation";
    query["fields.navigation.fields.url"] = `/doc/${req.params.pageId}`;
  } else if (req.query.pageType === "CONTENT_PAGE") {
    query.content_type = "contentPage";
    query["fields.navigation.sys.contentType.sys.id"] = "navigation";
    query["fields.navigation.fields.url"] = `/content/${req.params.pageId}`;
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
      sendResponse({ ...entry, lastUpdated }, resp, req);
    })
    .catch((error) => {
      console.error("Contentful error", error);
      resp.status(404).json({});
    });
}

export function GetCmsEntries(req: Request, resp: Response) {
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
}

export function CmsSearch(req: Request, resp: Response) {
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
}
