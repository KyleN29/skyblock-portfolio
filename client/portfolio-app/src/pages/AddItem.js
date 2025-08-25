import { useState } from 'react';
import Header from '../components/Header'
import axios from 'axios'
import '../styles/header.css'
import '../styles/login.css'


const AddItem = () => {
    const [item, setItem] = useState('');
    const [quantity, setQuantity] = useState('');
    const [buyPrice, setBuyPrice] = useState('');
    const handleAdd = () => {
        const data = {
            item: item,
            quantity: quantity,
            buyPrice: buyPrice,
        }

        axios.post('http://localhost:4000/api/addItem', data, { withCredentials: true })
        .then(response => {

            const authToken = response.data;
            console.log(authToken);
            console.log(response.data)
            console.log(response.status)
          })
          .catch(error => {

            console.log(error);
          });
    }

    return (
        <>
        <Header/>
        <div className="login-title">
        Add Item
    </div>
    <hr className="login-title-line"></hr>
    <div className="login-container">
        <input className="email-login" value={item} type="text" placeholder="Name" onChange={(e) => setItem(e.target.value)}></input>
        <input className="password-login" value={quantity} type="text" placeholder="Quantity" onChange={(e) => setQuantity(e.target.value)}></input>
        <input className="password-login" value={buyPrice} type="text" placeholder="Buy Price" onChange={(e) => setBuyPrice(e.target.value)}></input>
        <button className="login-button" onClick={handleAdd}>Add</button>
    </div>
        </>
    )
}

export default AddItem