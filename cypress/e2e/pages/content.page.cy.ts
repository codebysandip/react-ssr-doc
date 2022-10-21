import HomeData from "mocks/api/cms/home.json";
import { FeaturesBannerProps } from "src/pages/content/components/features-banner.comp.js";

describe("Content Page", () => {
  it("Should render content page on SSR", () => {
    cy.visit("/");
    cy.dataCy("content-page").should("exist");
  });

  it("Should render content page on CSR", () => {
    cy.visit("/?cypress=true");
    cy.dataCy("content-page").should("exist");
  });

  it("Should render exact components coming from CMS", () => {
    cy.visit("/");
    HomeData.components.forEach((comp) => {
      if (comp.sysId === "introWithCtaBanner" || comp.sysId === "featuresBanner") {
        cy.dataCy(`${comp.sysId}-${comp.title}`).should("exist");
      }
    });
  });

  it("Should render introWithCtaBanner with correct data", () => {
    cy.visit("/");
    const introWithCtaBanner = HomeData.components.find((c) => c.sysId === "introWithCtaBanner");
    if (!introWithCtaBanner) {
      throw new Error("introWithCtaBanner doesn't exist in mock data");
    }
    const { sysId, title, cta } = introWithCtaBanner;
    cy.dataCy(`${sysId}-${title}`).within(() => {
      cy.dataCy("title").should("have.text", title);
      cy.dataCy("intro").get("p").should("exist");
      cy.dataCy("cta").should("exist");
      cy.dataCy("link").should("have.text", cta?.text).should("have.attr", "href", cta?.url);
    });
  });

  it("Should render featuresBanner with correct data", () => {
    cy.visit("/");
    const featuresBanner = HomeData.components.find(
      (c) => c.sysId === "featuresBanner",
    ) as FeaturesBannerProps;
    if (!featuresBanner) {
      throw new Error("featuresBanner doesn't exist in mock data");
    }
    const { sysId, title, features } = featuresBanner;
    cy.dataCy(`${sysId}-${title}`).within(() => {
      cy.dataCy("title").should("have.text", title);
      features.forEach((feature) => {
        cy.dataCy(`${feature.sysId}-${feature.title}`).within(() => {
          cy.dataCy(`${feature.sysId}-title`).should("have.text", feature.title);
          cy.dataCy("image").should("have.attr", "alt", feature.image.title);
          cy.dataCy("description").should("have.text", feature.description);
        });
      });
    });
  });

  it("Should render taglines in header", () => {
    cy.visit("/");
    cy.dataCy("header").within(() => {
      HomeData.tagLines.forEach((tagLine) => {
        cy.dataCy(`tag-line-${tagLine}`).should("have.text", tagLine);
      });
    });
  });
});
