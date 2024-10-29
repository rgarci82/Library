import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Logo from "../../public/undraw_Reading_re_29f8.png"
import { FaSearch } from 'react-icons/fa'
import '../components/Header.css'
import '../components/SearchBar.css'


const Home: React.FC = () => {
    const [inputText, setInputText] = useState<string>("")
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem("token");
        if(token){
            setIsLoggedIn(true)
        }
    },[])


    return (
        <>
            <nav>
                <div className="nav__container">
                    <Link to='/' className="logo"><b>Library</b></Link>
                    <ul className="nav__links">
                        <li className="nav__list">
                        <Link to='/browse' className="nav__link underline">Browse</Link>
                        </li>
                        {isLoggedIn ? (
                            <li className='nav__list'>
                                <Link to='/user' className='nav__link nav__link--primary'>Profile</Link>
                            </li>
                        ) : (
                            <>
                                <li className="nav__list">
                                <Link to='/register' className="nav__link underline">Sign Up</Link>
                                </li>
                                <li className="nav__list">
                                <Link to='/login' className="nav__link nav__link--primary">Login</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </nav>
            <header>
                <div className="header__container">
                    <div className="input-wrapper">
                    <FaSearch id="search-icon" />
                    <input 
                    placeholder="Type to search..." 
                    type="text" 
                    onChange={(e) => setInputText(e.target.value)} 
                    value={inputText} 
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            navigate(`/browse?search=${encodeURIComponent(inputText)}`);
                        }
                    }}/>
                    </div>
                    <figure className="header__img--wrapper">
                    <img src={Logo}></img>
                    </figure>
                </div>
            </header>
        </>
    )
}

export default Home