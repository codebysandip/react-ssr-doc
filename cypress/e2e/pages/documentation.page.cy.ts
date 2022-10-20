import GettingStarted from "mocks/api/cms/getting-started.json";
import SideMenu from "mocks/api/cms/sideMenu.json";

describe("Documentation Page", () => {
  beforeEach(() => {
    cy.visit("/doc/getting-started");
  });

  it("Should render documentation page on SSR", () => {
    cy.dataCy("documentation-page").should("exist");
  });

  it("Should render correct title of doc", () => {
    cy.dataCy("doc-title").should("have.text", GettingStarted.title);
  });

  it("Should redirect to next page", () => {
    cy.dataCy("next-link").click();
    cy.url().should("contain", GettingStarted.nextPageLink.url);
  });

  it("Should render side menu", () => {
    cy.dataCy("side-menu")
      .should("exist")
      .within(() => {
        SideMenu.links.forEach((link) => {
          if (link.links) {
            cy.dataCy(`nested-menu-${link.text}`)
              .should("exist")
              .click()
              .within(() => {
                cy.dataCy(`link-${link.text}`).should("have.text", link.text);
                link.links.forEach((nested) => {
                  cy.dataCy(`link-${nested.text}`).should("have.text", nested.text);
                });
              });
          } else {
            cy.dataCy(`link-${link.text}`);
          }
        });
      });
  });
});
