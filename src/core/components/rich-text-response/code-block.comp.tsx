import Prism from "prismjs";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const typescript = require("prismjs/components/prism-typescript.js");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bash = require("prismjs/components/prism-bash.js");
Prism.languages.extend("typescript", typescript);
Prism.languages.extend("bash", bash);

export function CodeBlock(props: CodeBlockProps) {
  const { content } = props;
  let code = content.trim();
  const match = /^#(.*)(?:.*)#/g.exec(code);
  code = match ? code.substring(2 + match[1].length).trim() : code;
  const language = match ? match[1].split(":")[0] : "typescript";
  const displayStyle = match && match[1].split(":")[1];
  const display = displayStyle === "inline" ? "inline-flex" : "flex";
  code = Prism.highlight(code, Prism.languages[language], language);
  return (
    <span className={`d-${display} code-container`}>
      {displayStyle !== "inline" && (
        <button
          className="btn btn-outline-primary copy-btn"
          type="button"
          onClick={(event) => {
            if (navigator.clipboard) {
              const btn = event.target as HTMLButtonElement;
              navigator.clipboard
                .writeText((btn.nextSibling as HTMLDivElement).innerText)
                .then(() => {
                  btn.textContent = "Copied";
                  setTimeout(() => {
                    btn.textContent = "Copy";
                    // btn.classList.toggle("hide");
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
        className={`language-typescript ${displayStyle === "inline" ? "inline-code" : ""}`}
        // onMouseOver={(event) => {
        //   const copyBtn = event.currentTarget.previousSibling as HTMLButtonElement;
        //   if (copyBtn) {
        //     copyBtn.classList.toggle("hide");
        //   }
        // }}
      ></code>
    </span>
  );
}

export interface CodeBlockProps {
  content: string;
}
