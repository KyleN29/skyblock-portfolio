import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import axios from "axios";
import "../styles/header.css";
import "../styles/register.css";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [isLoggedIn, setIsLoggedIn] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    // Check if user is already logged in
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

    const handleRegister = () => {
        const data = {
            name: name,
            email: email,
            password: password,
        };

        axios
            .post("http://localhost:4000/api/register", data, {
                withCredentials: true,
            })
            .then((response) => {
                const authToken = response.data;
                console.log(authToken);
                console.log(response.data);
                console.log(response.status);
                navigate("/");
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <>
            <Header />
            {!isLoggedIn && (
                <>
                    <div className="login-title">Sign Up</div>
                    <hr className="login-title-line"></hr>
                    <div className="login-container">
                        <input
                            className="name-login"
                            type="text"
                            placeholder="Username"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        ></input>
                        <input
                            className="email-login"
                            type="text"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        ></input>
                        <input
                            className="password-login"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        ></input>
                        <button
                            className="login-button"
                            onClick={handleRegister}
                        >
                            Sign up
                        </button>
                        <div className="login-link">
                            <a href="login">Already a user? Login</a>
                        </div>
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
    );
};

export default Register;
