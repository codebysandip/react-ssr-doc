import { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { searchText, toggleSideMenuActive } from "src/app.redux.js";
import { withRouter, WithRouterProps } from "src/core/hoc/with-routes.hoc.js";
import { AppDispatch, RootState } from "src/redux/create-store.js";

class HeaderComp extends Component<HeaderProps, HeaderState> {
  public readonly state: Readonly<HeaderState> = {
    searchText: "",
  };

  public search() {
    if (this.state.searchText.length >= 3) {
      this.props.search(this.state.searchText);
    }
  }

  public toggleSideMenu() {
    this.props.toggleSideMenu();
  }

  render() {
    const { docHeader, tagLines, pageType, device, sideMenuActive } = this.props;
    return (
      <header
        data-test-id="header"
        className={`header ${
          pageType === "CONTENT_PAGE" || device === "mobile" ? "text-center" : ""
        }`}
      >
        <div className="branding">
          <h1 className="logo">
            <Link to="/">
              <span className="icon"></span>
              <span className="text-highlight">React SSR</span>
              <span className="text-bold">Docs</span>
            </Link>
          </h1>
          {pageType === "DOC_PAGE" && (
            <span
              className={`d-md-none hamburger-menu ${sideMenuActive && "active"}`}
              onClick={() => this.toggleSideMenu()}
            ></span>
          )}
        </div>
        <div className="container">
          {pageType === "DOC_PAGE" && (
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/">Home</Link>
              </li>
              <li className="breadcrumb-item active">{docHeader?.title}</li>
            </ol>
          )}

          {pageType === "CONTENT_PAGE" && (
            <div className="tagline">
              {tagLines.map((tagLine, idx) => (
                <p key={idx} data-test-id={`tag-line-${tagLine}`}>
                  {tagLine}
                </p>
              ))}
            </div>
          )}

          <div
            className={pageType === "DOC_PAGE" ? "" : "main-search-box pt-3 pb-4 d-inline-block"}
          >
            <form className="form-inline search-form justify-content-center" action="" method="get">
              <input
                type="text"
                placeholder="Search..."
                name="search"
                className="form-control search-input"
                value={this.state.searchText}
                onChange={(event) => this.setState({ searchText: event.target.value })}
              />

              <button
                className="btn search-btn"
                value="Search"
                type="button"
                id="searchButton"
                aria-label="Search Button"
                role="button"
                onClick={() => this.search()}
              >
                <span aria-hidden="true" className="icon"></span>
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
    docHeader: state.app.docHeader,
    tagLines: state.app.tagLines,
    pageType: state.app.pageType,
    device: state.app.device,
    sideMenuActive: state.app.sideMenuActive,
  };
};

const mapDispatchToProps = (dispatch: AppDispatch) => {
  return {
    search: (q: string) => dispatch(searchText(q)),
    toggleSideMenu: () => dispatch(toggleSideMenuActive()),
  };
};

export const Header = connect(mapStateToProps, mapDispatchToProps)(withRouter(HeaderComp));

export interface HeaderProps
  extends WithRouterProps,
    ReturnType<typeof mapDispatchToProps>,
    ReturnType<typeof mapStateToProps> {}

export interface HeaderState {
  searchText: string;
}
