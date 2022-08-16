import React, { useEffect, useState } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import Header from '../../Components/Header/Header';
import 'moment-timezone';
import jwt_decode from "jwt-decode";
import "./Followers.scss"

const Followers = () => {
    const { userId } = useParams()
    const [followers, setFollowers] = useState()
    const [following, setFollowing] = useState()
    const token = window.localStorage.getItem("token")
    const decoded = jwt_decode(token);
    const [user, setUser] = useState()

    useEffect(() => {
        fetch("http://localhost:9000/userFound", {
            method: "GET",
            headers: {
                "Content-type": "application/json",
                "email": decoded?.user_email
            }
        })
            .then(res => res.json())
            .then(data => {
                if (!data) {
                    return
                } else {
                    setUser(data)
                }
            })
    }, [decoded]);

    useEffect(() => {
        fetch(`http://localhost:9000/followers/${userId}`, {
            method: "GET",
            headers: {
                "Content-type": "application/json"
            }
        })
            .then(res => res.json())
            .then(data => {
                if (!data) {
                    return
                } else {
                    setFollowing(data?.following)
                    setFollowers(data?.followers)
                }
            })
    }, [userId]);

    // FOLLOWERS
    const handleFollow = (e) => {
        fetch(`http://localhost:9000/followers`, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                userId: e.target.id,
                followersUserEmail: decoded?.user_email
            })
        })
            .then(res => res.json())
            .then(data => {
                if (!data) {
                    console.log(data);
                    return
                } else {
                    fetch(`http://localhost:9000/followers/${userId}`, {
                        method: "GET",
                        headers: {
                            "Content-type": "application/json"
                        }
                    })
                        .then(res => res.json())
                        .then(data => {
                            if (!data) {
                                return
                            } else {
                                setFollowing(data?.following)
                                setFollowers(data?.followers)
                            }
                        })
                }
            })
    }

    return (<>
        <Header />
        <div className='container '>
            <div>
                <ul className='nav-follow'>
                    <li>
                        <NavLink to={`/followers/${userId}`}>
                            Followers {followers?.length}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={`/following/${userId}`}>
                            Following {following?.length}
                        </NavLink>
                    </li>
                </ul>
            </div>

            <div className='w-50 pe-1'>
                <div>
                    <h1>Followers {followers?.length}</h1>
                </div>
                {
                    followers?.map(e => {
                        return <div
                            class="name-account
                    d-flex align-items-center
                    justify-content-between"
                        >
                            <NavLink to={`/${e?._id}`}>
                                <div className='d-flex align-items-center'>
                                    <img
                                        className='profile_user'
                                        src={e?.profile ? e?.profile :
                                            "https://forum.truckersmp.com/uploads/monthly_2022_02/imported-photo-270490.thumb.png.d1f244f98ab3c0a33ca0e5776cf93a5e.png"}
                                        alt="" />

                                    <div className='ms-3'>
                                        <p className='m-0'>
                                            {e?.name}
                                        </p>
                                        <span className='d-flex'>
                                            {
                                                e?.bio
                                            }
                                        </span>
                                    </div>
                                </div>
                            </NavLink>
                            {
                                e?.email == decoded?.user_email ? "" :
                                    <button onClick={handleFollow}
                                        className={e?.followers?.includes(user?._id) ? "following" : "follow"} id={e?._id}>

                                        {
                                            e?.followers?.includes(user?._id) ? "Unfollow" : "Follow"
                                        }

                                    </button>
                            }

                        </div>
                    })
                }
            </div>

        </div>
    </>);
}

export default Followers;
