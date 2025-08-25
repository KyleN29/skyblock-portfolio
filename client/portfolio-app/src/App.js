import React from 'react'
import Portfolio from './pages/Portfolio'
import Home from './pages/Home'
import Login from './pages/Login'
import AddItem from './pages/AddItem'
import Register from './pages/Register'
import ViewItem from './pages/ViewItem'
import Calculator from './pages/Calculator'
import SearchPage from './pages/SearchPage'
import './styles/item.css'
import './styles/header.css'
import { BrowserRouter, Routes, Route} from 'react-router-dom'


export default function App() {
  return (
    <>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="portfolio" element={<Portfolio/>}/>
                <Route path="login" element={<Login/>}/>
                <Route path="additem" element={<AddItem/>}/>
                <Route path="register" element={<Register/>}/>
                <Route path="/product/:item" element={<ViewItem/>}/>
                <Route path="calculator" element={<Calculator/>}/>
                <Route path="search" element={<SearchPage/>}/>
            </Routes>
        </BrowserRouter>
    </>
  );
}