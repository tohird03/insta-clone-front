import React, { useContext, useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { Context } from '../../Context/AuthToken';

const OtherProfile = () => {
    const [userProfile, setUserProfile] = useState()
    const { userId } = useParams()
    console.log(userId);
    useEffect(() => {
        fetch(`http://localhost:9000/otherUser/${userId}`, {
            method: "GET",
            headers: {
                "Content-type": "application/json",
            }
        })
            .then(res => res.json())
            .then(data => {
                if (!data) {
                    console.log(data);
                    return
                } else {
                    setUserProfile(data)
                }
            })
    }, [userId]);

    return (
        <div>
            {/* HEADER TOP */}
            <header>
                <div id="header-top">
                    <div className='container py-2'>

                        <h2 className='logo_name '>
                            <b>MYDT BLOG</b>
                        </h2>
                        <input className='search_input' type="search" placeholder='Search' />
                        <div className='d-flex align-items-center'>
                            <NavLink to="/content" className="d-flex link text-dark">
                                <span class="material-symbols-outlined cursor">
                                    home
                                </span>
                            </NavLink>
                            <span class={`material-symbols-outlined cursor bg-dark text-light `}>
                                add_box
                            </span>
                            <span class="material-symbols-outlined cursor">
                                explore
                            </span>
                            <span class="material-symbols-outlined cursor">
                                favorite
                            </span>
                            <NavLink to="/" className="d-flex link text-dark">
                                <span class="material-symbols-outlined cursor">
                                    account_circle
                                </span>
                            </NavLink>
                        </div>
                        <div>

                        </div>
                    </div>
                </div >

                <div class="container profiles">

                    <div class="profile">

                        <div class="profile-image">

                            <div className='photo_img'>
                                <img width="175" height="175" src={userProfile?.profile ? userProfile?.profile : "https://forum.truckersmp.com/uploads/monthly_2022_02/imported-photo-270490.thumb.png.d1f244f98ab3c0a33ca0e5776cf93a5e.png"} alt="" />
                            </div>
                        </div>

                        <div class="profile-user-settings">

                            <h1 class="profile-user-name">{userProfile?.name}</h1>
                        </div>
                        <div class="profile-stats">

                            <ul className='m-0 p-0'>
                                <li><span class="profile-stat-count">{userProfile?.posts?.length}</span> posts</li>

                                <li>
                                    <NavLink to={`/followers/${userProfile?._id}`}>
                                        <span id={userProfile?._id} class="profile-stat-count">
                                            {userProfile?.followers?.length}
                                        </span> followers
                                    </NavLink>
                                </li>

                                <li>
                                    <NavLink to={`/following/${userProfile?._id}`}>
                                        <span id={userProfile?._id} class="profile-stat-count">
                                            {userProfile?.following?.length}
                                        </span> following
                                    </NavLink>
                                </li>
                            </ul>

                        </div>

                        <div class="profile-bio">

                            <p>
                                <span class="profile-real-name">BIO</span> Lorem ipsum dolor sit, amet consectetur adipisicing elit 📷✈️🏕️</p>

                        </div>

                    </div>

                </div>

            </header >
            <main style={{ marginTop: "300px" }}>

                <div class="container">

                    <div class="gallery  grid-container">

                        {
                            userProfile?.posts?.length > 0 ? userProfile?.posts?.map((e, i) => {
                                return <div class="gallery-item grid-item" tabindex="0">

                                    <img src={e?.img} alt="" className='w-100' height="300" />

                                    <div class="gallery-item-info  w-100">

                                        <ul>
                                            <li class="gallery-item-likes me-3">
                                                <span class="visually-hidden">Likes:</span>
                                                <i class="fas fa-heart" aria-hidden="true">
                                                </i> {e?.likes.length}
                                            </li>
                                            <li class="gallery-item-comments"><span class="visually-hidden">Comments:</span><i class="fas fa-comment" aria-hidden="true"></i> {e?.comment?.length} </li>
                                        </ul>

                                    </div>

                                </div>
                            }) : <h1>No posts</h1>
                        }

                    </div>
                </div>

            </main>
        </div>
    );
}

export default OtherProfile;
