/** 
* Add commas to a number along with an optional symbol prefix and the option to show a negative/positive sign
* 
*/
export function formatNumberWithSuffix(number, symbolPrefix = "", useSign = true) {
    const suffixes = ["", "K", "M", "B", "T"]; // Updated suffixes array
    var num = Math.abs(number);
    const sign = Math.sign(number);
    let i = 0;
    while (num >= 1000 && i < suffixes.length - 1) {
        // Updated while loop condition
        num /= 1000;
        i++;
    }
    const formattedNumber = parseFloat(num.toFixed(i === 0 ? 0 : 1)); // Adjusted decimal places
    let signPrefix = "";
    if (useSign) {
        if (sign > 0) {
            signPrefix = "+";
        } else {
            signPrefix = "-";
        }
    }
    return `${signPrefix}${symbolPrefix}${formattedNumber}${suffixes[i]}`;
}

export function formatString(str) {
        /** 
    *Replace underscores with spaces and convert to pascal formatting
    */
    // Split the string into an array of words
    var words = str.toLowerCase().split('_');
    
    // Capitalize the first letter of each word
    for (var i = 0; i < words.length; i++) {
      words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
    }
    
    // Join the words with spaces to form the final formatted string
    var formattedStr = words.join(' ');
    
    return formattedStr;
  }

export function addCommasToNumber(number) {
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