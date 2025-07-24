import { Outlet, Link } from "react-router-dom";
import "./Layout.css";
const Layout = () => {
  return (
    <div>
      <nav>
        <div className="sidebar">
          <div className="header">
            <h4 className="logo">🐶</h4>
            <h3 className="header-title">Doggie Dash</h3>
          </div>
          <div className="menu">
            <ul>
              <li className="menu-item">
                <a className="menu-links" href="/">
                  <i className="menu-icon" key="home-button"></i>
                  <Link to="/">🏠 Dashboard</Link>
                </a>
              </li>
              <li className="menu-item">
                <a className="menu-links" href="/">
                  <i className="menu-icon"></i>
                  <Link to="/">🔍 Search</Link>
                </a>
              </li>
              <li className="menu-item">
                <a className="menu-links" href="/">
                  <i className="menu-icon"></i>
                  <Link to="/">ℹ️ About</Link>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <Outlet />
    </div>
  );
};

export default Layout;
