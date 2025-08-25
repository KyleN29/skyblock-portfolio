import '../styles/searchItem.css'

function SearchItem({displayName, latestBazaar}) {

    function addCommasToNumber(number) {
        // Convert the number to a string
        let numStr = String(number);

        // Separate the integer and decimal parts (if any)
        let parts = numStr.split(".");
        let integerPart = parts[0];
        let decimalPart = parts[1] || "";

        // Add commas to the integer part
        let integerWithCommas = integerPart.replace(
            /\B(?=(\d{3})+(?!\d))/g,
            ","
        );

        // Combine the integer and decimal parts with a dot
        let result = integerWithCommas;
        if (decimalPart.length > 0) {
            result += "." + decimalPart;
        }

        return result;
    }


    return (
        <>
            <a href={'/product/'+displayName.toLowerCase().split(' ').join('_')}>
                <div className="search-item">
                    <div className="search-title-row">
                        <div className="search-title">{displayName}</div>
                    </div>
                    <div className="search-info-row">

                        <div className="search-info-stat">Buy Price: <span className="search-coin-stat">{addCommasToNumber(Math.round(latestBazaar.quick_status.buyPrice * 10)/10)} coins</span></div>
                        <div className="search-info-stat">Sell Price: <span className="search-coin-stat">{addCommasToNumber(Math.round(latestBazaar.quick_status.sellPrice * 10)/10)} coins</span></div>
                        <div className="search-info-stat">Supply: <span className="search-coin-stat">{addCommasToNumber(latestBazaar.quick_status.sellVolume)}</span></div>
                        <div className="search-info-stat">Demand: <span className="search-coin-stat">{addCommasToNumber(latestBazaar.quick_status.buyVolume)}</span></div>
                        <div className="search-info-stat">Instabuys: <span className="search-coin-stat">{addCommasToNumber(latestBazaar.quick_status.buyMovingWeek)}</span></div>
                        <div className="search-info-stat">Instasells: <span className="search-coin-stat">{addCommasToNumber(latestBazaar.quick_status.sellMovingWeek)}</span></div>
                    </div>
                </div>
            </a>
        </>
    );
}

export default SearchItem;
