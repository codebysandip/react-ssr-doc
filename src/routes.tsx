import { ROUTE_404, ROUTE_500 } from "./const.js";
import { IRoute } from "./core/models/route.model.js";

/**
 * React routes of all pages.
 * Always define webpackChunkName for import. This chunk name will use while creating build.
 * This will help developers to debug in production.
 */
export const Routes: IRoute[] = [
  {
    path: "/",
    component: () => import(/* webpackChunkName: "content-page" */ "pages/content/content.page.js"),
    isSSR: true,
  },
  // Replace 404 component code with own code
  {
    path: ROUTE_404,
    component: () => import(/* webpackChunkName: "404" */ "src/pages/error/404/404.component.js"),
    static: true,
    isSSR: true,
  },
  // Replace 500 component code with own code
  {
    path: ROUTE_500,
    component: () => import(/* webpackChunkName: "500" */ "src/pages/error/500/500.component.js"),
    isSSR: false,
  },
  {
    path: "/doc/:pageId",
    component: () =>
      import(/* webpackChunkName: "doc-page" */ "src/pages/documentation/documentation.page.js"),
    isSSR: true,
  },
];
