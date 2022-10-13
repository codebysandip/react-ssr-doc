import { Helmet } from "react-helmet";
import { connect } from "react-redux";
import { RichTextResponse } from "src/core/components/rich-text-response/rich-text-response.comp.js";
import { ContextDataWithStore } from "src/core/models/context-with-store.model.js";
import { RootState } from "src/redux/create-store.js";
import "./doc-page.comp.scss";
import DocPageReducer, { fetchDocPageData } from "./doc-page.redux.js";

function DocPage(props: DocPageProps) {
  return (
    <>
      <Helmet>
        {/* {process.env.IS_SERVER && <link href={metaJson.chunkCss["doc-page"]} rel="stylesheet" />} */}
        <title>{props.pageData?.seo.title}</title>
        <meta name="description" content={props.pageData?.seo.description} />
      </Helmet>

      {props.pageData?.content && <RichTextResponse richTextResponse={props.pageData.content} />}
    </>
  );
}

export function getInitialProps(ctx: ContextDataWithStore) {
  console.log("pageId!!", ctx.params.pageId as string);
  return ctx.store.dispatch(fetchDocPageData(ctx.params.pageId as string));
}

const mapStateToProps = (state: RootState) => ({
  pageData: state.doc.pageData,
});
const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(DocPage);

interface DocPageProps extends ReturnType<typeof mapStateToProps> {}

export const reducer = {
  doc: DocPageReducer,
};
