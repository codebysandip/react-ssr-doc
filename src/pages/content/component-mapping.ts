import React from "react";
import { FeaturesBanner } from "./components/features-banner.comp.js";
import { IntroWithCtaBanner } from "./components/intro-with-cta-banner.com.js";

export const ComponentMapping: Record<string, React.FC<any>> = {
  introWithCtaBanner: IntroWithCtaBanner,
  featuresBanner: FeaturesBanner,
};
