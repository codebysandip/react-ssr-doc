import { Link } from "react-router-dom";
import "./404.component.scss";

export default function NotFound() {
  return (
    <div
      className="d-flex align-items-center justify-content-center vh-100 not-found-page"
      data-test-id="404-page"
    >
      <div className="text-center">
        <h1 className="display-1 fw-bold">404</h1>
        <p className="fs-3">
          {" "}
          <span className="text-danger">Ops!</span> Page not found.
        </p>
        <p className="lead">The page you’re looking for doesn’t exist.</p>
        <Link to="/" className="btn btn-primary btn-lg">
          <span className="glyphicon glyphicon-home"></span>
          Take Me Home
        </Link>{" "}
      </div>
    </div>
  );
}
