import { HomeState } from "examples/home/home.redux.js";
import { AppState } from "src/app.redux.js";
import { AuthState } from "src/pages/auth/auth.redux.js";
import { ContentPageState } from "src/pages/content-page/content-page.redux.js";

export interface RootState {
  home: HomeState;
  auth: AuthState;
  app: AppState;
  content: ContentPageState;
}
