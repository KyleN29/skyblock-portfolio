import React, { useState, useEffect } from "react";
import Item from "../components/Item";
import MarkedItem from "../components/MarkedItem";
import Header from "../components/Header";
import axios from "axios";
import "../styles/item.css";
import "../styles/header.css";
import "../styles/portfolio.css";
import { useNavigate } from "react-router-dom";
import { formatNumberWithSuffix } from "../helper";

function Portfolio() {
    const [isLoggedIn, setIsLoggedIn] = useState("");
    const [totalInvestment, setInvestmentSum] = useState("0");
    const [profitSum, setProfitSum] = useState("0");
    const [latestBazaar, setLatestBazaar] = useState([]);
    const [userData, setUserData] = useState([]);
    const [watchlistData, setWatchlistData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Check if user is already logged in
    useEffect(() => {
        axios
            .get("http://localhost:4000/api/auth", { withCredentials: true })
            .then((response) => {
                setIsLoggedIn(true);
            })
            .catch((error) => {
                setIsLoggedIn(false);
                navigate("/login");
            });
    }, []);

    useEffect(() => {
        const fetchItemData = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:4000/api/users",
                    { withCredentials: true }
                );

                const data = await response.data;
                setUserData(data.userItems);
                setWatchlistData(data.watchlistItems);
                setLatestBazaar(data.latestBazaar);
                setLoading(false);

            } catch (err) {
                console.log("Error fetching user data: ", err);
            }
        };
        fetchItemData();
    }, []);

    useEffect(() => {
        const calculateTotalProfit = () => {
            if (latestBazaar && userData) {
                let totalProfit = 0;
                console.log(userData);
                userData.map((item, index) => {
                    if (item.quantity > 0) {
                        console.log(item);
                        totalProfit +=
                            (latestBazaar.products[item.item].quick_status
                                .buyPrice *
                                0.98875 -
                                userData[index].buyPrice) *
                            item.quantity;
                    }
                });
                setProfitSum(formatNumberWithSuffix(totalProfit, "$", true));
            }
        };
        calculateTotalProfit();
    }, [userData, latestBazaar, setProfitSum]);

    useEffect(() => {
        const calculateTotalProfit = () => {
            if (latestBazaar && userData) {
                let totalInvestment = 0;
                console.log(userData);
                userData.map((item, index) => {
                    if (item.quantity > 0) {
                        console.log(item);
                        totalInvestment += item.buyPrice * item.quantity;
                    }
                });
                setInvestmentSum(
                    formatNumberWithSuffix(totalInvestment, "$", false)
                );
            }
        };
        calculateTotalProfit();
    }, [userData, latestBazaar, setInvestmentSum]);

    return (
        <>
            <Header />
            <div className="update-container">
                <div className="update-title">
                    Last Updated: {loading && <>Loading...</>}
                    {!loading && (
                        <>
                            {new Date(latestBazaar.time).toLocaleTimeString(
                                [],
                                { hour: "2-digit", minute: "2-digit" }
                            )}
                        </>
                    )}
                </div>
            </div>
            <div className="login-title">Your Portfolio</div>
            <hr className="login-title-line"></hr>
            {!loading && (
                <>
                    <div className="profit-title-container">
                        <div className="investment-title">
                            Total Investment: <span>{totalInvestment}</span>
                        </div>
                    </div>
                    <div className="profit-title-container">
                        <div className="profit-title">
                            Total Profit:{" "}
                            <span
                                className={
                                    profitSum < 0 ? "money-down" : "money-up"
                                }>
                                {profitSum}
                            </span>
                        </div>
                    </div>
                </>
            )}

            {loading && <div className="loader"></div>}

            <div className="portfolio-grid">
                {userData.map((item, index) => {
                    return (
                        <Item
                            key={index}
                            item={item}
                            latestBazaar={latestBazaar}
                        />
                    );
                })}
            </div>
            <div className="login-title grid-gap">Your Watchlist</div>
            <hr className="login-title-line"></hr>
            <div className="marked-item-grid">
                {watchlistData.map((item, index) => {
                    return (
                        <MarkedItem
                            markedItem={item}
                            latestBazaar={latestBazaar}
                        />
                    );
                })}
            </div>
        </>
    );
}

export default Portfolio;
