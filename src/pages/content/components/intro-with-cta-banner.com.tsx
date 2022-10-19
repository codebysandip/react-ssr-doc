import { Document } from "@contentful/rich-text-types";
import { NavigationLink } from "src/core/components/app/left-side-menu/left-side-menu.model.js";
import { NavLink } from "src/core/components/nav-link/nav-link.comp.js";
import { RichTextResponse } from "src/core/components/rich-text-response/rich-text-response.comp.js";

export function IntroWithCtaBanner(props: IntroWithCtaBannerProps) {
  const { title, intro, cta, sysId } = props;

  return (
    <section data-test-id={`${sysId}-${title}`}>
      <h2 className="title" data-test-id={`title`}>
        {title}
      </h2>
      <div className="intro" data-test-id={`intro`}>
        <RichTextResponse richTextResponse={intro} />
        {cta && (
          <div className="cta-container" data-test-id={`cta`}>
            <NavLink className="btn btn-primary btn-cta" link={cta} data-test-id={`link`} />
          </div>
        )}
      </div>
    </section>
  );
}

export interface IntroWithCtaBannerProps {
  title: string;
  intro: Document;
  cta?: NavigationLink;
  sysId: "introWithCtaBanner";
}
