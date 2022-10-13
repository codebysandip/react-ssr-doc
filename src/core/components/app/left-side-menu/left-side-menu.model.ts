export interface LeftSideMenuLink {
  text: string;
  url: string;
  links?: LeftSideMenuLink[];
  pageType: string;
}

export interface LeftSideMenu {
  links: LeftSideMenuLink[];
  title: string;
}
