import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import axios from "axios";
import "../styles/header.css";
import "../styles/calculator.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [buyPrice, setBuyPrice] = useState('0');
    const [sellPrice, setSellPrice] = useState('0');
    const [quantity, setQuantity] = useState('1');
    const [tax, setTax] = useState('0.0125');
    const [profit, setProfit] = useState('');
    const navigate = useNavigate();

    function formatNumberWithSuffix(number, symbolPrefix = "", useSign = true) {
        var num = Math.abs(number);
        const sign = Math.sign(number);

        let signPrefix = "";
        if (useSign) {
            if (sign > 0) {
                signPrefix = "+";
            } else {
                signPrefix = "-";
            }
        }

        return signPrefix + symbolPrefix + num;
    }

    function calculateProfit() {
        try {
            const calculatedProfit = parseFloat(sellPrice.replace(/,/g, '')) * (1 - parseFloat(tax.replace(/,/g, ''))) - parseFloat(buyPrice.replace(/,/g, ''));
            setProfit(calculatedProfit);
        } catch (error) {
            setProfit('ERROR')
        }

    }

    return (
        <>
            <Header />

            <div className="login-title">Profit Calculator</div>
            <hr className="login-title-line"></hr>

            <div className="login-container">
                <div className="input-header">Buy Price</div>
                <input
                    className="email-login"
                    type="text"
                    placeholder="Buy Price"
                    value={buyPrice}
                    onChange={(e) => setBuyPrice(e.target.value)}
                ></input>
                <div className="input-header">Sell Price</div>
                <input
                    className="password-login"
                    type="text"
                    placeholder="Sell Price"
                    value={sellPrice}
                    onChange={(e) => setSellPrice(e.target.value)}
                ></input>
                                <div className="input-header">Quantity</div>
                <input
                    className="password-login"
                    type="text"
                    placeholder="Quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                ></input>
                <div className="input-header">Tax</div>
                <input
                    className="password-login"
                    type="text"
                    placeholder="Sell Tax"
                    value={tax}
                    onChange={(e) => setTax(e.target.value)}
                ></input>
                <button className="login-button" onClick={calculateProfit}>
                    Calculate
                </button>
                <div className="profit">
                    Profit:{" "}
                    <span className={profit < 0 ? "money-down" : "money-up"}>
                        {formatNumberWithSuffix(
                            Math.round(profit * 100) / 100,
                            "$"
                        )}
                    </span>
                    <span className={profit < 0 ? "money-down" : "money-up"}> ({formatNumberWithSuffix(
                            Math.round((profit * parseFloat(quantity.replace(/,/g, ''))) * 100) / 100,
                            "$"
                        )})</span>
                </div>
            </div>
        </>
    );
};

export default Login;
