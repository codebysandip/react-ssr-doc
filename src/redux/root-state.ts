import { AppState } from "src/app.redux.js";
import { ContentState } from "src/pages/content/content.redux.js";
import { DocPageState } from "src/pages/documentation/documentation.redux.js";

export interface RootState {
  app: AppState;
  doc: DocPageState;
  content: ContentState;
}
