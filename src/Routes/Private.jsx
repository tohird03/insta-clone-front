import React, { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { Context } from '../Context/AuthToken';
import Home from '../Pages/Home/Home';
import Login from '../Pages/Login/Login';

const Private = () => {
    const { login } = useContext(Context)
    const token = window.localStorage.getItem("token")
    console.log(login);
    if(login){
        return <Outlet/>
    }else{
        return <Login/>
    }
}

export default Private;
