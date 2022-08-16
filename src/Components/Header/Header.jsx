import React, { useContext, useEffect, useState } from 'react';
import jwt_decode from "jwt-decode";
import axios from 'axios'
import { Context } from '../../Context/AuthToken';
import { NavLink } from 'react-router-dom';
const Header = () => {
    const token = window.localStorage.getItem("token")
    const decoded = jwt_decode(token);
    const { userProfile, setUserProfile } = useContext(Context)
    const [modal, setModal] = useState(false)
    const [modalProfile, setModalProfile] = useState(false)
    const [source, setSource] = React.useState();
    const [sourceProfile, setSourceProfile] = React.useState();
    const { setLogin } = useContext(Context)
    // USER ABOUT
    useEffect(() => {
        fetch("https://insta-oo3.herokuapp.com/user", {
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
                    setLogin(null)
                    setUserProfile(data)
                }
            })
    }, [userProfile]);
    // ADD POST
    const handleAddPost = () => {
        setModal(!modal)
        console.log(userProfile);

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
            const res = await axios.post('https://insta-oo3.herokuapp.com/posts', formData, {
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
            const res = await axios.post('https://insta-oo3.herokuapp.com/profile', formData, {
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
    return (
        <header>
            <div id="header-top">
                <div className='container py-2'>
                    <h2 className='logo_name m-0'>
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

        </header >
    );
}

export default Header;
