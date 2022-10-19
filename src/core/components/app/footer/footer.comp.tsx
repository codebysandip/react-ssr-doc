import { useAppSelector } from "src/core/hook.js";
import { NavLink } from "../../nav-link/nav-link.comp.js";

export function Footer() {
  const footer = useAppSelector((state) => state.app.footer);

  return (
    <footer data-test-id="footer" className="footer-10">
      <div className="container">
        <div className="row">
          <div className="col-md-7">
            <div className="row">
              {footer?.linkGroups.map((linkGroup, idx) => {
                return (
                  <div
                    className="col-md-4 mb-md-0 mb-4"
                    key={idx}
                    data-test-id={`${linkGroup.sysId}-${linkGroup.title}`}
                  >
                    <h2 className="footer-heading" data-test-id="title">
                      {linkGroup.title}
                    </h2>
                    <ul className="list-unstyled">
                      {linkGroup.links.map((link, i) => {
                        return (
                          <li key={i}>
                            <NavLink link={link} data-test-id={`link-${link.text}`} />
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="col-md-5 mb-md-0 mb-4">
            <h2 className="footer-heading">Subscribe</h2>
            <form action="#" className="subscribe-form">
              <div className="form-group d-flex">
                <input
                  type="text"
                  className="form-control rounded-left"
                  placeholder="Enter email address"
                />
                <button type="submit" className="form-control submit rounded-right">
                  Subscribe
                </button>
              </div>
              <span className="subheading">
                Get updates about new feature updates in your mailbox
              </span>
            </form>
          </div>
          <small className="copyright text-center">
            Designed with{" "}
            <svg
              className="svg-inline--fa fa-heart"
              aria-hidden="true"
              focusable="false"
              data-prefix="fas"
              data-icon="heart"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              width="14px"
            >
              <path
                fill="currentColor"
                d="M0 190.9V185.1C0 115.2 50.52 55.58 119.4 44.1C164.1 36.51 211.4 51.37 244 84.02L256 96L267.1 84.02C300.6 51.37 347 36.51 392.6 44.1C461.5 55.58 512 115.2 512 185.1V190.9C512 232.4 494.8 272.1 464.4 300.4L283.7 469.1C276.2 476.1 266.3 480 256 480C245.7 480 235.8 476.1 228.3 469.1L47.59 300.4C17.23 272.1 .0003 232.4 .0003 190.9L0 190.9z"
              ></path>
            </svg>{" "}
            by{" "}
            <a href="https://themes.3rdwavemedia.com/" target="_blank" rel="noreferrer">
              {/* cSpell:disable-next-line */}
              Xiaoying Riley
            </a>{" "}
            for developers
          </small>
        </div>
      </div>
    </footer>
  );
}
