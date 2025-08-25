import React, { useState, useEffect } from 'react';
import Header from '../components/Header'
import axios from 'axios'
import '../styles/header.css'
import '../styles/login.css'
import { useNavigate } from "react-router-dom";


const Login = () => {
    const [isLoggedIn, setIsLoggedIn] = useState('')
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:4000/api/auth', { withCredentials: true })
            .then(response => {
            setIsLoggedIn(true);
            })
            .catch(error => {
            setIsLoggedIn(false);
            });
        }, []);
    
    

    const handleLogin = () => {
        const data = {
            email: email,
            password: password
        }

        axios.post('http://localhost:4000/api/auth', data, { withCredentials: true })
        .then(response => {

            navigate('/')
          })
          .catch(error => {
            console.log(error);
          });
    }

    return (
        <>
        <Header/>
        {!isLoggedIn && (
            <>
                    <div className="login-title">
            Login
        </div>
        <hr className="login-title-line"></hr>
        <div className="login-container">
            <input className="email-login" type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}></input>
            <input className="password-login" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
            <button className="login-button" onClick={handleLogin}>Login</button>
            <div className="sign-up"><a href="/register">Sign up</a></div>
        </div>
            </>
        )}
        {isLoggedIn && (
              <>
              <div className="login-title">
                  You are already logged in.
              </div>
                </>
        )}
        </>
    )
}

export default Login