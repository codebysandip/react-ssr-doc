import { useAppSelector } from "src/core/hook.js";

export function DocHeader() {
  const docHeader = useAppSelector((state) => state.app.docHeader);
  return docHeader ? (
    <div id="doc-header" className="doc-header text-center">
      <h1 className="doc-title" data-test-id={"doc-title"}>
        {docHeader.title}
      </h1>
      <div className="meta">
        <span aria-hidden="true" className="icon"></span>
        Last updated: {new Date(docHeader.lastUpdated).toDateString()}
      </div>
    </div>
  ) : null;
}
