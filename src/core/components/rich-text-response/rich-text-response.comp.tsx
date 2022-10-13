import { documentToReactComponents, Options } from "@contentful/rich-text-react-renderer";
import { BLOCKS, Document } from "@contentful/rich-text-types";
import { Image } from "core/components/image/image.comp.js";
import Prism from "prismjs";
import "./rich-text-response.comp.scss";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const typescript = require("prismjs/components/prism-typescript.js");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bash = require("prismjs/components/prism-bash.js");
Prism.languages.extend("typescript", typescript);
Prism.languages.extend("bash", bash);

const codeBlock = (content: string, idx: number = Math.random()) => {
  let code = content.trim();
  const match = /^#(.*)(?:.*)#/g.exec(code);
  code = match ? code.substring(2 + match[1].length).trim() : code;
  const language = match ? match[1].split(":")[0] : "typescript";
  const displayStyle = match && match[1].split(":")[1];
  const display = displayStyle === "inline" ? "inline-flex" : "flex";
  code = Prism.highlight(code, Prism.languages[language], language);
  return (
    <span
      className={`d-${display} code-container`}
      key={idx}
      data-prismjs-copy="Copy the JavaScript snippet!"
    >
      {displayStyle !== "inline" && (
        <button
          className="order-1 btn btn-outline-primary copy-btn hide"
          type="button"
          data-copy-state="copy"
          onClick={(event) => {
            if (navigator.clipboard) {
              const btn = event.target as HTMLButtonElement;
              navigator.clipboard
                .writeText((btn.nextSibling as HTMLDivElement).innerText)
                .then(() => {
                  btn.textContent = "Copied";
                  setTimeout(() => {
                    btn.textContent = "Copy";
                    btn.classList.toggle("hide");
                  }, 2000);
                })
                .catch(() => {
                  btn.textContent = "Error in copy";
                });
            }
          }}
        >
          Copy
        </button>
      )}
      <code
        dangerouslySetInnerHTML={{ __html: code }}
        className={`language-typescript order-0 ${displayStyle === "inline" ? "inline-code" : ""}`}
        onMouseOver={(event) => {
          const copyBtn = event.currentTarget.previousSibling as HTMLButtonElement;
          if (copyBtn) {
            copyBtn.classList.toggle("hide");
          }
        }}
      ></code>
    </span>
  );
};
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
        <Image
          src={`https://${node.data.target.fields.file.url}`}
          height={node.data.target.fields.file.details.image.height}
          width={node.data.target.fields.file.details.image.width}
          alt={node.data.target.fields.description}
        />
      );
    },

    // [BLOCKS.PARAGRAPH]: (node: Block | Inline, children: ReactNode) => {
    //   const elements: ReactElement[] = [];
    //   if (Array.isArray(node.content) && (node.content[0] as Text)?.marks[0]?.type === "code") {
    //     (node.content as Text[]).forEach((content: Text, idx: number) => {
    //       if (
    //         Array.isArray(content.marks) &&
    //         content.marks.length &&
    //         content.marks[0].type === "code"
    //       ) {
    //         elements.push(codeBlock(content.value, idx));
    //       }
    //     });
    //     return elements;
    //   }
    //   return <p>{children}</p>;
    // },
  },
  renderMark: {
    code: (node) => {
      return codeBlock(node as string);
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
