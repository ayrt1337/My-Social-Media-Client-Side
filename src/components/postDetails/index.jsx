import ImageProfile from '../../assets/981d6b2e0ccb5e968a0618c8d47671da.jpg'
import { useState, useEffect, useId } from 'react'
import SideBar from '../sideBar'
import SearchInput from '../searchInput'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeftLong } from '@fortawesome/free-solid-svg-icons'
import { useParams, useNavigate } from 'react-router-dom'
import Textarea from '../textarea'
import Comment from '../comment'
import SearchOverlay from '../searchOverlay'
import { useMediaQuery } from "react-responsive"

const Post = () => {
    const for765Width = useMediaQuery({ query: '(max-width: 765px)' })
    const for500Width = useMediaQuery({ query: '(max-width: 499px)' })

    const [showLoading, setShowLoading] = useState(true)
    const [user, setUser] = useState('')
    const [img, setImg] = useState(ImageProfile)
    const [post, setPost] = useState([])
    const [comments, setComments] = useState([])
    const _id = useId()
    const _id2 = useId()
    const _id3 = useId()
    const [icon, setIcon] = useState('fa-regular fa-heart')
    const navigate = useNavigate()
    const [unreadMessages, setUnreadMessages] = useState(null)
    const [notFound, setNotFound] = useState(false)
    const [showSearch, setShowSearch] = useState(false)
    const [showLoadingComment, setShowLoadingComment] = useState(false)

    const { id } = useParams()

    useEffect(() => {
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
                    setUser(output.user)

                    if (output.img != null) setImg(output.img)

                    if (output.notifications != undefined) setUnreadMessages(output.notifications)
                }
            }

            else {
                window.alert('Você não possui sessão')
                navigate('/login')
            }
        }

        getSession()
    }, [])

    useEffect(() => {
        if (user != '') {
            const getPost = async () => {
                const result = await fetch('http://localhost:3000/getPost/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({ id: id })
                })

                const output = await result.json()

                if (output.status == 'fail') {
                    setNotFound(true)
                    setShowLoading(false)
                }

                else {
                    if (output.isLiked) setIcon('fa-solid fa-heart')

                    else setIcon('fa-regular fa-heart')

                    setPost(output)
                    setShowLoading(false)

                    if (output.comments > 0) {
                        const result2 = await fetch('http://localhost:3000/getComments', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Accept': 'application/json'
                            },
                            credentials: 'include',
                            body: JSON.stringify({ id: id })
                        })

                        const output2 = await result2.json()
                        if (output2.comments.length > 0) setComments(output2.comments)
                    }
                }
            }

            getPost()
        }
    }, [user])

    const handleLike = async (type, id) => {
        let action
        const heart = document.getElementById(_id)

        if (icon == 'fa-regular fa-heart') {
            action = 'add'
            setIcon('fa-solid fa-heart')
            heart.style.color = '#660eb3'
            document.getElementById(_id2).innerText = Number(document.getElementById(_id2).innerText) + 1
        }

        else {
            action = 'remove'
            setIcon('fa-regular fa-heart')
            heart.style.color = 'white'
            document.getElementById(_id2).innerText = Number(document.getElementById(_id2).innerText) - 1
        }

        await fetch('http://localhost:3000/handleLike', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ type: type, id: id, action: action })
        })
    }

    const submitComment = async () => {
        const value = document.getElementById(_id3).firstChild.firstChild.firstChild.firstChild.value

        if (value.length > 0 && value.length < 200) {
            document.body.style.overflow = 'hidden'
            scrollTo(top)
            setShowLoadingComment(true)

            const result = await fetch('http://localhost:3000/createComment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ postId: id, text: value })
            })

            const output = await result.json()

            if (output.status == 'success') window.location.href = `/post/${id}`
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
                    {showLoadingComment &&
                        <>
                            <div className="h-full w-full absolute z-1000 opacity-30 bg-[#808080]"></div>

                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-1001 animate-spin inline-block size-20 border-5 border-current border-t-transparent text-[#660eb3] rounded-full dark:text-[#660eb3]" role="status" aria-label="loading">
                                <span className="sr-only">Loading...</span>
                            </div>
                        </>
                    }

                    {showSearch &&
                        <SearchOverlay setShowSearch={setShowSearch} />
                    }

                    <div className="grid max-[500px]:flex max-[500px]:flex-col max-[500px]:justify-between max-[761px]:grid-cols-[0.7fr_3fr] max-[1080px]:grid-cols-[1fr_3fr_1fr] max-[1300px]:grid-cols-[0.7fr_3fr_1.7fr] grid-cols-[1fr_1.1fr_1fr]">
                        {!for500Width &&
                            <SideBar setShowLoadingLogout={setShowLoadingComment} unreadMessages={unreadMessages} setShowSearch={setShowSearch} img={img} user={user} />
                        }

                        <div className="bg-[#000000] text-[#ffffff] w-full max-[500px]:pb-[64px]">
                            <div className="max-[500px]:min-h-[0px] max-[500px]:border-0 max-[600px]:border-r-0 border-[#808080] border-1 border-b-0 min-h-[100vh] pt-[50px]">
                                {notFound &&
                                    <div className="p-[30px] pt-[100px] flex flex-col items-center">
                                        <h1 className="max-[600px]:text-[25px] font-semibold text-[30px]">Este post não existe</h1>
                                        <p className="max-[600px]:text-[16px] mt-3 text-[17px]">Tente realizar outra busca.</p>
                                    </div>
                                }

                                {!notFound &&
                                    <>
                                        <div className="pl-6 pr-6 flex items-center">
                                            <FontAwesomeIcon onClick={() => navigate(-1)} className='text-[28px] cursor-pointer ml-2' icon={faArrowLeftLong} />
                                            <h1 className='text-[23px] ml-4 font-semibold'>Post</h1>
                                        </div>

                                        <div className="flex w-full wrap-anywhere p-7 pt-10 pb-8 border-1 border-t-0 border-l-0 border-r-0 border-[#808080]">
                                            <img onClick={() => navigate(`/profile/${post.user}`)} className="max-[500px]:w-[55px] max-[500px]:h-[55px] cursor-pointer border-[2px] border-[#660eb3] w-[70px] h-[70px] rounded-[50%]" src={post.profileImg == null ? ImageProfile : post.profileImg} alt="" />

                                            <div className="ml-3 mt-1">
                                                <p onClick={() => navigate(`/profile/${post.user}`)} className="text-[18px] mb-1 font-semibold cursor-pointer">{post.user}</p>

                                                <p className='text-[17px]'>
                                                    {post.text != undefined &&
                                                        post.text.split(' ').map((element) => {
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

                                                <div className='mt-3'>
                                                    <p className='text-[#cccccc] text-[15px] mb-2'>{post.createdAt}</p>

                                                    <div className="flex text-[20px] items-center">
                                                        <div className='flex items-center cursor-pointer'>
                                                            <FontAwesomeIcon className="mr-2" icon='fa-regular fa-comment' />
                                                            <p className="text-[16px]">{post.comments != undefined && typeof post.comments == 'number' ? post.comments : post.comments.length}</p>
                                                        </div>

                                                        <div className="flex items-center cursor-pointer" onClick={() => handleLike('post', post.id)}>
                                                            <FontAwesomeIcon id={_id} style={post.isLiked == true ? { color: '#660eb3' } : { color: 'white' }} className="mr-2 ml-5" icon={icon} />
                                                            <p id={_id2} className="text-[16px]">{post.likes}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex p-7 border-[#808080] border-1 border-t-0 border-l-0 border-r-0">
                                            <img onClick={() => navigate(`/profile/${user}`)} className="cursor-pointer border-[2px] border-[#660eb3] w-[55px] h-[55px] rounded-[50%]" src={img} alt="" />

                                            <div id={_id3} className="flex flex-col w-full ml-3 items-end">
                                                <Textarea length={200} placeholder={'Postar comentário'} />

                                                <p onClick={submitComment} className="text-[16px] font-semibold bg-[#660eb3] mt-5 pb-2 pt-2 pl-7 pr-7 rounded-[15px] cursor-pointer">
                                                    Comentar
                                                </p>
                                            </div>
                                        </div>

                                        {(comments.length == 0 && post.comments > 0) &&
                                            <div className="flex flex-col items-center h-full justify-center mt-10">
                                                <div className="animate-spin inline-block size-10 border-5 border-current border-t-transparent text-[#660eb3] rounded-full dark:text-[#660eb3]" role="status" aria-label="loading">
                                                    <span className="sr-only">Loading...</span>
                                                </div>
                                            </div>
                                        }

                                        {(comments.length > 0) &&
                                            comments.map((element, index) => {
                                                return <Comment setShowLoadingComment={setShowLoadingComment} key={index} comment={element} profileImg={img} user={user} postId={id} />
                                            })
                                        }
                                    </>
                                }
                            </div>
                        </div>

                        {!for765Width &&
                            <SearchInput />
                        }

                        {for500Width &&
                            <SideBar setShowLoadingLogout={setShowLoadingComment} setShowSearch={setShowSearch} unreadMessages={unreadMessages} img={img} user={user} />
                        }
                    </div>
                </>
            }
        </>
    )
}

export default Post