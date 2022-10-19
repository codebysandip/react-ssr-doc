import React, { useEffect, useRef } from "react";
import { connect } from "react-redux";
import { useLocation } from "react-router";
import { RootState } from "src/redux/create-store.js";
import { NavLink } from "../../nav-link/nav-link.comp.js";
import "./left-side-menu.comp.scss";
import { NavigationLink } from "./left-side-menu.model.js";

export function LeftSideMenuComp(props: LeftSideMenuProps) {
  const location = useLocation();
  const menuRef = useRef<HTMLUListElement>(null);

  const renderNestedMenu = (links: NavigationLink[]) => {
    return links.map((link, idx) => {
      if (link.links) {
        return (
          <li className="nav-item has-submenu" onClick={(event) => toggleMenu(event)} key={idx}>
            <NavLink
              className="nav-link d-flex justify-content-between align-baseline"
              link={link}
              nodeAfterText={<i className="arrow_carrot-right"></i>}
            />
            <ul className="submenu collapse">{renderNestedMenu(link.links)}</ul>
          </li>
        );
      }
      return (
        <li className={`nav-item ${link.url === location.pathname ? "active" : ""}`} key={idx}>
          <NavLink className={`nav-link`} link={link} />
        </li>
      );
    });
  };

  useEffect(() => {
    if (menuRef.current) {
      const activeNavItems = menuRef.current.querySelectorAll(".nav-item.active");
      activeNavItems.forEach((navItem) => {
        (navItem.parentElement as HTMLUListElement).classList.toggle("show");
      });
    }
  }, [location.pathname]);

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
    <div className="doc-sidebar col-md-3 col-12 order-0 d-none d-md-flex">
      <div id="doc-nav" className="doc-nav">
        <nav className="sidebar card py-2 mb-4">
          <ul className="nav flex-column" id="nav_accordion" ref={menuRef}>
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
