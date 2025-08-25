import {useState, useEffect } from 'react'
import Header from '../components/Header'
import SearchItem from "../components/SearchItem";
import axios from 'axios';

const SearchPage = () => {
    const queryParams = new URLSearchParams(window.location.search)
    const queryName = queryParams.get("product")
    const [latestBazaar, setLatestBazaar] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);

    useEffect(() => {
        const fetchItemData = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:4000/api/latestBazaar",
                    { withCredentials: true }
                );
                console.log("RESPONSE:");
                const data = response.data;
                setLatestBazaar(data.latestBazaar);

            } catch (err) {
                console.log("Error fetching user data: ", err);
            }
        };
        fetchItemData();
    }, []);

    useEffect(() => {
        const getSearchedItems = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:4000/api/search",
                    {params: {product: queryName}}
                );
                console.log("RESPONSE:");
                const data = response.data;
                setFilteredItems(data)

            } catch (err) {
                console.log("Error fetching user data: ", err);
            }
        };
        getSearchedItems();
    }, []);

    return (
    <>
        <Header/>
        {(latestBazaar.length === 0 || filteredItems.length === 0) && (
            <div className="loader"></div>
        )}
        {(latestBazaar.length !== 0 && filteredItems.length !== 0) && (
            <>
            <div className="search-grid">
            {Object.keys(filteredItems).map((itemName, index) => {
                        return (
                            <SearchItem
                                displayName={itemName}
                                internalName={filteredItems[itemName]}
                                latestBazaar={latestBazaar.products[filteredItems[itemName]]}
                            />
                        );
                    })}
            </div>
            </>
        )}
        
    </>

    )
}

export default SearchPage