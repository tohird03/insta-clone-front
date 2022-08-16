import { createContext, useState, useEffect } from "react";

const Context = createContext()

function Provider({children}){
    let [login, setLogin] = useState(null)
    let [ userProfile, setUserProfile] = useState({})
    useEffect(() => {
        fetch("https://insta-oo3.herokuapp.com/getlogin", {
            method: "GET",
            headers: {
                "Content-type": "application/json",
                "authtoken": window.localStorage.getItem('token')
            }
        })
            .then(res => res.json())
            .then(data => {
                if(!data) {
                    return
                }else  {
                    setLogin(data?.loggedIn)
                }
            })
    }, []);

    return(
        <Context.Provider value={{login, setLogin, userProfile, setUserProfile}}>
            {children}
        </Context.Provider>
    )
}


export { Context, Provider }