import React, { useState } from "react";
import { FaSearch, FaFilter } from "react-icons/fa";
import "./SearchBar.css";
import Logo from "../../public/undraw_Reading_re_29f8.png"

const SearchBar: React.FC = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [inputText, setInputText] = useState("")

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  console.log(inputText)

  return (
    <header>
      <div className="header__container">
        <div className="input-wrapper">
          <FaSearch id="search-icon" />
          <input placeholder="Type to search..." type="text" onChange={(e) => setInputText(e.target.value)} value={inputText}/>
          <FaFilter id="filter-icon" onClick={toggleDropdown} />
          {showDropdown && (
            <div className="dropdown-menu">
              <label>
                <input className="genres" type="checkbox" name="action" /> Action
              </label>
              <label>
                <input className="genres" type="checkbox" name="adventure" />{" "}
                Adventure
              </label>
              <label>
                <input className="genres" type="checkbox" name="fantasy" /> Fantasy
              </label>
              <label>
                <input className="genres" type="checkbox" name="fiction" /> Fiction
              </label>
              <label>
                <input className="genres" type="checkbox" name="nonfiction" />{" "}
                NonFiction
              </label>
            </div>
          )}
        </div>
        <figure className="header__img--wrapper">
          <img src={Logo}></img>
        </figure>
      </div>
    </header>
  );
};

export default SearchBar;
