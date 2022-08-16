import React, { useContext } from 'react';
import "../Login/Login.scss"
import { Navigate } from "react-router-dom";
import { useState } from 'react';
import { Context } from '../../Context/AuthToken';
import { Redirect } from 'react-router-dom';
import Home from '../Home/Home';
const Login = () => {
    const [loginErr, setLoginErr] = useState(null)
    const { setLogin } = useContext(Context)
    const handleRegester = (e) => {
        e.preventDefault()

        const { email, name, password, reset_password } = e.target

        fetch("https://insta-oo3.herokuapp.com/userRegester", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                email: email.value,
                name: name.value,
                password: password.value,
                reset_password: reset_password.value
            })
        })
            .then(res => res.json())
            .then(data => {
                if (!data) {
                    return
                } else {
                    if (data.loggedIn) {
                        console.log(data);
                        window.localStorage.setItem('token', data.token)
                        setLogin(data.loggedIn)
                        return
                    } else {
                        setLoginErr(data)
                    }
                }
            })
    }

    const handleLogin = (e) => {
        e.preventDefault()

        const { name, password } = e.target

        fetch("https://insta-oo3.herokuapp.com/userLogin", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                name: name.value,
                password: password.value
            })
        })
            .then(res => res.json())
            .then(data => {
                if (!data) {
                    return
                } else {
                    if (data.loggedIn) {
                        setLogin(data.loggedIn)
                        window.localStorage.setItem('token', data.token)
                    } else {
                        setLoginErr(data)
                    }
                }
            })
    }
    return <div className='login_body'>
        <a href="tg://resolve?domain=savM_571_632" className="logo" target="_blank">
            <p>Minigramm Tohirjon</p>
        </a>

        <div className="section">
            <div className="container">
                <div className="row full-height justify-content-center">
                    <div className="col-12 text-center align-self-center py-5">
                        <div className="section pb-5 pt-5 pt-sm-2 text-center">
                            <h6 className="mb-0 pb-3"><span>Log In </span><span>Sign Up</span></h6>

                            <input className="checkbox" type="checkbox" id="reg-log" name="reg-log" />
                            <label htmlFor="reg-log"></label>
                            <p className='err'>
                                {
                                    loginErr?.loggedIn == null || loginErr?.loggedIn == true ? "" : (<p className='err_symbol'>
                                        <span className="material-symbols-outlined">error</span>
                                        <p>{loginErr?.status} </p>
                                    </p>)
                                }
                            </p>
                            <div className="card-3d-wrap mx-auto">
                                <div className="card-3d-wrapper">
                                    <div className="card-front">
                                        <div className="center-wrap">
                                            <form onSubmit={handleLogin}>
                                                <div className="section text-center">
                                                    <h4 className="mb-4 pb-3">Log In</h4>
                                                    <div className="form-group">
                                                        <input type="text" name="name" className="form-style" placeholder="Your name" id="name" maxLength="32" required />
                                                        <i className="input-icon uil uil-at"></i>
                                                    </div>
                                                    <div className="form-group mt-2">
                                                        <input type="password" name="password" className="form-style" placeholder="Your Password" id="logpass" maxLength="16" minLength="8" required />

                                                        <i className="input-icon uil uil-lock-alt"></i>
                                                    </div>

                                                    <button type='submit' className="btn mt-4">
                                                        login
                                                    </button>
                                                    <p className="mb-0 mt-4 text-center">
                                                        <a href="#0" className="link">Forgot your password?</a></p>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                    <div className="card-back">
                                        <div className="center-wrap">
                                            <form onSubmit={handleRegester}>
                                                <div className="section text-center">
                                                    <h4 className="mb-4 pb-3">Sign Up</h4>
                                                    <div className="form-group mt-2">
                                                        <input type="email" name="email" className="form-style" placeholder="Your Email" id="logemail" maxLength="32" required />
                                                        <i className="input-icon uil uil-at"></i>
                                                    </div>

                                                    <div className="form-group mt-2">
                                                        <input type="text" name="name" className="form-style" placeholder="Your name" id="name" maxLength="32" required />
                                                        <i className="input-icon uil uil-at"></i>
                                                    </div>

                                                    <div className="form-group mt-2">
                                                        <input type="password" name="password" className="form-style" placeholder="Your Password" id="logpass" maxLength="16" minLength="8" required />
                                                        <i className="input-icon uil uil-lock-alt"></i>
                                                    </div>
                                                    <div className="form-group mt-2">
                                                        <input type="password" name="reset_password" className="form-style" placeholder="Reset Password" id="logpass" maxLength="16" minLength="8" required />
                                                        <i className="input-icon uil uil-lock-alt"></i>
                                                    </div>
                                                    <button type='submit' className="btn mt-4">submit</button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default Login;
