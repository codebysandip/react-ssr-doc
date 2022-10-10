import { logout as logoutAction } from "pages/auth/auth.redux.js";
import { Component } from "react";
import { connect } from "react-redux";
import { ROUTE_LOGIN } from "src/const.js";
import { withRouter, WithRouterProps } from "src/core/hoc/with-routes.hoc.js";
import { CommonService } from "src/core/services/common.service.js";
import { AppDispatch, RootState } from "src/redux/create-store.js";

class HeaderComp extends Component<HeaderProps> {
  public logout() {
    this.props.logout();
    CommonService.logout();
    this.props.router.navigate(ROUTE_LOGIN);
  }

  public componentDidUpdate(prevProps: HeaderProps) {
    if (prevProps.isLoggedIn !== this.props.isLoggedIn && !this.props.isLoggedIn) {
      this.props.router.navigate(ROUTE_LOGIN);
    }
  }

  render() {
    return (
      <header id="header" className="header">
        <div className="container">
          <div className="branding">
            <h1 className="logo">
              <a href="index.html">
                <span aria-hidden="true" className="icon_documents_alt icon"></span>
                <span className="text-highlight">React SSR</span>
                <span className="text-bold">Docs</span>
              </a>
            </h1>
          </div>

          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="index.html">Home</a>
            </li>
            <li className="breadcrumb-item active">Quick Start</li>
          </ol>

          <div className="top-search-box">
            <form className="form-inline search-form justify-content-center" action="" method="get">
              <input
                type="text"
                placeholder="Search..."
                name="search"
                className="form-control search-input"
              />

              <button type="submit" className="btn search-btn" value="Search">
                <svg
                  className="svg-inline--fa fa-magnifying-glass"
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="magnifying-glass"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  data-fa-i2svg=""
                >
                  <path
                    fill="#494d55"
                    d="M500.3 443.7l-119.7-119.7c27.22-40.41 40.65-90.9 33.46-144.7C401.8 87.79 326.8 13.32 235.2 1.723C99.01-15.51-15.51 99.01 1.724 235.2c11.6 91.64 86.08 166.7 177.6 178.9c53.8 7.189 104.3-6.236 144.7-33.46l119.7 119.7c15.62 15.62 40.95 15.62 56.57 0C515.9 484.7 515.9 459.3 500.3 443.7zM79.1 208c0-70.58 57.42-128 128-128s128 57.42 128 128c0 70.58-57.42 128-128 128S79.1 278.6 79.1 208z"
                  ></path>
                </svg>
              </button>
            </form>
          </div>
        </div>
      </header>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    isLoggedIn: state.auth.isLoggedIn,
    header: state.app.header,
  };
};

const mapDispatchToProps = (dispatch: AppDispatch) => {
  return {
    logout: () => dispatch(logoutAction()),
  };
};

export const Header = connect(mapStateToProps, mapDispatchToProps)(withRouter(HeaderComp));

export interface HeaderProps
  extends WithRouterProps,
    ReturnType<typeof mapDispatchToProps>,
    ReturnType<typeof mapStateToProps> {}
