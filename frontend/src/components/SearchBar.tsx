import React, { useState } from "react";
import { FaSearch, FaFilter } from "react-icons/fa";
import "./SearchBar.css";

const SearchBar: React.FC = () => {
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="input-wrapper">
      <FaSearch id="search-icon" />
      <input placeholder="Type to search..." />
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
  );
};

export default SearchBar;
