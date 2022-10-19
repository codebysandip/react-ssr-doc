import { Image } from "src/core/components/image/image.comp.js";

export function FeaturesBanner(props: FeaturesBannerProps) {
  const { title, features, sysId } = props;

  return (
    <div id="cards-wrapper" className="cards-wrapper row" data-test-id={`${sysId}-${title}`}>
      <h1 className="title" data-test-id="title">
        {title}
      </h1>
      {features.map((feature, idx) => {
        return (
          <div
            className="item item-green col-lg-4 col-6"
            key={idx}
            data-test-id={`${feature.sysId}-${feature.title}`}
          >
            <div className="item-inner">
              <div className="icon-holder">
                <Image
                  src={feature.image.url}
                  width="36px"
                  alt={feature.image.title}
                  data-test-id="image"
                />
              </div>
              <h3 className="title" data-test-id={`${feature.sysId}-title`}>
                {feature.title}
              </h3>
              <p className="intro" data-test-id="description">
                {feature.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export interface FeaturesBannerProps {
  title: string;
  features: FeatureCard[];
  sysId: "featuresBanner";
}

export interface FeatureCard {
  title: string;
  description: string;
  sysId: string;
  image: ExternalImage;
}

export interface ExternalImage {
  url: string;
  title: string;
  width: string;
  height?: string;
  style?: Record<string, string | number>;
  sysId: "externalImage";
}
