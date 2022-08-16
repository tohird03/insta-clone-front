import React, { useContext } from 'react';
import { useState, useEffect } from 'react';
import Header from '../../Components/Header/Header';
import Moment from 'react-moment';
import 'moment-timezone';
import jwt_decode from "jwt-decode";
import './Content.scss'
import { Context } from '../../Context/AuthToken';
import likeLight from "../../Assets/imgs/likeLight.png"
import likeDark from "../../Assets/imgs/likeDark.png"
import { NavLink } from 'react-router-dom';
const Content = () => {
    const [img, setImgs] = useState([])
    const token = window.localStorage.getItem("token")
    const decoded = jwt_decode(token);
    const { userProfile, setUserProfile } = useContext(Context)
    const [modal, setModal] = useState(false)
    const [likesUsers, setLikesUsers] = useState([])
    const [comment, setComments] = useState([])
    const [getPostId, setGetPostId] = useState()
    const [user, setUser] = useState()
    const [allUser, setAllUser] = useState([])
    const [commentBody, setCommentBody] = useState(false)

    useEffect(() => {
        fetch("https://insta-oo3.herokuapp.com/userFound", {
            method: "GET",
            headers: {
                "Content-type": "application/json",
                "email": decoded.user_email
            }
        })
            .then(res => res.json())
            .then(data => {
                setUser(data)
            })
    }, [decoded]);

    // ALL POST
    useEffect(() => {
        fetch("https://insta-oo3.herokuapp.com/posts", {
            method: "GET",
            headers: {
                "Content-type": "application/json"
            }
        })
            .then(res => res.json())
            .then(data => {
                setImgs(data)
            })
    }, [img]);

    // ALL USER
    useEffect(() => {
        fetch("https://insta-oo3.herokuapp.com/users", {
            method: "GET",
            headers: {
                "Content-type": "application/json"
            }
        })
            .then(res => res.json())
            .then(data => {
                setAllUser(data)
            })
    }, [allUser]);

    // LIKES
    const handleLikes = (e) => {
        e.preventDefault()
        // console.log(userProfile);
        fetch("https://insta-oo3.herokuapp.com/likes", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                imgId: e.target.id,
                userEmail: decoded?.user_email
            })
        })
            .then(res => res.json())
            .then(data => {
                setUserProfile(data)
            })
    }

    // ADD POST
    const handleAddPost = (e) => {
        e.preventDefault()
        fetch("https://insta-oo3.herokuapp.com/likesuser", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                imgId: e.target.id
            })
        })
            .then(res => res.json())
            .then(data => {
                setLikesUsers(data);
            })
        setModal(!modal)

    }

    // OPEN or CLOSE ADD POST MODAL
    const handleAddPostClose = (e) => {
        setModal(!modal)
    }

    // COMMENT GET
    const handleComments = (e) => {
        setCommentBody(true)
        window.localStorage.setItem("postId", e.target.id)

        fetch(`https://insta-oo3.herokuapp.com/comment/${e.target.id}`, {
            method: "GET",
            headers: {
                "Content-type": "application/json"
            }
        })
            .then(res => res.json())
            .then(data => {
                setComments(data);
            })

    }

    const postId = window.localStorage.getItem("postId")

    // ADD COMMENT
    const handleCommentAdd = (e, postId) => {
        if (e.key === "Enter") {
            fetch(`https://insta-oo3.herokuapp.com/comment/`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({
                    userEmail: decoded?.user_email,
                    commentText: e.target.value,
                    postId: postId
                })
            })
                .then(res => res.json())
                .then(data => {
                    setComments(data);
                })

            setGetPostId(postId)
        }
    }

    // FOLLOWERS
    const handleFollow = (e) => {
        fetch(`https://insta-oo3.herokuapp.com/followers`, {
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
                console.log(data);
            })
    }

    // CLOSE COMMENT
    const handleCloseComment = () => {
        setCommentBody(false)
    }
    return (<>
        <Header />
        <div className='container d-flex content__container'>
            <main className='content__main'>
                {img && img?.map((e, i) => {

                    return e.author && <div class="box-container mb-3">

                        <div
                            class="name-account
                            d-flex align-items-center
                            justify-content-between"
                        >
                            <NavLink to={`/${e?.author?._id}`}>
                                <div className='d-flex align-items-center'>
                                    <img className='profile_user' src={e?.author?.profile ? e?.author?.profile : "https://forum.truckersmp.com/uploads/monthly_2022_02/imported-photo-270490.thumb.png.d1f244f98ab3c0a33ca0e5776cf93a5e.png"} alt="" />
                                    <div className='ms-3'>
                                        <p className='m-0'>
                                            {e?.author?.name}
                                        </p>
                                        <span className='d-flex'>
                                            {
                                                e?.title
                                            }
                                        </span>
                                    </div>
                                </div>
                            </NavLink>
                            {
                                e?.author?.email == decoded?.user_email ? "" :
                                    <button onClick={handleFollow} className={e?.author?.followers?.includes(user?._id) ? "following" : "follow"} id={e?.author._id}>

                                        {
                                            e?.author?.followers?.includes(user?._id) ? "Unfollow" : "Follow"
                                        }

                                    </button>
                            }

                        </div>

                        <img src={e?.img} height="50" />

                        <div class="interactions">
                            <div class="interactions-icons">
                                <div className='d-flex align-items-center'>
                                    <span id={e?._id} onClick={handleLikes} className={`material-symbols-outlined cursor`} >
                                        {
                                            userProfile?.likedBlogs?.includes(e?._id) ? <img id={e?._id} className='likes__btn' src={likeDark} alt="" width="24" height="24" /> : <img id={e?._id} className='likes__btn' src={likeLight} alt="" width="24" height="24" />
                                        }
                                    </span>

                                    <span className='d-flex h-100 cursor' id={e._id} onClick={handleAddPost}>
                                        <b id={e._id}>Likes: {e?.likes.length}</b>
                                    </span>


                                    {/* Modal likes*/}
                                    <div onClick={handleAddPostClose} class={`hidden__bg ${modal ? 'overlayx' : ''}  hidden__teacher body__close`}>
                                    </div>

                                    <div class={`${modal ? 'd-block' : 'd-none'} form__add_post likes_body bg-light py-2`}>
                                        <div className=' bg-light border-bottom '>
                                            <h3 className='mx-auto mb-3 text-center'>Likes</h3>

                                            <div class="name-accounts d-flex align-items-center px-5 py-2">
                                                <div className='d-flex align-items-center'>
                                                    <img className='profile_user' src={likesUsers?.author?.profile ? likesUsers?.author?.profile : "https://forum.truckersmp.com/uploads/monthly_2022_02/imported-photo-270490.thumb.png.d1f244f98ab3c0a33ca0e5776cf93a5e.png"} alt="" />
                                                    <div className='ms-3'>
                                                        <p className='m-0'>
                                                            {likesUsers && likesUsers?.author?.name}
                                                        </p>
                                                        <span>
                                                            {
                                                                likesUsers?.title
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className='d-flex align-items-center text-center'>
                                                    <p className='m-0 me-2'>
                                                        Likes {
                                                            likesUsers?.likes?.length
                                                        }
                                                    </p>
                                                    <img id={e?._id} className='likes__btn' src={likeDark} alt="" width="24" height="24" />
                                                </div>
                                            </div>

                                            <div className='p-5'>
                                                {
                                                    likesUsers && likesUsers?.likes?.map(e => {
                                                        return <div class="name-account ps-5 w-100 d-flex align-items-center justify-content-between">
                                                            <div className='d-flex align-items-center'>
                                                                <NavLink className='d-flex align-items-center' to={`/${e?._id}`}>
                                                                    <img className='profile_user' src={e.profile ? e.profile : "https://forum.truckersmp.com/uploads/monthly_2022_02/imported-photo-270490.thumb.png.d1f244f98ab3c0a33ca0e5776cf93a5e.png"} alt="" />
                                                                    <div className='ms-3'>
                                                                        <p className='m-0'>
                                                                            {e?.name}
                                                                        </p>
                                                                        <span>
                                                                            {
                                                                                e?.bio
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                </NavLink>
                                                            </div>
                                                            <div className='d-flex align-items-center'>
                                                                <p className='m-0 me-2'>
                                                                    Liked this post
                                                                </p>

                                                                <img id={e?._id} className='likes__btn' src={likeDark} alt="" width="24" height="24" />
                                                            </div>
                                                        </div>
                                                    })
                                                }
                                            </div>
                                        </div>

                                    </div>
                                </div>


                                <i
                                    id={e?._id} onClick={handleComments} class="far fa-comment cursor">
                                </i>

                                <span id={e?._id} onClick={handleComments} className='cursor' style={{ fontWeight: "bold" }}>
                                    Comments: {e?.comment?.length}
                                </span>
                            </div>
                            <span className='ps-3 mt-3'>
                                <Moment fromNow>{e?.createdAt}</Moment>
                            </span>
                        </div>
                    </div>
                })}

            </main>

            <div className='ps-5 sticky-top w-100 comment'>

                <div className={commentBody ? "d-none" : "d-block"}>
                    {
                        allUser && allUser?.map(e => {
                            return <div
                                class="name-account
                                        d-flex align-items-center
                                        justify-content-between"
                            >
                                <NavLink to={`/${e?._id}`}>
                                    <div className='d-flex align-items-center'>
                                        <img className='profile_user' src={e?.profile ? e?.profile : "https://forum.truckersmp.com/uploads/monthly_2022_02/imported-photo-270490.thumb.png.d1f244f98ab3c0a33ca0e5776cf93a5e.png"} alt="" />
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
                                        <button onClick={handleFollow} className={e?.followers?.includes(user?._id) ? "following" : "follow"} id={e?._id}>

                                            {
                                                e?.followers?.includes(user?._id) ? "Unfollow" : "Follow"
                                            }

                                        </button>
                                }

                            </div>
                        })
                    }
                </div>

                {/* COMMENT */}
                <div className={commentBody ? "d-block" : "d-none"}>
                    {
                        comment?.author && <div class="rightPanel" style={{ position: "relative" }}>

                            <div class="topBar border p-1 d-flex justify-content-between">
                                <NavLink to={`/${comment?.author?._id}`}>
                                    <div style={{ border: "none", height: "100%" }} class="name-account">
                                        <img
                                            className='profile_user'
                                            src={comment?.author?.profile ? comment?.author?.profile : "https://forum.truckersmp.com/uploads/monthly_2022_02/imported-photo-270490.thumb.png.d1f244f98ab3c0a33ca0e5776cf93a5e.png"} alt="" />

                                        <div className='ms-3'>
                                            <p className='m-0'>
                                                {comment?.author?.name}
                                            </p>
                                            <span className='d-flex'>
                                                {
                                                    comment?.title
                                                }
                                            </span>
                                        </div>

                                    </div>
                                </NavLink>

                                <div className='align-item-center pe-3 d-flex flex-column justify-content-center'>
                                    <div className='d-flex align-items-center'>
                                        <img className='likes__btn me-2' src={likeDark} alt="" width="24" height="24" />
                                        <span className='d-flex align-items-center h-100' id={comment._id}>
                                            <b id={comment._id}>Likes: {comment?.likes.length}</b>
                                        </span>
                                    </div>
                                    <span className='ps-3 text-center'>
                                        <Moment fromNow>{comment?.createdAt}</Moment>
                                    </span>
                                </div>

                                <span onClick={handleCloseComment} class="material-symbols-outlined align-self-center fs-1">
                                    close
                                </span>
                            </div>

                            {/* Comment body */}
                            <div class="convHistory userBg">
                                {
                                    comment?.comment && comment?.comment?.map((coment, index) => {
                                        return <div
                                            class={decoded?.user_email == coment?.userId?.email ? "messageSent msg p-2" : "messageReceived msg p-2"}>

                                            <NavLink to={`/${coment?.userId?._id}`}>

                                                <div style={{ border: "none", backgroundColor: "transparent" }} class="name-accounts">
                                                    <div className='ms-3'>
                                                        <p className='m-0 comment_userName'>
                                                            {coment?.userId?.name}
                                                        </p>
                                                    </div>
                                                </div>
                                            </NavLink>

                                            <div>
                                                <p className='comment-text'>
                                                    {coment?.commentText}
                                                </p>
                                                <span class="timestamp">
                                                    <Moment fromNow>{coment?.time}</Moment>
                                                </span>

                                            </div>
                                        </div>

                                    })
                                }
                            </div>

                            <div class="replyBar">
                                <button class="attach">
                                    <i class="material-icons d45">attach_file</i>
                                </button>

                                <input type="text" onKeyPress={e => handleCommentAdd(e, comment?._id)} class="replyMessage" placeholder="Your message..." />

                                <div class="emojiBar">
                                    <div class="emoticonType">
                                        <button id="panelEmoji">Emoji</button>
                                        <button id="panelStickers">Stickers</button>
                                        <button id="panelGIFs">GIFs</button>
                                    </div>


                                    <div class="emojiList">
                                        <button id="smileface" class="pick">
                                        </button>
                                        <button id="grinningface" class="pick"></button>
                                        <button id="tearjoyface" class="pick"></button>
                                        <button id="rofl" class="pick"></button>
                                        <button id="somface" class="pick"></button>
                                        <button id="swfface" class="pick"></button>
                                    </div>

                                    <div class="stickerList">
                                        <button id="smileface" class="pick">
                                        </button>
                                        <button id="grinningface" class="pick"></button>
                                        <button id="tearjoyface" class="pick"></button>
                                    </div>
                                </div>

                                <div class="otherTools">
                                    <button class="toolButtons emoji">
                                        <i class="material-icons">face</i>
                                    </button>

                                    <button class="toolButtons audio">
                                        <i class="material-icons">mic</i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    }
                </div>

            </div>
        </div>
    </>);
}

export default Content;
