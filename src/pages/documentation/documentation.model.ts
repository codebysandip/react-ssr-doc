import { Document } from "@contentful/rich-text-types";
import { NavigationLink } from "src/core/components/app/left-side-menu/left-side-menu.model.js";

export interface DocPageData {
  title: string;
  content: Document;
  lastUpdated: string;
  seo: {
    description: string;
    title: string;
  };
  nextPageLink?: NavigationLink;
}
