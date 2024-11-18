import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Logo from "../../public/undraw_Reading_re_29f8.png"
import { FaSearch } from 'react-icons/fa'
import '../components/Header.css'
import '../components/SearchBar.css'
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
    id: number;
}

const Home: React.FC = () => {
    const [inputText, setInputText] = useState<string>("")
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [userData, setUserData] = useState<any>(null);


    const navigate = useNavigate()

    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                return;
            }

            const decoded: JwtPayload | null = jwtDecode(token); // Decode the token
            if (!decoded || !decoded.id) throw new Error("Invalid token or ID not found");

            // Fetch user data
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${decoded.id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) throw new Error("Failed to fetch user data");

            const userData = await response.json();
            setUserData(userData);
            setIsLoggedIn(true)

            if (!userData.userID) {
                console.error("User data is not available.");
                return; // Return early if userID is undefined
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, [])


    return (
        <>
            <nav className='nav__home'>
                <div className="nav__container">
                    <Link to='/' className="logo"><b>Library</b></Link>
                    <ul className="nav__links">
                        <li className="nav__list">
                            <Link to='/browse' className="nav__link underline">Browse</Link>
                        </li>
                        {isLoggedIn ? (
                            <li className='nav__list'>
                                <Link to={userData.userType === 'Admin' ? '/adminDashboard' : '/user'} className='nav__link nav__link--primary'>Profile</Link>
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
                            }} />
                    </div>
                    <figure className="header__img--wrapper">
                        <img src={Logo} className="image-styler"></img>
                    </figure>
                </div>
            </header>
        </>
    )
}

export default Home