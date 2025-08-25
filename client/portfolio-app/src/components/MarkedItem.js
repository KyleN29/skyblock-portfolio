import { useState } from "react";
import styles from "./markedItem.module.css";
import axios from "axios";
import {
    formatNumberWithSuffix,
    addCommasToNumber,
    formatString,
} from "../helper";
function MarkedItem({ markedItem, latestBazaar }) {
    const [isEditing, setIsEditing] = useState(false);
    const [sellPrice, setSellPrice] = useState("0");
    const [sellQuantity, setSellQuantity] = useState("0");
    const [savedDescription, setSavedDescription] = useState(markedItem.note);
    const [editDescription, setEditDescription] = useState(markedItem.note);

    const profitMoneyAlltime =
        latestBazaar.products[markedItem.item].quick_status.sellPrice * 0.98875 -
        markedItem.markedPrice;
    const profitPercentageAlltime =
        ((latestBazaar.products[markedItem.item].quick_status.sellPrice *
            0.98875) /
            markedItem.markedPrice -
            1) *
        100;


    const toggleEdit = () => setIsEditing(!isEditing);


    const handleDescriptionChange = (event) => {
        setEditDescription(event.target.value);
    };


    const saveDescription = () => {

    toggleEdit();

    console.log('Saving description:', editDescription);
    setSavedDescription(editDescription);

    saveDescriptionToDatabase();
    };

    const saveDescriptionToDatabase = () => {
        const data = {
            _id: markedItem._id,
            newDescription: editDescription,
        };

        axios
            .put("http://localhost:4000/api/MarkItem", data, {
                withCredentials: true,
            })
            .catch((error) => {

                console.log(error);
            });
    };

    return (
        <>
            <div className={styles.marked_item}>
                <div className={styles.marked_title_row}>
                    <div className={styles.marked_title}>
                        {formatString(markedItem.item)}
                    </div>
                </div>
                <div className={styles.label_container}>
                    <div className={styles.important_label}>
                        Marked Price: <br></br>
                        <span className={styles.marked_price}>
                            ${addCommasToNumber(markedItem.markedPrice)}
                        </span>
                    </div>
                    <div className={styles.important_label}>
                        Price Change:
                        <br></br>
                        <span className={styles.marked_price}>
                            <span
                                className={
                                    profitMoneyAlltime > 0
                                        ? "money-down"
                                        : "money-up"
                                }>
                                {formatNumberWithSuffix(
                                    profitPercentageAlltime,
                                    "",
                                    true
                                )}
                                %
                            </span>{" "}
                            /{" "}
                            <span
                                className={
                                    profitMoneyAlltime > 0
                                        ? "money-down"
                                        : "money-up"
                                }>
                                {formatNumberWithSuffix(
                                    profitMoneyAlltime,
                                    "$",
                                    true
                                )}
                            </span>
                        </span>
                    </div>
                </div>
                <hr className={styles.description_divider}></hr>

                {isEditing ? (
                    <textarea
                    data-gramm="false"
                    className={styles.edit_description}
                    value={editDescription}
                    onChange={handleDescriptionChange}
                    />
                ) : (
                    <div className={styles.description}>
                    {savedDescription}
                    </div>
                )}
                <button 
                onClick={toggleEdit}
                className={styles.edit_button}
                >
                    {isEditing ? 'Cancel' : 'Edit'}
                </button>

                {isEditing && (
                    <button onClick={saveDescription}>
                    Save
                    </button>
                )}

                <hr className={styles.description_divider}></hr>
                <div className={styles.bazaar_info}>
                    <div className={styles.block}>
                        <div className={styles.label}>Cur Sell</div>
                        <div className={styles.bazaar_price}>${addCommasToNumber(Math.round(latestBazaar.products[markedItem.item].quick_status.sellPrice*10)/10)}</div>
                    </div>
                    <div className={styles.block}>
                        <div className={styles.label}>Cur Buy</div>
                        <div className={styles.bazaar_price}>${addCommasToNumber(Math.round(latestBazaar.products[markedItem.item].quick_status.buyPrice*10)/10)}</div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default MarkedItem;
