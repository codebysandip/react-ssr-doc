import { Document } from "@contentful/rich-text-types";

export interface DocPageData {
  title: string;
  content: Document;
  lastUpdated: string;
  seo: {
    description: string;
    title: string;
  };
}
