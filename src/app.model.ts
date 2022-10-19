import { NavigationLink } from "./core/components/app/left-side-menu/left-side-menu.model.js";

export interface HeaderLink {
  text: string;
  url: string;
}

export interface HeaderData {
  links: HeaderLink[];
}

export interface Footer {
  linkGroups: FooterLinkGroup[];
  sysId: "footer";
}

export interface FooterLinkGroup {
  title: string;
  links: NavigationLink[];
  sysId: "footerLinkGroup";
}
