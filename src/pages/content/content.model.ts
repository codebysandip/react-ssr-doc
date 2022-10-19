import { FeaturesBannerProps } from "./components/features-banner.comp.js";
import { IntroWithCtaBannerProps } from "./components/intro-with-cta-banner.com.js";

export interface ContentPageData {
  tagLines: string[];
  styles?: string[];
  components: Components[];
}

export type Components = IntroWithCtaBannerProps | FeaturesBannerProps;
