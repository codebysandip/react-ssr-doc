import { documentToReactComponents, Options } from "@contentful/rich-text-react-renderer";
import { Block, BLOCKS, Document, Inline, Text } from "@contentful/rich-text-types";
import "assets/scss/plugins/prism/prism.css";
import Prism from "prismjs";
import { ReactElement, ReactNode } from "react";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const typescript = require("prismjs/components/prism-typescript.js");
Prism.languages.extend("typescript", typescript);

const renderOptions: Options = {
  renderNode: {
    [BLOCKS.EMBEDDED_ENTRY]: (node: any) => {
      if (node.data.target.sys.contentType.sys.id === "videoEmbed") {
        return (
          <iframe
            src={node.data.target.fields.embedUrl}
            height="100%"
            width="100%"
            frameBorder="0"
            scrolling="no"
            title={node.data.target.fields.title}
            allowFullScreen={true}
          />
        );
      }
    },

    [BLOCKS.EMBEDDED_ASSET]: (node: any) => {
      // render the EMBEDDED_ASSET as you need
      return (
        <img
          src={`https://${node.data.target.fields.file.url}`}
          height={node.data.target.fields.file.details.image.height}
          width={node.data.target.fields.file.details.image.width}
          alt={node.data.target.fields.description}
        />
      );
    },

    [BLOCKS.PARAGRAPH]: (node: Block | Inline, children: ReactNode) => {
      const elements: ReactElement[] = [];
      if (Array.isArray(node.content) && (node.content[0] as Text)?.marks[0]?.type === "code") {
        (node.content as Text[]).forEach((content: Text, idx: number) => {
          if (
            Array.isArray(content.marks) &&
            content.marks.length &&
            content.marks[0].type === "code"
          ) {
            const code = Prism.highlight(
              content.value,
              Prism.languages["typescript"],
              "typescript",
            );
            elements.push(
              <code
                key={idx}
                dangerouslySetInnerHTML={{ __html: code }}
                className={`language-typescript`}
              ></code>,
            );
          }
        });
        return elements;
      }
      return <p>{children}</p>;
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
