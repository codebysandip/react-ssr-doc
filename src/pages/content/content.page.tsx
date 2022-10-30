/* eslint-disable react/no-unescaped-entities */
import { ContextDataWithStore } from "core/models/context-with-store.model.js";
import { Component, ReactNode } from "react";
import { Helmet } from "react-helmet";
import { connect } from "react-redux";
import { AppDispatch, RootState } from "src/redux/create-store.js";
import { ComponentMapping } from "./component-mapping.js";
import ContentReducer, { fetchContentPageData } from "./content.redux.js";
import "./content.scss";

class ContentPage extends Component<ContentPageProps, ContentPageState> {
  public static getInitialProps(ctx: ContextDataWithStore) {
    const pageId = ctx.location.pathname === "/" ? "home" : (ctx.params.pageId as string);
    return ctx.store.dispatch(fetchContentPageData(pageId));
  }

  render(): ReactNode {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { pageData } = this.props;

    return (
      <div data-test-id="content-page">
        {process.env.IS_SERVER && (
          <Helmet>
            <style>{pageData?.styles?.join(" ") || ""}</style>
            <link href={metaJson["content-page.css"]} rel="stylesheet" />
          </Helmet>
        )}
        {pageData?.components.map((comp, idx) => {
          const Component = ComponentMapping[comp.sysId];
          if (Component) {
            return <Component {...comp} key={idx} />;
          }
          return null;
        })}
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  pageData: state.content.pageData,
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapDispatchToProps = (dispatch: AppDispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(ContentPage);
export interface ContentPageProps
  extends ReturnType<typeof mapStateToProps>,
    ReturnType<typeof mapDispatchToProps> {}

export interface ContentPageState {}

export const reducer = {
  content: ContentReducer,
};
