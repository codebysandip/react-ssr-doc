import { HomeState } from "examples/home/home.redux.js";
import { AppState } from "src/app.redux.js";
import { AuthState } from "src/pages/auth/auth.redux.js";
import { DocPageState } from "src/pages/doc-page/doc-page.redux.js";

export interface RootState {
  home: HomeState;
  auth: AuthState;
  app: AppState;
  doc: DocPageState;
}
