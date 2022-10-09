import ProductData from "mocks/api/product.json";
import {
  COOKIE_ACCESS_TOKEN,
  COOKIE_REFRESH_TOKEN,
  INTERNET_NOT_AVAILABLE,
  ROUTE_404,
  ROUTE_500,
  ROUTE_LOGIN,
} from "src/const.js";
import { CookieService } from "src/core/services/cookie.service.js";
import { AuthResponse } from "src/pages/auth/auth.model.js";

let originalOnLine: boolean;

const goOffline = () => {
  cy.log("offline");
  return cy.window({ log: false }).then((win) => {
    if (!originalOnLine) {
      originalOnLine = win.navigator.onLine;
    }

    Object.defineProperty(win.navigator.constructor.prototype, "onLine", {
      get: () => {
        return originalOnLine;
      },
    });

    const isOnline = originalOnLine;
    originalOnLine = false;

    if (isOnline) {
      win.dispatchEvent(new win.Event("offline"));
    }
  });
};

const goOnline = () => {
  cy.log("online");
  return cy.window({ log: false }).then((win) => {
    if (!originalOnLine) {
      originalOnLine = win.navigator.onLine;
    }

    Object.defineProperty(win.navigator.constructor.prototype, "onLine", {
      get: () => {
        return originalOnLine;
      },
    });

    const isOnline = originalOnLine;
    originalOnLine = true;

    if (!isOnline) {
      win.dispatchEvent(new win.Event("online"));
    }
  });
};
describe("App shell", () => {
  it("Should hide header when redirect to error page", () => {
    cy.visit("/");
    cy.dataCy(ROUTE_404).click();
    cy.dataCy("header").should("not.exist");
  });

  it("Should redirect to 500 page when api will return 500 response", () => {
    cy.intercept(/\/api\/product/, { statusCode: 500, body: {} });
    cy.visit("/?cypress=true");
    cy.dataCy("500-page").should("exist");
  });

  it("Should redirect to login page when Api will return 401", () => {
    cy.visit("/");
    cy.intercept(/\/api\/product/, { statusCode: 401, body: {} });
    cy.dataCy("login-link").click();
    cy.dataCy("navbar").click();
    cy.url().should("contain", ROUTE_LOGIN);
  });

  it("Should redirect to 404 page when Api will return 404", () => {
    cy.intercept(/\/api\/product/, { statusCode: 404, body: {} });
    cy.visit("/?cypress=true");
    cy.url().should("contain", ROUTE_404);
  });

  it("Should redirect to 500 page when HttpClient will return 600", () => {
    cy.intercept(/\/api\/product/, { statusCode: 600, body: {} });
    cy.visit("/?cypress=true");
    cy.url().should("contain", ROUTE_500);
  });

  it("Should show error notification when api will return error message", () => {
    cy.intercept(/\/api\/product/, { statusCode: 500, body: { message: ["Test Error Message"] } });
    cy.visit("/?cypress=true");
    cy.get(".Toastify__toast-body").within(() => {
      cy.contains("Test Error Message").should("exist");
    });
  });

  it("Show toast notification of internet not available when offline", () => {
    cy.visit(ROUTE_500);
    goOffline();
    cy.dataCy("back-to-home").click();
    cy.get(".Toastify__toast-body").within(() => {
      cy.contains(INTERNET_NOT_AVAILABLE).should("exist");
      goOnline();
    });
  });

  it("Should generate refresh token when token expired", () => {
    cy.visit("/");

    CookieService.set(COOKIE_ACCESS_TOKEN, Cypress.env("EXPIRED_JWT_TOKEN"));
    CookieService.set(COOKIE_REFRESH_TOKEN, Cypress.env("LONG_EXPIRY_JWT_TOKEN"));
    const authResp: AuthResponse = {
      accessToken: Cypress.env("LONG_EXPIRY_JWT_TOKEN"),
      refreshToken: Cypress.env("LONG_EXPIRY_JWT_TOKEN"),
    };
    cy.intercept(/\/api\/refresh-token/, authResp);
    cy.intercept(/\/api\/product\/1/, ProductData.products[0]);
    cy.dataCy("home-view-btn-1").click();
    cy.dataCy("product-detail-page").should("exist");
  });

  it("Should redirect to 403 page when api will return 403", () => {
    cy.intercept("/api/product", { statusCode: 403, body: {} });
    cy.visit("/?cypress=true");
    cy.url().should("contain", 403);
  });
});
