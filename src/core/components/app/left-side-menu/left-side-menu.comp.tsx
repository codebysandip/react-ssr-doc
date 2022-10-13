import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "src/redux/create-store.js";
import "./left-side-menu.comp.scss";
import { LeftSideMenuLink } from "./left-side-menu.model.js";

export function LeftSideMenuComp(props: LeftSideMenuProps) {
  const renderNestedMenu = (links: LeftSideMenuLink[]) => {
    return links.map((link, idx) => {
      if (link.links) {
        return (
          <li className="nav-item has-submenu" onClick={(event) => toggleMenu(event)} key={idx}>
            <Link
              className="nav-link d-flex justify-content-between align-baseline"
              to={`${link.url}`}
            >
              {link.text}
              <i className="arrow_carrot-right"></i>
            </Link>
            <ul className="submenu collapse">{renderNestedMenu(link.links)}</ul>
          </li>
        );
      }
      return (
        <li className="nav-item" key={idx}>
          <Link className="nav-link" to={`${link.url}`}>
            {link.text}
          </Link>
        </li>
      );
    });
  };

  const toggleMenu = (event: React.MouseEvent<HTMLLIElement>) => {
    event.currentTarget.querySelector("ul")?.classList.toggle("show");
    if (event.currentTarget.querySelector("ul")?.classList.contains("show")) {
      event.currentTarget
        .querySelector("i")
        ?.classList.replace("arrow_carrot-right", "arrow_carrot-down");
    } else {
      event.currentTarget
        .querySelector("i")
        ?.classList.replace("arrow_carrot-down", "arrow_carrot-right");
    }
  };
  return (
    <div className="doc-sidebar col-md-3 col-lg-2 col-12 order-0 d-none d-md-flex">
      <div id="doc-nav" className="doc-nav">
        <nav className="sidebar card py-2 mb-4">
          <ul className="nav flex-column" id="nav_accordion">
            {renderNestedMenu(props.leftMenu?.links || [])}
          </ul>
        </nav>
      </div>
    </div>
  );
}

const mapStateToProps = (state: RootState) => ({
  leftMenu: state.app.sideMenu,
});
export const LeftSideMenu = connect(mapStateToProps, {})(LeftSideMenuComp);

interface LeftSideMenuProps extends ReturnType<typeof mapStateToProps> {}
