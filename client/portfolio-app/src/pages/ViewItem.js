import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/viewItem.css";
import { formatNumberWithSuffix, formatString } from "../helper";
const ViewItem = () => {
    const [isLoggedIn, setIsLoggedIn] = useState("");
    const [isPortfolio, setIsPortfolio] = useState(1);


    const [validItem, setValidItem] = useState(false);
    let { item } = useParams();
    const navigate = useNavigate();
    const [internalItem, setInternalItem] = useState("");
    const [sellPrice, setSellPrice] = useState("");
    const [buyPrice, setBuyPrice] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    // Add form
    const [addQuantity, setAddQuantity] = useState("");
    const [addBuyPrice, setAddBuyPrice] = useState("");

    // Watchlist form
    const [watchlistPrice, setWatchlistPrice] = useState("");
    const [watchlistNote, setWatchlistNote] = useState("");
    
    const fetchLatestBazaar = async (item) => {
        try {
            const response = await axios.get(
                "http://localhost:4000/api/latestBazaar"
            );
            const data = await response.data.latestBazaar;
            setBuyPrice(data.products[item].quick_status.buyPrice);
            setSellPrice(data.products[item].quick_status.sellPrice);
        } catch (err) {
            console.log("Error: ", err);
        }
    };

    const handleAdd = () => {
        const data = {
            item: internalItem,
            quantity: parseInt(addQuantity.replace(/,/g, "")),
            buyPrice: parseFloat(addBuyPrice.replace(/,/g, "")),
        };

        axios
            .post("http://localhost:4000/api/addItem", data, {
                withCredentials: true,
            })
            .then((response) => {

                const authToken = response.data;
                console.log(authToken);
                console.log(response.data);
                console.log(response.status);
                navigate("/portfolio");
            })
            .catch((error) => {

                console.log(error);
                setErrorMessage(error.response.data);
            });
    };

    const handleWatchlist = () => {
        const data = {
            item: internalItem,
            markedPrice: parseFloat(watchlistPrice.replace(/,/g, "")),
            note: watchlistNote,
        };

        axios
            .post("http://localhost:4000/api/markItem", data, {
                withCredentials: true,
            })
            .then((response) => {

                const authToken = response.data;
                console.log(authToken);
                console.log(response.data);
                console.log(response.status);
                navigate("/portfolio");
            })
            .catch((error) => {

                console.log(error);
                setErrorMessage(error.response.data);
            });
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

    useEffect(() => {
        console.log(item);
        axios
            .post("http://localhost:4000/api/checkItem", { name: item })
            .then((response) => {
                setValidItem(true);
                setInternalItem(response.data);
                fetchLatestBazaar(response.data);
            })
            .catch((error) => navigate("/"));
    }, []);

    return (
        <>
            <Header />
            {(!validItem || !buyPrice || !sellPrice) && (
                <div className="loader"></div>
            )}
            {validItem && buyPrice && sellPrice && (
                <>
                    <div className="item-title">{formatString(item)}</div>
                    <hr className="item-title-line"></hr>
                    <div className="item-info-container">
                        <div className="buy-info">
                            <div className="buy-info-title">Buy Price</div>
                            <div className="buy-info-amount">
                                {formatNumberWithSuffix(buyPrice, "$", false)}
                            </div>
                        </div>
                        <div className="sell-info">
                            <div className="sell-info-title">Sell Price</div>
                            <div className="sell-info-amount">
                                {formatNumberWithSuffix(sellPrice, "$", false)}
                            </div>
                        </div>
                    </div>
                    {!isLoggedIn && (
                        <div className="add-item-container">
                            <div className="add-item-title">
                                Login to add to your portfolio
                            </div>
                        </div>
                    )}
                    {isLoggedIn && (
                        <>
                            {!isPortfolio && (
                                <>
                                    <div className="add-item-container">
                                        <div className="watchlist-container">
                                            <button
                                                className="watchlist"
                                                onClick={(e) =>
                                                    setIsPortfolio(1)
                                                }
                                            >
                                                Portfolio
                                            </button>
                                        </div>

                                        <div className="add-item-title">
                                            Add to watchlist
                                        </div>
                                        <div className="row">
                                            <div className="input-header">
                                                Mark Price:
                                            </div>
                                            <input
                                                placeholder="11.2"
                                                type="text"
                                                className="add-input"
                                                value={watchlistPrice}
                                                onChange={(e) => setWatchlistPrice(e.target.value)}
                                            ></input>
                                        </div>
                                        <div className="add-note-row">
                                            <div className="input-header">
                                                Note:
                                            </div>
                                            <textarea
                                                maxlength="250"
                                                placeholder=""
                                                type="text"
                                                value={watchlistNote}
                                                className="add-note"
                                                onChange={(e) => setWatchlistNote(e.target.value)}
                                            ></textarea>
                                        </div>
                                        <button onClick={handleWatchlist} className="add-button">
                                            Add
                                        </button>
                                    </div>
                                </>
                            )}
                            {isPortfolio && (
                                <>
                                    <div className="add-item-container">
                                        <div class="watchlist-container">
                                            <button
                                                class="watchlist"
                                                onClick={(e) =>
                                                    setIsPortfolio(0)
                                                }
                                            >
                                                Watchlist
                                            </button>
                                        </div>
                                        <div className="add-item-title">
                                            Add to portfolio
                                        </div>
                                        <div className="row">
                                            <div className="input-header">
                                                Buy Price:
                                            </div>
                                            <input
                                                placeholder={
                                                    Math.round(buyPrice * 100) /
                                                    100
                                                }
                                                onChange={(e) =>
                                                    setAddBuyPrice(
                                                        e.target.value
                                                    )
                                                }
                                                type="text"
                                                className="add-input"
                                            ></input>
                                        </div>
                                        <div className="row">
                                            <div className="input-header">
                                                Quantity:
                                            </div>
                                            <input
                                                value={addQuantity}
                                                onChange={(e) =>
                                                    setAddQuantity(
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="64"
                                                type="text"
                                                className="add-input"
                                            ></input>
                                        </div>
                                        <button
                                            className="add-button"
                                            onClick={handleAdd}
                                        >
                                            Add
                                        </button>
                                        <div className="error">
                                            {errorMessage}
                                        </div>
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </>
            )}
        </>
    );
};

export default ViewItem;
