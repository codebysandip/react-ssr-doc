export type PageType = "DOC_PAGE" | "CONTENT_PAGE" | "EXTERNAL_PAGE";

export interface NavigationLink {
  text: string;
  url: string;
  links?: NavigationLink[];
  pageType: PageType;
}

export interface LeftSideMenu {
  links: NavigationLink[];
  title: string;
}
