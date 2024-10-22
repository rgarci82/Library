import { Link } from "react-router-dom";
import "./Header.css"

const Header: React.FC = () => {

  return (
      <nav>
        <div className="nav__container">
          <Link to='/' className="logo"><b>Library</b></Link>
          <ul className="nav__links">
            <li className="nav__list">
              <Link to='/browse' className="nav__link underline">Browse</Link>
            </li>
            <li className="nav__list">
              <Link to='/register' className="nav__link underline">Sign Up</Link>
            </li>
            <li className="nav__list">
              <Link to='/login' className="nav__link nav__link--primary">Login</Link>
            </li>
          </ul>
        </div>
      </nav>
  );
};

export default Header;
