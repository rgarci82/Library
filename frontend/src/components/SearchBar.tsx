import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import "./SearchBar.css";
import Logo from "../../public/undraw_Reading_re_29f8.png"
import { Navigate } from "react-router-dom";

const SearchBar: React.FC = () => {
  const [inputText, setInputText] = useState("")

  const handleSearch = (e: any) =>{
    if(e.key === 'Enter' && inputText.trim()){
      <Navigate to='/browse'/>
    }
  }

  return (
    <header>
      <div className="header__container">
        <div className="input-wrapper">
          <FaSearch id="search-icon" />
          <input placeholder="Type to search..." type="text" onChange={(e) => setInputText(e.target.value)} value={inputText} onKeyDown={handleSearch}/>
        </div>
        <figure className="header__img--wrapper">
          <img src={Logo}></img>
        </figure>
      </div>
    </header>
  );
};

export default SearchBar;
