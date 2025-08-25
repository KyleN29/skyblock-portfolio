import { useEffect, useState } from "react";
import axios from "axios";
import websiteIcon from "../assets/Skyblock.png";
import { useNavigate } from "react-router-dom";

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {

            navigate(`/search?product=${searchQuery}`);
            window.location.reload();
        }
    };

    useEffect(() => {
        axios
            .get("http://localhost:4000/api/auth", { withCredentials: true })
            .then((response) => {
                setIsLoggedIn(true);
            })
            .catch((error) => {
                setIsLoggedIn(false);
            });
    }, []);
    return (
        <>
            <div className="header">
                <div className="left-section">
                    <a href="/">
                        <img alt="Home" className="home-image" src={websiteIcon}></img>
                    </a>

                    <input
                        className="item-searchbar"
                        type="text"
                        placeholder="Search an Item"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={handleKeyPress}
                    ></input>
                </div>
                <div className="right-section">
                    <div className="header-link">
                        <a href="/calculator">Calculator</a>
                    </div>
                    {isLoggedIn && (
                        <>
                            <div className="header-link">
                                <a href="/portfolio">Portfolio</a>
                            </div>
                            <div className="header-link">Account</div>
                        </>
                    )}
                    {!isLoggedIn && (
                        <>
                            <div className="header-link">
                                <a href="/login">Login</a>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default Header;
