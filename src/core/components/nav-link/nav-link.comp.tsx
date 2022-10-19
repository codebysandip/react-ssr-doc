import { PropsWithChildren, ReactNode } from "react";
import { Link, LinkProps } from "react-router-dom";
import { NavigationLink } from "../app/left-side-menu/left-side-menu.model.js";

export function NavLink(props: NavLinkProps) {
  const { link, nodeAfterText, nodeBeforeText, ...rest } = props;
  if (link.pageType === "EXTERNAL_PAGE") {
    return (
      <a href={link.url} target="_parent" rel="noopener" {...rest}>
        {link.text}
      </a>
    );
  }
  return (
    <Link to={`${link.url}`} {...rest}>
      {props.children ? (
        props.children
      ) : (
        <>
          {nodeBeforeText}
          {props.text || link.text}
          {nodeAfterText}
        </>
      )}
    </Link>
  );
}

export interface NavLinkProps extends Omit<LinkProps, "to">, PropsWithChildren {
  link: NavigationLink;
  text?: string;
  nodeBeforeText?: ReactNode;
  nodeAfterText?: ReactNode;
}
