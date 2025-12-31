import { useParams, useNavigate, useLocation } from "react-router-dom"
import { useEffect, useState, useRef, useCallback } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import ImageProfile from '../../assets/981d6b2e0ccb5e968a0618c8d47671da.jpg'
import { faClose } from "@fortawesome/free-solid-svg-icons"
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"
import Cropper from "react-easy-crop"
import { faExclamation } from "@fortawesome/free-solid-svg-icons"
import { faCamera } from "@fortawesome/free-solid-svg-icons"
import SearchInput from "../searchInput"
import SideBar from "../sideBar"
import TextareaProfile from "../textareaProfile"
import Posts from "../post"
import Comment from "../comment"
import Likes from "../likes"
import SearchOverlay from "../searchOverlay"
import { useMediaQuery } from "react-responsive"

const Profile = () => {
    const for800Width = useMediaQuery({ query: '(max-width: 800px)' })
    const for530Width = useMediaQuery({ query: '(max-width: 530px)' })
    const for500Width = useMediaQuery({ query: '(max-width: 499px)' })
    const for390Width = useMediaQuery({ query: '(max-width: 390px)' })

    const [showLoading, setShowLoading] = useState(true)
    const [userName, setUserName] = useState('')
    const [followers, setFollowers] = useState([])
    const [following, setFollowing] = useState([])
    const [isFollowing, setIsFollowing] = useState(null)
    const [bio, setBio] = useState('')
    const [img, setImg] = useState(ImageProfile)
    const [showEdit, setShowEdit] = useState(false)
    const [stringUser, setStringUser] = useState('0')
    const [image, setImage] = useState(null)
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
    const [croppedImage, setCroppedImage] = useState(null)
    const fileInputRef = useRef(null)
    const [myImg, setMyImg] = useState(ImageProfile)
    const [showFollowers, setShowFollowers] = useState(false)
    const [showFollowing, setShowFollowing] = useState(false)
    const [notFound, setNotFound] = useState(null)
    const [createTime, setCreateTime] = useState(null)
    const [filteredFollowers, setFilteredFollowers] = useState([])
    const [filteredFollowing, setFilteredFollowing] = useState([])
    var inputFollowers = useRef(null)
    var inputFollowing = useRef(null)
    const [view, setView] = useState('posts')
    const [posts, setPosts] = useState(null)
    const [comments, setComments] = useState(null)
    const [replies, setReplies] = useState(null)
    const [likes, setLikes] = useState(null)
    const [userId, setUserId] = useState(null)
    const [requestedUser, setRequestedUser] = useState(null)
    const [unreadMessages, setUnreadMessages] = useState(null)
    const [showSearch, setShowSearch] = useState(false)

    const { user } = useParams()
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        setShowLoading(true)

        const getSession = async () => {
            const result = await fetch('http://localhost:3000/session', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include'
            })

            const output = await result.json()

            if (output.user != undefined) {
                if (output.user == '') {
                    navigate('/newUser')
                }

                else {
                    setUserName(output.user)

                    if (output.img != null) setMyImg(output.img)

                    if (output.notifications != undefined) setUnreadMessages(output.notifications)
                }
            }

            else {
                window.alert('Você não possui sessão')
                navigate('/login')
            }
        }

        getSession()
    }, [location.pathname])

    useEffect(() => {
        setImg(ImageProfile)
        setPosts(null)
        setComments(null)
        setReplies(null)
        setLikes(null)
        setView('posts')

        if (userName != '') {
            const getUserData = async () => {
                const result = await fetch(`http://localhost:3000/getUserData`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({ requestedUser: user })
                })

                const output = await result.json()

                if (output.status == undefined) {
                    setFollowers(output.followers)
                    setFollowing(output.following)
                    setBio(output.bio)
                    setCreateTime(output.createdAt)
                    setUserId(output._id)
                    setRequestedUser(output.user)

                    if (output.img != null) setImg(output.img)

                    if (output.isFollowing) setIsFollowing(true)

                    setNotFound(false)
                    setShowLoading(false)

                    const posts = await fetch(`http://localhost:3000/userPosts/${output._id}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        credentials: 'include'
                    })
                    const outputPosts = await posts.json()

                    if (outputPosts.status != 'fail') setPosts(outputPosts.posts)

                    else setPosts([])
                }

                else {
                    setNotFound(true)
                    setShowLoading(false)
                }
            }

            getUserData()
        }
    }, [userName, location.pathname])

    useEffect(() => {
        if (showEdit || showFollowers || showFollowing) {
            if (showEdit) {
                document.getElementsByTagName('input')[2].value = user
                setStringUser(user.length)
            }

            document.body.style.height = '100vh'
            document.body.style.overflow = 'hidden'
        }

        else {
            if (document.getElementById('following') != null && requestedUser == userName) {
                if (document.getElementById('following').innerText == '1') setFollowing(1)

                else if (document.getElementById('following').innerText == '0' && !showFollowing) setFollowing(0)
            }

            document.body.style.height = '100%'
            document.body.style.overflow = 'visible'
        }
    }, [showEdit, showFollowers, showFollowing])

    useEffect(() => {
        const getData = async () => {
            if (showFollowers) {
                const result = await fetch('http://localhost:3000/getFollows', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({ requestedId: userId, data: 'followers' })
                })

                const output = await result.json()
                setFollowers(output.result)
            }

            else if (showFollowing) {
                const result = await fetch('http://localhost:3000/getFollows', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({ requestedId: userId, data: 'following' })
                })

                const output = await result.json()
                setFollowing(output.result)
            }
        }
        getData()
    }, [showFollowers, showFollowing])

    const handleFocus = () => {
        const labels = document.getElementsByTagName('label')

        labels[1].style.border = 'solid 2px #660eb3'
        labels[1].style.borderBottom = 'solid 0px #660eb3'
    }

    const searchUsers = (e) => {
        const search = e.target.value
        const id = e.target.id

        if (search == 0) {
            setFilteredFollowers([])
            setFilteredFollowing([])
        }

        else if (id == 'inputFollowers' && search.length > 0) {
            const filteredFollowers = followers.filter(element => {
                return element.user.includes(search)
            })

            setFilteredFollowers(filteredFollowers)
        }

        else if (id == 'inputFollowing' && search.length > 0) {
            const filteredFollowing = following.filter(element => {
                return element.user.includes(search)
            })

            setFilteredFollowing(filteredFollowing)
        }
    }

    const handleInput = (e) => {
        const length = e.target.value.length
        setStringUser(length)

        if (length > 15) document.getElementById('userLength').style.color = 'red'

        else document.getElementById('userLength').style.color = 'white'
    }

    const handleBlur = () => {
        const labels = document.getElementsByTagName('label')

        labels[1].style.border = '2px solid transparent'
        labels[1].style.borderBottom = '0px solid transparent'
    }

    const onFileChange = (e) => {
        const errors = document.getElementsByClassName('error')

        for (let i = 0; i < errors.length; i++) {
            errors[i].classList.add('hidden')
        }

        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0]

            if (!file.type.match('image.*')) {
                errors[1].classList.remove('hidden')
                return
            }

            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => {
                setImage(reader.result)
                setCroppedImage(null)
                document.getElementById('cropper').classList.remove('hidden')
                document.getElementById('edit').classList.add('hidden')
            }
        }
    }

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }, [])

    const createCroppedImage = useCallback(async () => {
        try {
            const croppedImg = await getCroppedImg(
                image,
                croppedAreaPixels,
            )
            setCroppedImage(croppedImg)
            document.getElementById('cropper').classList.add('hidden')
        }

        catch (e) {
            console.error('Error creating cropped image:', e)
        }
    }, [croppedAreaPixels, image])

    const getCroppedImg = async (imageSrc, pixelCrop, rotation = 0) => {
        const image = await createImage(imageSrc)
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        const maxSize = Math.max(image.width, image.height)
        const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2))

        // Set canvas dimensions to handle the rotation
        canvas.width = safeArea
        canvas.height = safeArea

        // Translate canvas center point to the origin
        ctx.translate(safeArea / 2, safeArea / 2)
        ctx.rotate((rotation * Math.PI) / 180)
        ctx.translate(-safeArea / 2, -safeArea / 2)

        // Draw the rotated image and drop off-canvas pixels
        ctx.drawImage(
            image,
            safeArea / 2 - image.width * 0.5,
            safeArea / 2 - image.height * 0.5
        )

        // Extract the cropped portion
        const data = ctx.getImageData(0, 0, safeArea, safeArea);

        // Set canvas width to final desired crop size
        canvas.width = pixelCrop.width
        canvas.height = pixelCrop.height

        // Place the cropped data into a new canvas with proper position
        ctx.putImageData(
            data,
            0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x,
            0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y
        )

        // Return as data URL
        return canvas.toDataURL('image/png')
    }

    const createImage = (url) =>
        new Promise((resolve, reject) => {
            const image = new Image()
            image.addEventListener('load', () => resolve(image))
            image.addEventListener('error', (error) => reject(error))
            image.src = url;
        })

    const editProfile = async () => {
        // setShowLoading(true)

        const errors = document.getElementsByClassName('error')

        for (let i = 0; i < errors.length; i++) {
            errors[i].classList.add('hidden')
        }

        const newUser = document.getElementsByTagName('input')[2].value
        const newBio = document.getElementsByTagName('textarea')[0].value
        var newProfileImage = null

        if (newUser.length > 15) errors[3].classList.remove('hidden')

        else if (newBio.length > 100) errors[2].classList.remove('hidden')

        else if (newUser == 0) errors[4].classList.remove('hidden')

        else if (newUser.length < 3) errors[5].classList.remove('hidden')

        else {
            if (!document.getElementById('img').src.includes(ImageProfile)) newProfileImage = document.getElementById('img').src

            const result = await fetch('http://localhost:3000/updateAccout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ newUser: newUser, newBio: newBio, newProfileImage: newProfileImage })
            })

            const output = await result.json()

            if (output.status == 'fail' && newUser != userName) errors[0].classList.remove('hidden')

            else window.location.href = `/profile/${newUser}`
        }
    }

    const handleFollow = async (destinyId, e) => {
        if (e.target.id != '' && user != userName) {
            const action = e.target.id

            if (action == 'add') {
                document.getElementById('followers').innerHTML = Number(document.getElementById('followers').innerHTML) + 1

                if (document.getElementById('followers').innerHTML == '1') setFollowers(1)

                setIsFollowing(true)
            }

            else {
                document.getElementById('followers').innerHTML = Number(document.getElementById('followers').innerHTML) - 1

                if (document.getElementById('followers').innerHTML == '0') setFollowers(0)

                setIsFollowing(false)
            }

            await fetch('http://localhost:3000/updateFollow', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ destinyId: userId, action: action })
            })
        }

        else {
            if (e.target.innerHTML == 'Seguir') {
                e.target.classList.remove('bg-[#660eb3]')
                e.target.innerHTML = 'Seguindo'

                if (requestedUser == userName) {
                    document.getElementById('following').innerHTML = Number(document.getElementById('following').innerHTML) + 1
                }
            }

            else if (e.target.innerHTML == 'Seguindo') {
                e.target.classList.add('bg-[#660eb3]')
                e.target.innerHTML = 'Seguir'

                if (requestedUser == userName) {
                    document.getElementById('following').innerHTML = Number(document.getElementById('following').innerHTML) - 1
                }
            }

            await fetch('http://localhost:3000/updateFollow', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ destinyId: destinyId, action: e.target.innerHTML == 'Seguindo' ? 'add' : 'remove' })
            })
        }
    }

    const getPosts = async () => {
        if (view != 'posts') {
            setView('posts')
            if (view == 'comments') setComments(null)
            else if (view == 'replies') setReplies(null)
            else if (view == 'likes') setLikes(null)

            const result = await fetch(`http://localhost:3000/userPosts/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include'
            })
            const output = await result.json()

            if (output.status != 'fail') setPosts(output.posts)

            else setPosts([])
        }
    }

    const getComments = async () => {
        if (view != 'comments') {
            setView('comments')
            if (view == 'posts') setPosts(null)
            else if (view == 'replies') setReplies(null)
            else if (view == 'likes') setLikes(null)

            const result = await fetch(`http://localhost:3000/userComments/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include'
            })
            const output = await result.json()

            if (output.status != 'fail') setComments(output.comments)

            else setComments([])
        }
    }

    const getReplies = async () => {
        if (view != 'replies') {
            setView('replies')
            if (view == 'posts') setPosts(null)
            else if (view == 'comments') setComments(null)
            else if (view == 'likes') setLikes(null)

            const result = await fetch(`http://localhost:3000/userReplies/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include'
            })
            const output = await result.json()

            if (output.status != 'fail') setReplies(output.replies)

            else setReplies([])
        }
    }

    const getLikes = async () => {
        if (view != 'likes') {
            setView('likes')
            if (view == 'posts') setPosts(null)
            else if (view == 'comments') setComments(null)
            else if (view == 'replies') setReplies(null)

            const result = await fetch(`http://localhost:3000/userLikes/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include'
            })
            const output = await result.json()

            if (output.status != 'fail') setLikes(output.likes)

            else setLikes([])
        }
    }

    return (
        <>
            {showLoading &&
                <div className="flex flex-col items-center bg-[#0f0f0f] h-full justify-center">
                    <div className="animate-spin inline-block size-20 border-5 border-current border-t-transparent text-[#660eb3] rounded-full dark:text-[#660eb3]" role="status" aria-label="loading">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            }

            {!showLoading &&
                <>
                    {showSearch &&
                        <SearchOverlay setShowSearch={setShowSearch} />
                    }

                    {showFollowers &&
                        <>
                            <div className="absolute h-screen w-screen bg-[#808080] z-10 opacity-30"></div>

                            <div className="max-[531px]:pl-3 max-[531px]:pr-3 max-[586px]:pr-7 max-[586px]:pl-7  max-[734px]:pr-10 max-[734px]:pl-10 flex justify-center w-full absolute z-998 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                <div className="max-[734px]:w-full text-[#ffffff] w-[600px] h-[480px] overflow-auto bg-[#000000] rounded-[10px]">
                                    <div className="max-[391px]:pr-5 max-[391px]:pl-5  flex flex-col p-7 pt-5 justify-between">
                                        <div className="flex items-center justify-between w-full mb-3">
                                            <h1 className="text-[18px]">Seguidores</h1>

                                            <FontAwesomeIcon onClick={() => {
                                                setShowFollowers(false)
                                                setFilteredFollowers([])
                                                inputFollowers.current = null
                                            }} icon={faClose} className="text-[30px] cursor-pointer" />
                                        </div>

                                        <div>
                                            <input onInput={searchUsers} id="inputFollowers" ref={inputFollowers} className="focus:outline-2 focus:outline-offset-2 focus:outline-none border-transparent border-2 rounded-[5px] w-full bg-[#0f0f0f] pt-[6px] pb-[6px] pr-1 pl-3" placeholder="Pesquisar" />
                                        </div>

                                        <div>
                                            {inputFollowers.current == null &&
                                                <div className="flex flex-col items-center h-full justify-center mt-10">
                                                    <div className="animate-spin inline-block size-10 border-5 border-current border-t-transparent text-[#660eb3] rounded-full dark:text-[#660eb3]" role="status" aria-label="loading">
                                                        <span className="sr-only">Loading...</span>
                                                    </div>
                                                </div>
                                            }

                                            {(filteredFollowers.length == 0 && inputFollowers.current != null && followers != null && followers != undefined && typeof followers != 'number') &&
                                                <>
                                                    {(inputFollowers.current.value.length == 0) &&
                                                        followers.map((element, index) => {
                                                            return (
                                                                <div onClick={() => window.location.href = `/profile/${element.user}`} className="max-[531px]:justify-start max-[531px]:items-start cursor-pointer flex items-center justify-between mt-7" key={index}>
                                                                    {!for530Width &&
                                                                        <>
                                                                            <div className="flex items-center">
                                                                                <img className="size-[50px] rounded-[50%] border-[2px] border-[#660eb3]" src={element.profileImg == null ? ImageProfile : element.profileImg} alt="" />

                                                                                <div className="ml-1">
                                                                                    <div className="flex items-center">
                                                                                        <p className="ml-3">{element.user}</p>

                                                                                        {element.isFollowingMe &&
                                                                                            <p className="text-[14px] ml-1 bg-[#0f0f0f] rounded-[5px] p-[2px] pl-2 pr-2">Segue você</p>
                                                                                        }
                                                                                    </div>

                                                                                    <p className="max-[586px]:mr-3 ml-3 text-[15px]">{element.bio.length <= 30 ? element.bio : element.bio.substring(0, 27) + '...'}</p>
                                                                                </div>
                                                                            </div>

                                                                            {(element.isFollowing && element.user != userName) &&
                                                                                <p onClick={(e) => {
                                                                                    e.stopPropagation()
                                                                                    handleFollow(element._id, e)
                                                                                }} className="btnFollow cursor-pointer border-2 border-[#660eb3] rounded-[10px] pl-[15px] pr-[15px] pt-[5px] pb-[5px]">Seguindo</p>
                                                                            }

                                                                            {(!element.isFollowing && element.user != userName) &&
                                                                                <p onClick={(e) => {
                                                                                    e.stopPropagation()
                                                                                    handleFollow(element._id, e)
                                                                                }} className="btnFollow bg-[#660eb3] cursor-pointer border-2 border-[#660eb3] rounded-[10px] pl-[15px] pr-[15px] pt-[5px] pb-[5px]">Seguir</p>
                                                                            }
                                                                        </>
                                                                    }

                                                                    {for530Width &&
                                                                        <>
                                                                            <img className="size-[50px] rounded-[50%] border-[2px] border-[#660eb3]" src={element.profileImg == null ? ImageProfile : element.profileImg} alt="" />

                                                                            <div className="w-full">
                                                                                <div className="w-full flex justify-between items-start">
                                                                                    <div className="flex flex-col items-start">
                                                                                        {!for390Width &&
                                                                                            <p className="ml-3">{element.user}</p>
                                                                                        }

                                                                                        {for390Width &&
                                                                                            <p className="ml-3">{element.user.length > 8 ? element.user.substring(0, 8) + '...' : element.user}</p>
                                                                                        }

                                                                                        {element.isFollowingMe &&
                                                                                            <p className="mt-[1px] ml-[8px] text-[14px] bg-[#0f0f0f] rounded-[5px] p-[2px] pl-2 pr-2">Segue você</p>
                                                                                        }
                                                                                    </div>

                                                                                    {(element.isFollowing && element.user != userName) &&
                                                                                        <p onClick={(e) => {
                                                                                            e.stopPropagation()
                                                                                            handleFollow(element._id, e)
                                                                                        }} className="btnFollow text-[15px] cursor-pointer border-2 border-[#660eb3] rounded-[10px] pl-[15px] pr-[15px] pt-[5px] pb-[5px]">Seguindo</p>
                                                                                    }

                                                                                    {(!element.isFollowing && element.user != userName) &&
                                                                                        <p onClick={(e) => {
                                                                                            e.stopPropagation()
                                                                                            handleFollow(element._id, e)
                                                                                        }} className="btnFollow bg-[#660eb3] cursor-pointer border-2 border-[#660eb3] rounded-[10px] text-[15px] pl-[15px] pr-[15px] pt-[5px] pb-[5px]">Seguir</p>
                                                                                    }
                                                                                </div>

                                                                                <p className="mt-[5px] ml-3 text-[15px]">{element.bio.length <= 30 ? element.bio : element.bio.substring(0, 27) + '...'}</p>
                                                                            </div>
                                                                        </>
                                                                    }
                                                                </div>
                                                            )
                                                        })
                                                    }

                                                    {inputFollowers.current.value.length > 0 &&
                                                        <div className="w-full mt-5">
                                                            <p className="text-[#ffffff] text-center text-[18px]">Não encontrado</p>
                                                        </div>
                                                    }
                                                </>
                                            }

                                            {(filteredFollowers.length > 0) &&
                                                filteredFollowers.map((element, index) => {
                                                    return (
                                                        <div onClick={() => window.location.href = `/profile/${element.user}`} className="max-[531px]:justify-start max-[531px]:items-start cursor-pointer flex items-center justify-between mt-7" key={index}>
                                                            {!for530Width &&
                                                                <>
                                                                    <div className="flex items-center">
                                                                        <img className="size-[50px] rounded-[50%] border-[2px] border-[#660eb3]" src={element.profileImg == null ? ImageProfile : element.profileImg} alt="" />

                                                                        <div className="ml-1">
                                                                            <div className="flex items-center">
                                                                                <p className="ml-3">{element.user}</p>

                                                                                {element.isFollowingMe &&
                                                                                    <p className="text-[14px] ml-1 bg-[#0f0f0f] rounded-[5px] p-[2px] pl-2 pr-2">Segue você</p>
                                                                                }
                                                                            </div>

                                                                            <p className="max-[586px]:mr-3 ml-3 text-[15px]">{element.bio.length <= 30 ? element.bio : element.bio.substring(0, 27) + '...'}</p>
                                                                        </div>
                                                                    </div>

                                                                    {(element.isFollowing && element.user != userName) &&
                                                                        <p onClick={(e) => {
                                                                            e.stopPropagation()
                                                                            handleFollow(element._id, e)
                                                                        }} className="btnFollow cursor-pointer border-2 border-[#660eb3] rounded-[10px] pl-[15px] pr-[15px] pt-[5px] pb-[5px]">Seguindo</p>
                                                                    }

                                                                    {(!element.isFollowing && element.user != userName) &&
                                                                        <p onClick={(e) => {
                                                                            e.stopPropagation()
                                                                            handleFollow(element._id, e)
                                                                        }} className="btnFollow bg-[#660eb3] cursor-pointer border-2 border-[#660eb3] rounded-[10px] pl-[15px] pr-[15px] pt-[5px] pb-[5px]">Seguir</p>
                                                                    }
                                                                </>
                                                            }

                                                            {for530Width &&
                                                                <>
                                                                    <img className="size-[50px] rounded-[50%] border-[2px] border-[#660eb3]" src={element.profileImg == null ? ImageProfile : element.profileImg} alt="" />

                                                                    <div className="w-full">
                                                                        <div className="w-full flex justify-between items-start">
                                                                            <div className="flex flex-col items-start">
                                                                                {!for390Width &&
                                                                                    <p className="ml-3">{element.user}</p>
                                                                                }

                                                                                {for390Width &&
                                                                                    <p className="ml-3">{element.user.length > 8 ? element.user.substring(0, 8) + '...' : element.user}</p>
                                                                                }

                                                                                {element.isFollowingMe &&
                                                                                    <p className="mt-[1px] ml-[8px] text-[14px] bg-[#0f0f0f] rounded-[5px] p-[2px] pl-2 pr-2">Segue você</p>
                                                                                }
                                                                            </div>

                                                                            {(element.isFollowing && element.user != userName) &&
                                                                                <p onClick={(e) => {
                                                                                    e.stopPropagation()
                                                                                    handleFollow(element._id, e)
                                                                                }} className="btnFollow text-[15px] cursor-pointer border-2 border-[#660eb3] rounded-[10px] pl-[15px] pr-[15px] pt-[5px] pb-[5px]">Seguindo</p>
                                                                            }

                                                                            {(!element.isFollowing && element.user != userName) &&
                                                                                <p onClick={(e) => {
                                                                                    e.stopPropagation()
                                                                                    handleFollow(element._id, e)
                                                                                }} className="btnFollow bg-[#660eb3] cursor-pointer border-2 border-[#660eb3] rounded-[10px] text-[15px] pl-[15px] pr-[15px] pt-[5px] pb-[5px]">Seguir</p>
                                                                            }
                                                                        </div>

                                                                        <p className="mt-[5px] ml-3 text-[15px]">{element.bio.length <= 30 ? element.bio : element.bio.substring(0, 27) + '...'}</p>
                                                                    </div>
                                                                </>
                                                            }
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    }

                    {showFollowing &&
                        <>
                            <div className="absolute h-screen w-screen bg-[#808080] z-10 opacity-30"></div>

                            <div className="max-[531px]:pl-3 max-[531px]:pr-3 max-[586px]:pr-7 max-[586px]:pl-7  max-[734px]:pr-10 max-[734px]:pl-10 flex justify-center w-full absolute z-998 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                <div className="text-[#ffffff] w-[600px] h-[480px] overflow-auto bg-[#000000] rounded-[10px]">
                                    <div className="max-[391px]:pr-5 max-[391px]:pl-5 flex flex-col p-7 pt-5 justify-between">
                                        <div className="flex items-center justify-between w-full mb-3">
                                            <h1 className="text-[18px]">Seguindo</h1>

                                            <FontAwesomeIcon onClick={() => {
                                                setShowFollowing(false)
                                                setFilteredFollowing([])
                                                inputFollowing.current = null
                                            }} icon={faClose} className="text-[30px] cursor-pointer" />
                                        </div>

                                        <div>
                                            <input onInput={searchUsers} id="inputFollowing" ref={inputFollowing} className="focus:outline-2 focus:outline-offset-2 focus:outline-none border-transparent border-2 rounded-[5px] w-full bg-[#0f0f0f] pt-[6px] pb-[6px] pr-1 pl-3" placeholder="Pesquisar" />
                                        </div>

                                        <div>
                                            {inputFollowing.current == null &&
                                                <div className="flex flex-col items-center h-full justify-center mt-10">
                                                    <div className="animate-spin inline-block size-10 border-5 border-current border-t-transparent text-[#660eb3] rounded-full dark:text-[#660eb3]" role="status" aria-label="loading">
                                                        <span className="sr-only">Loading...</span>
                                                    </div>
                                                </div>
                                            }

                                            {(filteredFollowing.length == 0 && inputFollowing.current != null && following != null && following != undefined && typeof following != 'number') &&
                                                <>
                                                    {inputFollowing.current.value.length == 0 &&
                                                        following.map((element, index) => {
                                                            return (
                                                                <div onClick={() => window.location.href = `/profile/${element.user}`} className="max-[531px]:justify-start max-[531px]:items-start cursor-pointer flex items-center justify-between mt-7" key={index}>
                                                                    {!for530Width &&
                                                                        <>
                                                                            <div className="flex items-center">
                                                                                <img className="size-[50px] rounded-[50%] border-[2px] border-[#660eb3]" src={element.profileImg == null ? ImageProfile : element.profileImg} alt="" />

                                                                                <div className="ml-1">
                                                                                    <div className="flex items-center">
                                                                                        <p className="ml-3">{element.user}</p>

                                                                                        {element.isFollowingMe &&
                                                                                            <p className="text-[14px] ml-1 bg-[#0f0f0f] rounded-[5px] p-[2px] pl-2 pr-2">Segue você</p>
                                                                                        }
                                                                                    </div>

                                                                                    <p className="max-[586px]:mr-3 ml-3 text-[15px]">{element.bio.length <= 30 ? element.bio : element.bio.substring(0, 27) + '...'}</p>
                                                                                </div>
                                                                            </div>

                                                                            {(element.isFollowing && element.user != userName) &&
                                                                                <p onClick={(e) => {
                                                                                    e.stopPropagation()
                                                                                    handleFollow(element._id, e)
                                                                                }} className="btnFollow cursor-pointer border-2 border-[#660eb3] rounded-[10px] pl-[15px] pr-[15px] pt-[5px] pb-[5px]">Seguindo</p>
                                                                            }

                                                                            {(!element.isFollowing && element.user != userName) &&
                                                                                <p onClick={(e) => {
                                                                                    e.stopPropagation()
                                                                                    handleFollow(element._id, e)
                                                                                }} className="btnFollow bg-[#660eb3] cursor-pointer border-2 border-[#660eb3] rounded-[10px] pl-[15px] pr-[15px] pt-[5px] pb-[5px]">Seguir</p>
                                                                            }
                                                                        </>
                                                                    }

                                                                    {for530Width &&
                                                                        <>
                                                                            <img className="size-[50px] rounded-[50%] border-[2px] border-[#660eb3]" src={element.profileImg == null ? ImageProfile : element.profileImg} alt="" />

                                                                            <div className="w-full">
                                                                                <div className="w-full flex justify-between items-start">
                                                                                    <div className="flex flex-col items-start">
                                                                                        {!for390Width &&
                                                                                            <p className="ml-3">{element.user}</p>
                                                                                        }

                                                                                        {for390Width &&
                                                                                            <p className="ml-3">{element.user.length > 8 ? element.user.substring(0, 8) + '...' : element.user}</p>
                                                                                        }

                                                                                        {element.isFollowingMe &&
                                                                                            <p className="mt-[1px] ml-[8px] text-[14px] bg-[#0f0f0f] rounded-[5px] p-[2px] pl-2 pr-2">Segue você</p>
                                                                                        }
                                                                                    </div>

                                                                                    {(element.isFollowing && element.user != userName) &&
                                                                                        <p onClick={(e) => {
                                                                                            e.stopPropagation()
                                                                                            handleFollow(element._id, e)
                                                                                        }} className="btnFollow text-[15px] cursor-pointer border-2 border-[#660eb3] rounded-[10px] pl-[15px] pr-[15px] pt-[5px] pb-[5px]">Seguindo</p>
                                                                                    }

                                                                                    {(!element.isFollowing && element.user != userName) &&
                                                                                        <p onClick={(e) => {
                                                                                            e.stopPropagation()
                                                                                            handleFollow(element._id, e)
                                                                                        }} className="btnFollow bg-[#660eb3] cursor-pointer border-2 border-[#660eb3] rounded-[10px] text-[15px] pl-[15px] pr-[15px] pt-[5px] pb-[5px]">Seguir</p>
                                                                                    }
                                                                                </div>

                                                                                <p className="mt-[5px] ml-3 text-[15px]">{element.bio.length <= 30 ? element.bio : element.bio.substring(0, 27) + '...'}</p>
                                                                            </div>
                                                                        </>
                                                                    }
                                                                </div>
                                                            )
                                                        })
                                                    }

                                                    {inputFollowing.current.value.length > 0 &&
                                                        <div className="w-full mt-5">
                                                            <p className="text-[#ffffff] text-center text-[18px]">Não encontrado</p>
                                                        </div>
                                                    }
                                                </>
                                            }

                                            {(filteredFollowing.length > 0) &&
                                                filteredFollowing.map((element, index) => {
                                                    return (
                                                        <div onClick={() => window.location.href = `/profile/${element.user}`} className="max-[531px]:justify-start max-[531px]:items-start cursor-pointer flex items-center justify-between mt-7" key={index}>
                                                            {!for530Width &&
                                                                <>
                                                                    <div className="flex items-center">
                                                                        <img className="size-[50px] rounded-[50%] border-[2px] border-[#660eb3]" src={element.profileImg == null ? ImageProfile : element.profileImg} alt="" />

                                                                        <div className="ml-1">
                                                                            <div className="flex items-center">
                                                                                <p className="ml-3">{element.user}</p>

                                                                                {element.isFollowingMe &&
                                                                                    <p className="text-[14px] ml-1 bg-[#0f0f0f] rounded-[5px] p-[2px] pl-2 pr-2">Segue você</p>
                                                                                }
                                                                            </div>

                                                                            <p className="max-[586px]:mr-3 ml-3 text-[15px]">{element.bio.length <= 30 ? element.bio : element.bio.substring(0, 27) + '...'}</p>
                                                                        </div>
                                                                    </div>

                                                                    {(element.isFollowing && element.user != userName) &&
                                                                        <p onClick={(e) => {
                                                                            e.stopPropagation()
                                                                            handleFollow(element._id, e)
                                                                        }} className="btnFollow cursor-pointer border-2 border-[#660eb3] rounded-[10px] pl-[15px] pr-[15px] pt-[5px] pb-[5px]">Seguindo</p>
                                                                    }

                                                                    {(!element.isFollowing && element.user != userName) &&
                                                                        <p onClick={(e) => {
                                                                            e.stopPropagation()
                                                                            handleFollow(element._id, e)
                                                                        }} className="btnFollow bg-[#660eb3] cursor-pointer border-2 border-[#660eb3] rounded-[10px] pl-[15px] pr-[15px] pt-[5px] pb-[5px]">Seguir</p>
                                                                    }
                                                                </>
                                                            }

                                                            {for530Width &&
                                                                <>
                                                                    <img className="size-[50px] rounded-[50%] border-[2px] border-[#660eb3]" src={element.profileImg == null ? ImageProfile : element.profileImg} alt="" />

                                                                    <div className="w-full">
                                                                        <div className="w-full flex justify-between items-start">
                                                                            <div className="flex flex-col items-start">
                                                                                {!for390Width &&
                                                                                    <p className="ml-3">{element.user}</p>
                                                                                }

                                                                                {for390Width &&
                                                                                    <p className="ml-3">{element.user.length > 8 ? element.user.substring(0, 8) + '...' : element.user}</p>
                                                                                }

                                                                                {element.isFollowingMe &&
                                                                                    <p className="mt-[1px] ml-[8px] text-[14px] bg-[#0f0f0f] rounded-[5px] p-[2px] pl-2 pr-2">Segue você</p>
                                                                                }
                                                                            </div>

                                                                            {(element.isFollowing && element.user != userName) &&
                                                                                <p onClick={(e) => {
                                                                                    e.stopPropagation()
                                                                                    handleFollow(element._id, e)
                                                                                }} className="btnFollow text-[15px] cursor-pointer border-2 border-[#660eb3] rounded-[10px] pl-[15px] pr-[15px] pt-[5px] pb-[5px]">Seguindo</p>
                                                                            }

                                                                            {(!element.isFollowing && element.user != userName) &&
                                                                                <p onClick={(e) => {
                                                                                    e.stopPropagation()
                                                                                    handleFollow(element._id, e)
                                                                                }} className="btnFollow bg-[#660eb3] cursor-pointer border-2 border-[#660eb3] rounded-[10px] text-[15px] pl-[15px] pr-[15px] pt-[5px] pb-[5px]">Seguir</p>
                                                                            }
                                                                        </div>

                                                                        <p className="mt-[5px] ml-3 text-[15px]">{element.bio.length <= 30 ? element.bio : element.bio.substring(0, 27) + '...'}</p>
                                                                    </div>
                                                                </>
                                                            }
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    }

                    {showEdit &&
                        <>
                            <div className="absolute h-screen w-screen bg-[#808080] z-10 opacity-30"></div>

                            <div id="cropper" className="max-[466px]:pr-5 max-[466px]:pl-5 max-[768px]:pr-10 max-[768px]:pl-10 max-[768px]:w-full  absolute z-999 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 hidden">
                                <div className="max-[768px]:h-auto max-[768px]:w-full p-5 text-[#ffffff] w-[600px] h-[602px] bg-[#000000] rounded-[10px]">
                                    <div className="flex items-center pb-5 justify-between">
                                        <div className="flex items-center">
                                            <FontAwesomeIcon onClick={() => { document.getElementById('cropper').classList.add('hidden'); document.getElementById('edit').classList.remove('hidden'); fileInputRef.current.value = null }} icon={faArrowLeft} className="text-[30px] cursor-pointer" />
                                            <h1 className="max-[381px]:ml-3 max-[381px]:text-[18px] text-[20px] ml-4">Editar Foto</h1>
                                        </div>

                                        <p onClick={createCroppedImage} className="font-semibold cursor-pointer border-2 border-[#660eb3] bg-[#660eb3] rounded-[10px] pl-[15px] pr-[15px] pt-[5px] pb-[5px]">Aplicar</p>
                                    </div>

                                    {/* Cropper Container */}
                                    <div className="relative h-64 md:h-96 bg-gray-200 mb-4">
                                        <Cropper
                                            image={image}
                                            crop={crop}
                                            zoom={zoom}
                                            aspect={3 / 3}
                                            onCropChange={setCrop}
                                            onCropComplete={onCropComplete}
                                            onZoomChange={setZoom}
                                        />
                                    </div>

                                    {/* Zoom Control */}
                                    <div className="mt-10">
                                        <label className="block text-[#ffffff] text-sm font-bold mb-2">
                                            Zoom: {zoom.toFixed(1)}x
                                        </label>
                                        <input
                                            type="range"
                                            min="1"
                                            max="3"
                                            step="0.1"
                                            value={zoom}
                                            onChange={(e) => setZoom(Number(e.target.value))}
                                            className="accent-[#660eb3] w-full h-2 rounded-lg appearance-none cursor-pointer"
                                            style={{ background: '#ffffff' }}
                                        />
                                    </div>

                                    {/* Controls */}
                                    <div className="flex justify-between">
                                        <button className="hidden"></button>
                                        <button className="hidden"></button>
                                    </div>
                                </div>
                            </div>

                            <div id="edit" className="max-[466px]:pr-5 max-[466px]:pl-5 max-[746px]:pr-10 max-[746px]:pl-10 max-[746px]:w-full absolute z-998 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                <div className="max-[746px]:w-full text-[#ffffff] w-[600px] h-auto bg-[#000000] rounded-[10px]">
                                    <div className="flex items-center p-5 justify-between">
                                        <div className="flex items-center">
                                            <FontAwesomeIcon onClick={() => {
                                                setShowEdit(false)
                                                setCroppedImage(null)
                                            }} icon={faClose} className="text-[30px] cursor-pointer" />

                                            <h1 className="max-[381px]:ml-3 max-[381px]:text-[18px] text-[20px] ml-4">Editar Perfil</h1>
                                        </div>

                                        <p onClick={editProfile} className="font-semibold cursor-pointer border-2 border-[#660eb3] bg-[#660eb3] rounded-[10px] pl-[15px] pr-[15px] pt-[5px] pb-[5px]">Salvar</p>
                                    </div>

                                    <div className="max-[466px]:pl-7 max-[466px]:pr-7 pt-10 pl-10 pr-10 pb-8 flex flex-col items-center">
                                        <div>
                                            <input onChange={onFileChange} type="file" ref={fileInputRef} className="hidden" />

                                            <div onClick={() => fileInputRef.current.click()} className="relative">
                                                <FontAwesomeIcon icon={faCamera} className="max-[381px]:text-[18px] max-[571px]:text-[20px] bg-[#000000] p-3 rounded-[50%] cursor-pointer absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-80 text-[23px]" />
                                                <img id="img" className="max-[381px]:size-[130px] max-[571px]:size-[150px] cursor-pointer border-3 border-[#660eb3] size-[180px] rounded-[50%]" src={croppedImage == null ? img : croppedImage} alt="" />
                                            </div>
                                        </div>

                                        <div className="error flex items-center mt-6 hidden">
                                            <div className="flex p-3 mr-2 bg-[#e30e2a] rounded-[50%] size-[15px] items-center justify-center">
                                                <FontAwesomeIcon icon={faExclamation} />
                                            </div>

                                            <p className="max-[381px]:text-[15px] text-[#e30e2a]">Usuário já cadastrado!</p>
                                        </div>

                                        <div className="error flex items-center mt-6 hidden">
                                            <div className="flex p-3 mr-2 bg-[#e30e2a] rounded-[50%] size-[15px] items-center justify-center">
                                                <FontAwesomeIcon icon={faExclamation} />
                                            </div>

                                            <p className="max-[381px]:text-[14px] text-[#e30e2a]">Formato de imagem inválido!</p>
                                        </div>

                                        <div className="error flex items-center mt-6 hidden">
                                            <div className="flex p-3 mr-2 bg-[#e30e2a] rounded-[50%] size-[15px] items-center justify-center">
                                                <FontAwesomeIcon icon={faExclamation} />
                                            </div>

                                            <p className="max-[381px]:text-[15px] text-[#e30e2a]">Bio muito longa!</p>
                                        </div>

                                        <div className="error flex items-center mt-6 hidden">
                                            <div className="flex p-3 mr-2 bg-[#e30e2a] rounded-[50%] size-[15px] items-center justify-center">
                                                <FontAwesomeIcon icon={faExclamation} />
                                            </div>

                                            <p className="max-[381px]:text-[15px] text-[#e30e2a]">Usuário muito longo!</p>
                                        </div>


                                        <div className="error flex items-center mt-6 hidden">
                                            <div className="flex p-3 mr-2 bg-[#e30e2a] rounded-[50%] size-[15px] items-center justify-center">
                                                <FontAwesomeIcon icon={faExclamation} />
                                            </div>

                                            <p className="max-[381px]:text-[15px] text-[#e30e2a]">Preencha o usuário!</p>
                                        </div>

                                        <div className="error flex items-center mt-6 hidden">
                                            <div className="flex p-3 mr-2 bg-[#e30e2a] rounded-[50%] size-[15px] items-center justify-center">
                                                <FontAwesomeIcon icon={faExclamation} />
                                            </div>

                                            <p className="max-[381px]:text-[15px] text-[#e30e2a]">Usuário muito curto!</p>
                                        </div>

                                        <div className="w-full mt-8 mb-5">
                                            <label htmlFor="user" className="border-transparent border-2 border-b-0 flex justify-between items-center bg-[#0f0f0f] rounded-t-[10px] pr-[15px] pl-[15px] pt-3">
                                                <p className="labelName">Usuário</p>
                                                <p id="userLength">{stringUser} / 15</p>
                                            </label>
                                            <input onChange={handleInput} onInput={handleInput} onFocus={handleFocus} onBlur={handleBlur} className="rounded-b-[10px] w-full resize-none focus:outline-2 focus:outline-offset-2 focus:outline-none border-transparent border-2 focus:border-[#660eb3] border-t-0 w-full bg-[#0f0f0f] pb-3 pr-[15px] pl-[15px]" type="text" id="user" />
                                        </div>

                                        <div className="w-full">
                                            <TextareaProfile value={bio} bioLength={bio.length} length={100} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    }

                    <div className="grid max-[500px]:flex max-[500px]:flex-col max-[500px]:justify-between max-[801px]:grid-cols-[0.7fr_3fr] max-[1080px]:grid-cols-[1fr_3fr_1fr] max-[1300px]:grid-cols-[0.7fr_3fr_1.7fr] grid-cols-[1fr_1.1fr_1fr]">
                        {!for500Width &&
                            <SideBar setShowSearch={setShowSearch} unreadMessages={unreadMessages} img={myImg} user={userName} />
                        }

                        <div className="bg-[#000000] text-[#ffffff] w-full">
                            <div className="max-[500px]:pb-[64px] max-[500px]:border-0 border-[#808080] border-1 border-b-0 min-h-[100vh] pt-[20px]">
                                {notFound &&
                                    <div className="p-[30px] pt-[100px] flex flex-col items-center">
                                        <h1 className="font-semibold text-[30px]">Essa conta não existe</h1>
                                        <p className="mt-3 text-[17px]">Tente realizar outra busca.</p>
                                    </div>
                                }

                                {!notFound &&
                                    <>
                                        <div className="max-[376px]:pr-[20px] max-[591px]:pl-[25px] max-[591px]:pr-[25px] pt-20 flex flex-col border-[#808080] border-1 border-t-0 border-l-0 border-r-0 w-full pl-[30px] pr-[30px]">
                                            <div className="flex items-end justify-between">
                                                <img className="max-[376px]:size-[100px] max-[576px]:size-[110px] cursor-pointer border-3 border-[#660eb3] size-[134px] rounded-[50%]" src={img} alt="" />

                                                {user == userName &&
                                                    <p onClick={() => {
                                                        setShowEdit(true)
                                                        window.scrollTo({ top: 0 })
                                                    }} className="cursor-pointer border-2 border-[#660eb3] rounded-[10px] pl-[15px] pr-[15px] pt-[5px] pb-[5px]">Editar Perfil</p>
                                                }

                                                {user != userName &&
                                                    <>
                                                        {
                                                            <>
                                                                {isFollowing &&
                                                                    <p onClick={(e) => handleFollow('', e)} id="remove" className="btnFollow cursor-pointer border-2 border-[#660eb3] rounded-[10px] pl-[15px] pr-[15px] pt-[5px] pb-[5px]">Seguindo</p>
                                                                }

                                                                {!isFollowing &&
                                                                    <p onClick={(e) => handleFollow('', e)} id="add" className="btnFollow bg-[#660eb3] cursor-pointer border-2 border-[#660eb3] rounded-[10px] pl-[30px] pr-[30px] pt-[5px] pb-[5px]">Seguir</p>
                                                                }
                                                            </>
                                                        }
                                                    </>
                                                }
                                            </div>

                                            <div className="mt-5 w-full wrap-anywhere">
                                                <h1 className="max-[576px]:text-[19px] font-semibold text-[20px]">{requestedUser}</h1>
                                                <p className="mt-2 mb-5">
                                                    {
                                                        bio.split(' ').map((element) => {
                                                            if (element.includes('@'))
                                                                return (
                                                                    <>
                                                                        <span onClick={(e) => {
                                                                            e.stopPropagation()
                                                                            navigate(`/profile/${element.replace('@', '')}`)
                                                                        }} className="cursor-pointer text-[#660eb3] hover:underline">{element}</span>

                                                                        {'\u00A0'}
                                                                    </>
                                                                )

                                                            else return element + ' '
                                                        })
                                                    }
                                                </p>

                                                <div className="flex flex-col">
                                                    <p className='text-[#cccccc] mb-2'>Entrou em {createTime}</p>

                                                    <div className="flex">
                                                        <p onClick={() => {
                                                            if (following.length > 0 || following > 0) {
                                                                setShowFollowing(true)
                                                                window.scrollTo({ top: 0 })
                                                            }
                                                        }} className="cursor-pointer mr-5 text-[#808080]"><span id="following" className="font-semibold text-[#ffffff]">{typeof following == 'number' ? following : following.length}</span> Seguindo</p>

                                                        <p onClick={() => {
                                                            if (followers.length > 0 || followers > 0) {
                                                                setShowFollowers(true)
                                                                window.scrollTo({ top: 0 })
                                                            }
                                                        }} className="cursor-pointer text-[#808080]"><span id="followers" className="font-semibold text-[#ffffff]">{typeof followers == 'number' ? followers : followers.length}</span> Seguidores</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="max-[500px]:pb-[12px] max-[500px]:flex-col max-[500px]:justify-center max-[500px]:items-center max-[500px]:text-[16px] max-[591px]:text-[15px] flex justify-evenly pt-[50px]">
                                                <div onClick={getPosts} style={view == 'posts' ? { borderBottom: 'solid 4px #660eb3' } : { borderBottom: 'none' }} className="max-[500px]:mb-[20px] max-[500px]:pb-[10px] cursor-pointer pb-[30px]">
                                                    <p>Postagens</p>
                                                </div>

                                                <div onClick={getComments} style={view == 'comments' ? { borderBottom: 'solid 4px #660eb3' } : { borderBottom: 'none' }} className="max-[500px]:mb-[20px] max-[500px]:pb-[10px] cursor-pointer pb-[30px]">
                                                    <p>Comentários</p>
                                                </div>

                                                <div onClick={getReplies} style={view == 'replies' ? { borderBottom: 'solid 4px #660eb3' } : { borderBottom: 'none' }} className="max-[500px]:mb-[20px] max-[500px]:pb-[10px] cursor-pointer pb-[30px]">
                                                    <p>Respostas</p>
                                                </div>

                                                {user == userName &&
                                                    <div onClick={getLikes} style={view == 'likes' ? { borderBottom: 'solid 4px #660eb3' } : { borderBottom: 'none' }} className="max-[500px]:pb-[10px] max-[500px]:mb-[20px] cursor-pointer pb-[30px]">
                                                        <p>Curtidas</p>
                                                    </div>
                                                }
                                            </div>
                                        </div>

                                        {view == 'posts' &&
                                            <>
                                                {posts == null &&
                                                    <div className="flex flex-col items-center h-full justify-center mt-10">
                                                        <div className="animate-spin inline-block size-10 border-5 border-current border-t-transparent text-[#660eb3] rounded-full dark:text-[#660eb3]" role="status" aria-label="loading">
                                                            <span className="sr-only">Loading...</span>
                                                        </div>
                                                    </div>
                                                }

                                                {(posts != null && posts.length > 0) &&
                                                    posts.map((element, index) => {
                                                        return (
                                                            <Posts profile={true} key={index} post={element} />
                                                        )
                                                    })
                                                }
                                            </>
                                        }

                                        {view == 'comments' &&
                                            <>
                                                {comments == null &&
                                                    <div className="flex flex-col items-center h-full justify-center mt-10">
                                                        <div className="animate-spin inline-block size-10 border-5 border-current border-t-transparent text-[#660eb3] rounded-full dark:text-[#660eb3]" role="status" aria-label="loading">
                                                            <span className="sr-only">Loading...</span>
                                                        </div>
                                                    </div>
                                                }

                                                {(comments != null && comments.length > 0) &&
                                                    comments.map((element, index) => {
                                                        return (
                                                            <Comment profile={true} key={index} comment={element} />
                                                        )
                                                    })
                                                }
                                            </>
                                        }

                                        {view == 'replies' &&
                                            <>
                                                {replies == null &&
                                                    <div className="flex flex-col items-center h-full justify-center mt-10">
                                                        <div className="animate-spin inline-block size-10 border-5 border-current border-t-transparent text-[#660eb3] rounded-full dark:text-[#660eb3]" role="status" aria-label="loading">
                                                            <span className="sr-only">Loading...</span>
                                                        </div>
                                                    </div>
                                                }

                                                {(replies != null && replies.length > 0) &&
                                                    replies.map((element, index) => {
                                                        return (
                                                            <Posts profile={true} key={index} post={element} reply={true} />
                                                        )
                                                    })
                                                }
                                            </>
                                        }

                                        {view == 'likes' &&
                                            <>
                                                {likes == null &&
                                                    <div className="flex flex-col items-center h-full justify-center mt-10">
                                                        <div className="animate-spin inline-block size-10 border-5 border-current border-t-transparent text-[#660eb3] rounded-full dark:text-[#660eb3]" role="status" aria-label="loading">
                                                            <span className="sr-only">Loading...</span>
                                                        </div>
                                                    </div>
                                                }

                                                {(likes != null && likes.length > 0) &&
                                                    likes.map((element, index) => {
                                                        return <Likes key={index} likes={element} />
                                                    })
                                                }
                                            </>
                                        }
                                    </>
                                }
                            </div>
                        </div>

                        {!for800Width &&
                            <SearchInput />
                        }

                        {for500Width &&
                            <SideBar setShowSearch={setShowSearch} unreadMessages={unreadMessages} img={myImg} user={userName} />
                        }
                    </div>
                </>
            }
        </>
    )
}

export default Profile