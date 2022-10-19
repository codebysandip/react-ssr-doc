import { useEffect, useState } from "react";
import { CodeBlock } from "./code-block.comp.js";

export function GithubCode(props: GithubCodeProps) {
  const { url } = props;
  const [code, setCode] = useState<string>("");

  useEffect(() => {
    fetch(url)
      .then((res) => res.text())
      .then((code) => {
        setCode(code);
      });
  }, []);
  if (code) {
    return (
      <div className="code-block">
        <CodeBlock content={code} />
      </div>
    );
  }
  return null;
}

export interface GithubCodeProps {
  url: string;
}
