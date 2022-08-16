import React, { useContext, useEffect, useState } from 'react';
import jwt_decode from "jwt-decode";
import axios from 'axios'
import './Home.scss'
import { Context } from '../../Context/AuthToken';
import { NavLink } from 'react-router-dom';
const Home = () => {
    const token = window.localStorage.getItem("token")
    const decoded = jwt_decode(token);
    const { userProfile, setUserProfile } = useContext(Context)
    const [modal, setModal] = useState(false)
    const [modalProfile, setModalProfile] = useState(false)
    const [modalBio, setModalBio] = useState(false)
    const [source, setSource] = React.useState();
    const [sourceProfile, setSourceProfile] = React.useState();
    const { setLogin } = useContext(Context)
    // USER ABOUT
    useEffect(() => {
        fetch("http://localhost:9000/user", {
            method: "GET",
            headers: {
                "Content-type": "application/json",
                "email": decoded?.user_email
            }
        })
            .then(res => res.json())
            .then(data => {
                if (!data) {
                    console.log(data);
                    return
                } else {
                    setLogin(null)
                    setUserProfile(data)
                }
            })
    }, [userProfile]);
    // ADD POST
    const handleAddPost = () => {
        setModal(!modal)
    }

    // UPLOAD POST
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        const url = URL.createObjectURL(file);
        setSource(url);
    }

    // ADD DB BAZE
    const handlePost = async (e) => {
        e.preventDefault()

        const { imgs, author, title } = e.target

        const formData = new FormData()
        formData.append('imgs', imgs.files[0])
        formData.append('author', author.value)
        formData.append('title', title.value)

        try {
            const res = await axios.post('http://localhost:9000/posts', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

            setModal(!modal)
        } catch (error) {
            console.log(error);
        }
    }

    // ADD DB BAZE PROFILE
    const handleSubmitProfile = async (e) => {
        e.preventDefault()

        const { profile, author } = e.target

        const formData = new FormData()
        formData.append('profile', profile.files[0])
        formData.append('author', author.value)

        try {
            const res = await axios.post('http://localhost:9000/profile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

            setModalProfile(!modalProfile)
        } catch (error) {
            console.log(error);
        }
    }

    const handleAddProfile = () => {
        setModalProfile(!modalProfile)
    }


    const handleFileUploadProfile = (event) => {
        const file = event.target.files[0];
        const url = URL.createObjectURL(file);
        setSourceProfile(url);
    }

    const handleAddBio = (e) => {
        setModalBio(!modalBio)
    }

    const handleAddBioForm = (e) => {
        e.preventDefault()

        const { author, bio } = e.target

        fetch("http://localhost:9000/user/bio", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                author: author.value,
                bio: bio.value
            })
        })
            .then(res => res.json())
            .then(data => {
                if (!data) {
                    console.log(data);
                    return
                } else {
                    setUserProfile(data)
                    setModalBio(!modalBio)
                }
            })

    }
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
                            <span onClick={handleAddPost} class={`material-symbols-outlined cursor ${modal ? 'bg-dark text-light' : 'bg-light'}`}>
                                add_box
                            </span>
                            <span class="material-symbols-outlined cursor">
                                explore
                            </span>
                            <span class="material-symbols-outlined cursor">
                                favorite
                            </span>
                            <span class="material-symbols-outlined cursor">
                                account_circle
                            </span>
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
                                <button onClick={handleAddProfile} className='profile_photoBtn'>+</button>
                            </div>
                        </div>

                        <div class="profile-user-settings">

                            <h1 class="profile-user-name">{userProfile?.name}</h1>

                            <button class="btn profile-edit-btn">Edit Profile</button>

                            <button class="btn profile-settings-btn" aria-label="profile settings"><i class="fas fa-cog" aria-hidden="true"></i></button>

                        </div>

                        <div class="profile-stats">

                            <ul>
                                <li><span class="profile-stat-count">{userProfile?.posts?.length}</span> posts</li>

                                <li id={userProfile?._id}>
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

                            <p className='d-flex align-items-center'>
                                <span class="profile-real-name me-4 d-flex flex-wrap">BIO:</span>
                                {
                                    userProfile?.bio != ""
                                    ?
                                    <div className='d-flex align-items-center'>
                                        <h3 className='me-5 m-0'>{userProfile?.bio}</h3>
                                        <button style={{width: "150px"}} onClick={handleAddBio} id={userProfile?._id} className='btn btn-success  p-2'>UPDATE BIO</button>
                                    </div>
                                    :
                                    <button onClick={handleAddBio} id={userProfile?._id} className='btn btn-success d-flex p-2'>ADD BIO</button>
                                }

                            </p>

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
                                                <span class="visually-hidden">
                                                    Likes:
                                                </span>
                                                <i
                                                    class="fas fa-heart" aria-hidden="true">
                                                </i>

                                                {e?.likes.length}
                                            </li>

                                            <li class="gallery-item-comments">
                                                <span class="visually-hidden">
                                                    Comments:
                                                </span>

                                                <i
                                                    class="fas fa-comment"
                                                    aria-hidden="true">
                                                </i>

                                                {e?.comment?.length}
                                            </li>
                                        </ul>

                                    </div>

                                </div>
                            }) : <h1>No posts</h1>
                        }

                    </div>
                </div>

            </main>

            {/* Modal form add post*/}
            <div onClick={handleAddPost} class={`hidden__bg ${modal ? 'overlay' : ''}  hidden__teacher body__close`}></div>

            <div class={`${modal ? 'd-block' : 'd-none'} form__add_post bg-light p-5`}>
                <div className='text-center border-bottom '>
                    <h3 className='m-auto mb-3'>Create new post</h3>
                </div>

                {source ? <div className='tex-center pt-3'>
                    <img className='mx-auto' src={source} alt="" width="200" height="200" />
                </div> : ''}


                <form encType='multipart/form-data' onSubmit={handlePost} class="add_student-form mt-auto" method="post">
                    <div class="mb-3">
                        <label onChange={handleFileUpload} class="custom-file-upload bg-primary w-50 text-light text-center m-auto">
                            <input name="imgs" type="file" accept=".png, .jpg, .jpeg" class="form-control d-none" id="imgs" required />
                            Yangi post tanlang
                        </label>

                        <span className='mx-auto'>Tanlash shart .png .jpg .jpeg</span>

                    </div>
                    <div class="mb-3">
                        <input value={userProfile?._id} name="author" type="text" class="form-control visually-hidden" required />
                    </div>
                    <div class="mb-3">
                        <label for="phone" class="form-label">
                            Post title
                        </label>

                        <input name="title" type="text" class="form-control" id="title" required placeholder="Title" value={modal ? this : null} />
                    </div>

                    <button class="btn btn-success post__add"
                        type="submit">
                        Add
                    </button>
                </form>
            </div>

            {/* Modal form add profile*/}
            <div onClick={handleAddProfile} class={`hidden__bg ${modalProfile ? 'overlay' : ''}  hidden__teacher body__close`}></div>

            <div class={`${modalProfile ? 'd-block' : 'd-none'} form__add_post bg-light p-5`}>
                <div className='text-center border-bottom '>
                    <h3 className='m-auto mb-3'>Create new profile</h3>
                </div>

                {sourceProfile ? <div className='tex-center pt-3'>
                    <img className='mx-auto' src={sourceProfile} alt="" width="200" height="200" />
                </div> : ''}

                <form encType='multipart/form-data' onSubmit={handleSubmitProfile} class="add_student-form mt-auto" method="post">

                    <div class="mb-3">
                        <label onChange={handleFileUploadProfile} class="custom-file-upload bg-primary w-50 text-light text-center m-auto">
                            <input name="profile" type="file" accept=".png, .jpg, .jpeg" class="form-control d-none" id="imgs" required />
                            Yangi profilni tanlang
                        </label>

                        <span className='mx-auto'>Tanlash shart .png .jpg .jpeg</span>

                    </div>
                    <div class="mb-3">
                        <input value={userProfile?._id} name="author" type="text" class="form-control visually-hidden" required />
                    </div>
                    <button class="btn btn-success post__add"
                        type="submit">
                        Add
                    </button>
                </form>
            </div>

            {/* Modal form add bio*/}
            <div onClick={handleAddBio} class={`hidden__bg ${modalBio ? 'overlay' : ''}  hidden__teacher body__close`}></div>

            <div class={`${modalBio ? 'd-block' : 'd-none'} form__add_post bg-light p-5`}>
                <div className='text-center border-bottom '>
                    <h3 className='m-auto mb-3'>Create new bio</h3>
                </div>

                <form encType='multipart/form-data' onSubmit={handleAddBioForm} class="add_student-form mt-auto" method="post">
                    <div class="mb-3">
                        <input value={userProfile?._id} name="author" type="text" class="form-control visually-hidden" required />
                    </div>
                    <div class="mb-3">
                        <label for="phone" class="form-label">
                            Bio text
                        </label>

                        <input name="bio" maxLength="55" type="text" class="form-control" id="title" placeholder="Text..." />
                    </div>

                    <button class="btn btn-success post__add"
                        type="submit">
                        Add
                    </button>
                </form>
            </div>
        </div >
    );
}

export default Home;
