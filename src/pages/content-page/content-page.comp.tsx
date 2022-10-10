import { connect } from "react-redux";
import { RichTextResponse } from "src/core/components/rich-text-response/rich-text-response.comp.js";
import { ContextDataWithStore } from "src/core/models/context-with-store.model.js";
import { RootState } from "src/redux/create-store.js";
import ContentPageReducer, { fetchContentPageData } from "./content-page.redux.js";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function ContentPage(props: ContentPageProps) {
  // useEffect(() => {
  //   const scriptCore = document.createElement("script");
  //   scriptCore.src =
  //     "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-core.min.js";
  //   scriptCore.setAttribute("nonce", "react-ssr");
  //   document.head.appendChild(scriptCore);

  //   const scriptAutoLoader = document.createElement("script");
  //   scriptAutoLoader.src =
  //     "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/autoloader/prism-autoloader.min.js";
  //   scriptAutoLoader.setAttribute("nonce", "react-ssr");
  //   document.head.appendChild(scriptAutoLoader);
  // }, []);

  return (
    <>
      <h1>Content Page</h1>
      {props.content?.fields.description && (
        <RichTextResponse richTextResponse={props.content?.fields.description} />
      )}
    </>
  );
}

export function getInitialProps(ctx: ContextDataWithStore) {
  return ctx.store.dispatch(fetchContentPageData(ctx.params.pageId as string));
}

const mapStateToProps = (state: RootState) => ({
  content: state.content.content,
});
const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(ContentPage);

interface ContentPageProps extends ReturnType<typeof mapStateToProps> {}

export const reducer = {
  content: ContentPageReducer,
};
