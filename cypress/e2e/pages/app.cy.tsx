import FooterData from "mocks/api/cms/footer.json";
import { INTERNET_NOT_AVAILABLE, ROUTE_404, ROUTE_500 } from "src/const.js";

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
  it("Should not show header and footer on error page", () => {
    cy.visit(ROUTE_404);
    cy.dataCy("header").should("not.exist");
    cy.dataCy("footer").should("not.exist");
  });

  it("Should redirect to 500 page when api will return 500 response", () => {
    cy.intercept(/\/api\/cms\/home/, { statusCode: 500, body: {} });
    cy.visit("/?cypress=true");
    cy.dataCy("500-page").should("exist");
  });

  it("Should redirect to 404 page when Api will return 404", () => {
    cy.intercept(/\/api\/cms\/home/, { statusCode: 404, body: {} });
    cy.visit("/?cypress=true");
    cy.url().should("contain", ROUTE_404);
  });

  it("Should redirect to 500 page when HttpClient will return 600", () => {
    cy.intercept(/\/api\/cms\/home/, { statusCode: 600, body: {} });
    cy.visit("/?cypress=true");
    cy.url().should("contain", ROUTE_500);
  });

  it("Should show error notification when api will return error message", () => {
    cy.intercept(/\/api\/cms\/home/, {
      statusCode: 500,
      body: { message: ["Test Error Message"] },
    });
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

  it("Should render footer links", () => {
    cy.visit("/?cypress=true");
    cy.dataCy("footer").within(() => {
      FooterData.linkGroups.forEach((lg) => {
        cy.dataCy(`${lg.sysId}-${lg.title}`).within(() => {
          cy.dataCy("title").should("have.text", lg.title);
          lg.links.forEach((link) => {
            cy.dataCy(`link-${link.text}`).should("have.text", link.text);
          });
        });
      });
    });
  });

  it("Should show hamburger menu icon on doc page when mobile browser", () => {
    cy.viewport("iphone-xr");
    cy.visit("/doc/getting-started");
    cy.dataCy("hamburger-menu").should("exist");
    cy.dataCy("side-menu").should("not.be.visible");
  });

  it("Should show hamburger menu on doc page when click on hamburger icon", () => {
    cy.viewport("iphone-xr");
    cy.visit("/doc/getting-started");
    cy.dataCy("hamburger-menu").click();
    cy.dataCy("side-menu").should("be.visible");
  });
});
