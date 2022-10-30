import React, { useEffect, useRef } from "react";
import { connect } from "react-redux";
import { useLocation } from "react-router";
import { useAppSelector } from "src/core/hook.js";
import { RootState } from "src/redux/create-store.js";
import { NavLink } from "../../nav-link/nav-link.comp.js";
import "./left-side-menu.comp.scss";
import { NavigationLink } from "./left-side-menu.model.js";

export function LeftSideMenuComp(props: LeftSideMenuProps) {
  const location = useLocation();
  const menuRef = useRef<HTMLUListElement>(null);
  const sideMenuActive = useAppSelector((state) => state.app.sideMenuActive);

  const renderNestedMenu = (links: NavigationLink[]) => {
    return links.map((link, idx) => {
      if (link.links) {
        return (
          <li
            className="nav-item has-submenu"
            onClick={(event) => toggleMenu(event)}
            key={idx}
            data-test-id={`nested-menu-${link.text}`}
          >
            <NavLink
              className="nav-link d-flex justify-content-between align-baseline"
              link={link}
              nodeAfterText={<span className="icon"></span>}
              data-test-id={`link-${link.text}`}
            />
            <ul className="submenu collapse">{renderNestedMenu(link.links)}</ul>
          </li>
        );
      }
      return (
        <li className={`nav-item ${link.url === location.pathname ? "active" : ""}`} key={idx}>
          <NavLink className={`nav-link`} link={link} data-test-id={`link-${link.text}`} />
        </li>
      );
    });
  };

  useEffect(() => {
    if (menuRef.current) {
      const activeNavItems = menuRef.current.querySelectorAll(".nav-item.active");
      activeNavItems.forEach((navItem) => {
        const parent = navItem.parentElement as HTMLUListElement;
        if (!parent.classList.contains("submenu")) {
          return;
        }
        parent.classList.toggle("show");
        (parent.parentElement as HTMLUListElement)
          .querySelector("span.icon")
          ?.classList.toggle("down");
      });
    }
  }, [location.pathname]);

  const toggleMenu = (event: React.MouseEvent<HTMLLIElement>) => {
    event.currentTarget.querySelector("ul")?.classList.toggle("show");
    event.currentTarget.querySelector("span.icon")?.classList.toggle("down");
  };
  return (
    <div
      className={`doc-sidebar col-md-3 col-12 order-0 d-md-flex ${sideMenuActive && "active"}`}
      data-test-id={"side-menu"}
    >
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
