export function LeftSideMenu() {
  return (
    <div className="doc-sidebar col-md-3 col-12 order-0 d-none d-md-flex">
      <div id="doc-nav" className="doc-nav">
        <nav id="doc-menu" className="nav doc-menu flex-column/*  */">
          <li className="nav-item">
            <a className="nav-link scrollto" href="#download-section">
              Download
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link scrollto" href="#installation-section">
              Installation
            </a>
          </li>
          <nav className="nav doc-sub-menu nav flex-column">
            <li className="nav-item">
              <a className="nav-link scrollto" href="#step1">
                Step One
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link scrollto" href="#step2">
                Step Two
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link scrollto" href="#step3">
                Step Three
              </a>
            </li>
          </nav>
          <li className="nav-item">
            <a className="nav-link scrollto" href="#code-section">
              Code
            </a>
          </li>

          <nav className="nav doc-sub-menu nav flex-column">
            <li className="nav-item">
              <a className="nav-link scrollto" href="#html">
                HTML
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link scrollto" href="#css">
                CSS
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link scrollto" href="#sass">
                Sass
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link scrollto" href="#less">
                LESS
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link scrollto" href="#javascript">
                JavaScript
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link scrollto" href="#python">
                Python
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link scrollto" href="#php">
                PHP
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link scrollto" href="#handlebars">
                Handlebars
              </a>
            </li>
          </nav>
          <li className="nav-item">
            <a className="nav-link scrollto" href="#callouts-section">
              Callouts
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link scrollto" href="#tables-section">
              Tables
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link scrollto" href="#buttons-section">
              Buttons
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link scrollto" href="#video-section">
              Video
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link scrollto" href="#icons-section">
              Icons
            </a>
          </li>
        </nav>
      </div>
    </div>
  );
}
