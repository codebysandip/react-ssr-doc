import { Helmet } from "react-helmet";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { NavLink } from "src/core/components/nav-link/nav-link.comp.js";
import { RichTextResponse } from "src/core/components/rich-text-response/rich-text-response.comp.js";
import { ContextDataWithStore } from "src/core/models/context-with-store.model.js";
import { RootState } from "src/redux/create-store.js";
import DocPageReducer, { fetchDocPageData } from "./documentation.redux.js";
import "./documentation.scss";

function DocPage(props: DocPageProps) {
  const navigate = useNavigate();
  return (
    <div className="doc-body row" data-test-id={"documentation-page"}>
      <div className="doc-content col-md-9 col-12 order-1">
        <div className="content-inner">
          {" "}
          {process.env.IS_SERVER && (
            <Helmet>
              {/* {process.env.IS_SERVER && <link href={metaJson.chunkCss["doc-page"]} rel="stylesheet" />} */}
              <title>{props.pageData?.seo.title}</title>
              <meta name="description" content={props.pageData?.seo.description} />
            </Helmet>
          )}
          {props.pageData?.content && (
            <div className="rich-text">
              <RichTextResponse richTextResponse={props.pageData.content} />
            </div>
          )}
          <div className="d-flex justify-content-between">
            <button className="btn btn-link" onClick={() => navigate(-1)}>
              <i className="arrow_carrot-left"></i> Back
            </button>
            {props.pageData?.nextPageLink && (
              <NavLink
                link={props.pageData.nextPageLink}
                className="btn btn-link"
                nodeAfterText={<i className="arrow_carrot-right"></i>}
                text="Next"
                data-test-id={"next-link"}
              ></NavLink>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function getInitialProps(ctx: ContextDataWithStore) {
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
