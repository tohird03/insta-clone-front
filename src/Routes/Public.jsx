import { useContext } from "react"
import { Outlet, useLocation, Navigate } from "react-router-dom"
import { Context } from "../Context/AuthToken"
import Content from "../Pages/Content/Content";
import Home from '../Pages/Home/Home';
import Login from "../Pages/Login/Login";

const Public = () => {
    const { login } = useContext(Context)
    const token = window.localStorage.getItem("token")
    const {pathname} = useLocation()

    if(!token) {
        return <Login/>
    }

    if(token && pathname === "/"){
        return <Home/> || <Content/>
    }

    return <Outlet/>
}

export default Public;
