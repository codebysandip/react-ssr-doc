import { Helmet } from "react-helmet";
import { connect } from "react-redux";
import { ContextDataWithStore } from "src/core/models/context-with-store.model.js";
import { RootState } from "src/redux/create-store.js";
import "./home.comp.scss";
import HomeReducer, { fetchProducts } from "./home.redux.js";

const Home = (props: HomeProps) => {
  const pageData = props.pageData;
  return (
    <>
      {process.env.IS_SERVER && (
        <Helmet>
          <title>{pageData.seo?.title || "My Title"}</title>
          {/* metaJson will available only on server side */}
          {process.env.IS_SERVER && <link href={metaJson.chunkCss["home"]} rel="stylesheet" />}
        </Helmet>
      )}
    </>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    pageData: state.home.pageData,
  };
};
export default connect(mapStateToProps, {})(Home);

export interface HomeProps extends ReturnType<typeof mapStateToProps> {}

export function getInitialProps(ctx: ContextDataWithStore) {
  return ctx.store.dispatch(fetchProducts());
}

export const reducer = {
  home: HomeReducer,
};
