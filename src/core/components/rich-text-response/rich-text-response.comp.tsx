import { documentToReactComponents, Options } from "@contentful/rich-text-react-renderer";
import { Block, BLOCKS, Document, Inline, INLINES } from "@contentful/rich-text-types";
import { Image } from "core/components/image/image.comp.js";
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { InView } from "../in-view/in-view.comp.js";
import { NavLink } from "../nav-link/nav-link.comp.js";
import { CodeBlock } from "./code-block.comp.js";
import { GithubCode } from "./github-code.comp.js";
import "./rich-text-response.comp.scss";

const renderOptions: Options = {
  renderNode: {
    [BLOCKS.EMBEDDED_ENTRY]: (node: Block | Inline) => {
      if (node.data.target.sysId === "videoEmbed") {
        return (
          <InView>
            {(inView) =>
              inView ? (
                () => (
                  <iframe
                    src={node.data.target.embedUrl}
                    height="100%"
                    width="100%"
                    frameBorder="0"
                    scrolling="no"
                    title={node.data.target.title}
                    allowFullScreen={true}
                  />
                )
              ) : (
                <div></div>
              )
            }
          </InView>
        );
      } else if (node.data.target.sysId === "iframe") {
        return (
          <InView>
            {(inView) =>
              inView ? (
                () => (
                  <iframe
                    src={node.data.target.url}
                    height="100%"
                    width="100%"
                    frameBorder="0"
                    title={node.data.target.name}
                    allowFullScreen={true}
                  />
                )
              ) : (
                <div></div>
              )
            }
          </InView>
        );
      } else if (node.data.target.sysId === "githubRawCode") {
        return (
          <InView>
            {(inView) => (inView ? () => <GithubCode url={node.data.target.url} /> : <div></div>)}
          </InView>
        );
      } else if (node.data.target.sysId === "externalImage") {
        return (
          <Image
            src={node.data.target.url}
            height={node.data.target.height}
            width={node.data.target.width}
            alt={node.data.target.title}
            style={node.data.target.style}
          />
        );
      }
    },

    [BLOCKS.EMBEDDED_ASSET]: (node: Block | Inline) => {
      // render the EMBEDDED_ASSET as you need
      return (
        <Image
          src={`https://${node.data.target.file.url}`}
          height={node.data.target.file.details.image.height}
          width={node.data.target.file.details.image.width}
          alt={node.data.target.description}
        />
      );
    },
    [INLINES.HYPERLINK]: (node: Block | Inline, children: ReactNode) => {
      if (/^https?:\/\//.test(node.data.uri)) {
        return (
          <a target="_blank" href={node.data.uri} rel="noreferrer">
            {children}
          </a>
        );
      }
      return <Link to={node.data.uri}>{children}</Link>;
    },
    [INLINES.EMBEDDED_ENTRY]: (node: Block | Inline) => {
      if (node.data.target.sysId === "navigation") {
        return <NavLink link={node.data.target} />;
      }
    },
  },
  renderMark: {
    code: (node) => {
      if (!node) {
        return null;
      }
      return <CodeBlock content={node as string} />;
    },
  },
};

export function RichTextResponse(props: RichTextResponseProps) {
  const { richTextResponse } = props;
  return <>{documentToReactComponents(richTextResponse, renderOptions)}</>;
}

export interface RichTextResponseProps {
  richTextResponse: Document;
}
