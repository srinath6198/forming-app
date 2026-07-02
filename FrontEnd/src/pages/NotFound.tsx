import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="not-found">
      <div>
        <h1 className="not-found__code">404</h1>
        <p className="not-found__text">Page not found</p>
        <Link to="/" className="btn btn--primary" style={{ marginTop: 24, display: "inline-flex" }}>
          Go home
        </Link>
      </div>
    </div>
  );
}
