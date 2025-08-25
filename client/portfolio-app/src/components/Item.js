import { useState } from "react";
import pencilImg from "../assets/Dollar_Sign.svg.png";
import xImg from "../assets/x_icon_150997.png";
import axios from "axios";

import { formatNumberWithSuffix, addCommasToNumber, formatString } from "../helper";

function Item({ item, latestBazaar}) {
    const [isEditing, setIsEditing] = useState(false);
    const [sellPrice, setSellPrice] = useState("0");
    const [sellQuantity, setSellQuantity] = useState("0");
    const [quantity, setQuantity] = useState(item.quantity);

    const profitMoneyAlltime =
        (latestBazaar.products[item.item].quick_status.buyPrice * 0.98875 -
            item.buyPrice) *
        item.quantity;
    const profitPercentageAlltime =
        ((latestBazaar.products[item.item].quick_status.buyPrice * 0.98875) /
            item.buyPrice -
            1) *
        100;

    const handleEdit = () => {
        const data = {
            _id: item._id,
            sellQuantity: sellQuantity
        };

        axios
            .put("http://localhost:4000/api/users/SellItem", data, {
                withCredentials: true,
            })
            .then((response) => {
                setQuantity(response.data.quantity);
                setIsEditing(false);
            })
            .catch((error) => {

                console.log(error);
            });
    };

    return (
        <>
            {quantity > 0 && (
                <>
                    <div className="item">
                        {isEditing && (
                            <>
                                <div className="edit-container">
                                    <img
                                        className="x-image"
                                        src={xImg}
                                        alt=""
                                        onClick={() => setIsEditing(false)}
                                    ></img>
                                    <div className="edit-quantity">
                                        Quantity: {quantity}
                                    </div>
                                    <div className="edit-bottom">
                                        <div className="edit-input-row">
                                            <div className="edit-input-header">
                                                Sell Quantity:
                                            </div>
                                            <input
                                                className="edit-input"
                                                type="text"
                                                value={sellQuantity}
                                                onChange={(e) =>
                                                    setSellQuantity(
                                                        e.target.value
                                                    )
                                                }
                                            ></input>
                                        </div>
                                        <div className="edit-input-row">
                                            <div className="edit-input-header">
                                                Sell Price:
                                            </div>
                                            <input
                                                className="edit-input"
                                                type="text"
                                                value={sellPrice}
                                                onChange={(e) =>
                                                    setSellPrice(e.target.value)
                                                }
                                            ></input>
                                        </div>
                                        <div className="edit-input-row">
                                            <button
                                                onClick={handleEdit}
                                                className="edit-button"
                                            >
                                                Sell Items
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {!isEditing && (
                            <>
                                <div className="title-row">

                                    <div className="title">
                                        {formatString(item.item)}
                                    </div>
                                    <img
                                        className="edit-image"
                                        src={pencilImg}
                                        onClick={() => setIsEditing(true)}
                                        alt=""
                                    ></img>
                                </div>
                                <div className="info-row">
                                    <div className="info">
                                        Bought At:{" "}
                                        <span
                                            className={
                                                profitMoneyAlltime < 0
                                                    ? "money-down"
                                                    : "money-up"
                                            }
                                        >
                                            $
                                            {addCommasToNumber(
                                                Math.round(
                                                    item.buyPrice * 100
                                                ) / 100
                                            )}
                                        </span>
                                    </div>
                                    
                                    <div className="info">
                                        Profit:{" "}
                                        <span
                                            className={
                                                profitMoneyAlltime < 0
                                                    ? "money-down"
                                                    : "money-up"
                                            }
                                        >
                                            {formatNumberWithSuffix(
                                                profitPercentageAlltime
                                            )}
                                            % /{" "}
                                            {formatNumberWithSuffix(
                                                profitMoneyAlltime,
                                                "$"
                                            )}
                                        </span>
                                    </div>
                                    <div className="stat-info">
                                        <div className="block">
                                            <div className="title">Qty</div>
                                            <div className="amount">
                                                <span>
                                                    {formatNumberWithSuffix(
                                                        quantity,
                                                        "",
                                                        false
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="block">
                                            <div className="title">
                                                Cur Sell
                                            </div>
                                            <div className="amount">
                                                $
                                                {addCommasToNumber(
                                                    Math.round(
                                                        latestBazaar.products[
                                                            item.item
                                                        ].quick_status
                                                            .sellPrice * 10
                                                    ) / 10
                                                )}
                                            </div>
                                        </div>
                                        <div className="block">
                                            <div className="title">Cur Buy</div>
                                            <div className="amount">
                                                $
                                                {addCommasToNumber(
                                                    Math.round(
                                                        latestBazaar.products[
                                                            item.item
                                                        ].quick_status
                                                            .buyPrice * 10
                                                    ) / 10
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </>
            )}
        </>
    );
}

export default Item;
