import SearchInput from "../searchInput"
import SideBar from "../sideBar"
import { useState, useEffect } from "react"
import ImageProfile from '../../assets/981d6b2e0ccb5e968a0618c8d47671da.jpg'
import { useNavigate } from "react-router-dom"
import SearchOverlay from "../searchOverlay"
import { useMediaQuery } from "react-responsive"

const Notifications = () => {
    const for765Width = useMediaQuery({ query: '(max-width: 765px)' })
    const for500Width = useMediaQuery({ query: '(max-width: 499px)' })

    const [showLoading, setShowLoading] = useState(true)
    const [user, setUser] = useState('')
    const [img, setImg] = useState(ImageProfile)
    const [notifications, setNotifications] = useState([])
    const [notFound, setNotFound] = useState(false)
    const navigate = useNavigate()
    const [showSearch, setShowSearch] = useState(false)
    const [showLoadingLogout, setShowLoadingLogout] = useState(false)

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
                    setShowLoading(false)
                    setUser(output.user)

                    if (output.img != null) setImg(output.img)
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
            const getData = async () => {
                const result = await fetch('http://localhost:3000/notifications', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    credentials: 'include'
                })

                const output = await result.json()

                setNotifications(output.notifications)

                if (output.notifications.length == 0) setNotFound(true)
            }
            getData()
        }
    }, [user])

    const handleClick = (type, postId, commentId, replyId, user) => {
        if (replyId != undefined) navigate(`/post/${postId}?commentId=${commentId}&replyId=${replyId}`)

        else if (replyId == undefined && commentId != undefined) navigate(`/post/${postId}?commentId=${commentId}`)

        else if (commentId == undefined && type != 'follow') navigate(`/post/${postId}`)

        else if (type == 'follow') navigate(`/profile/${user}`)
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
                    {showLoadingLogout &&
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

                    <div className="grid max-[500px]:flex max-[500px]:flex-col max-[500px]:justify-between max-[600px]:grid-cols-[0.7fr_3fr] max-[1080px]:grid-cols-[1fr_3fr_1fr] max-[1300px]:grid-cols-[0.7fr_3fr_1.7fr] grid-cols-[1fr_1.1fr_1fr]">
                        {!for500Width &&
                            <SideBar setShowLoadingLogout={setShowLoadingLogout} setShowSearch={setShowSearch} img={img} user={user} />
                        }

                        <div className="bg-[#000000] text-[#ffffff] w-full max-[500px]:pb-[64px]">
                            <div className="max-[500px]:min-h-[0px] max-[500px]:border-0 max-[600px]:border-r-0 border-[#808080] border-1 border-b-0 min-h-[100vh] pt-[50px]">
                                <div>
                                    <h1 className="mt-[10px] text-[23px] font-semibold ml-7 mb-6">Notificações</h1>
                                </div>

                                {notifications.length > 0 &&
                                    notifications.map((element, index) => {
                                        return (
                                            <div onClick={() => handleClick(element.type, element.postId, element.commentId, element.replyId, element.user)} key={index} style={{ borderTop: index == 0 ? 'solid 1px #808080' : 'none', backgroundColor: element.unread == true ? '#30005bff' : 'none' }} className="cursor-pointer p-7 pt-4 pb-4 border-[#808080] border-1 border-t-0 border-l-0 border-r-0 flex justify-between items-start">
                                                <div className="flex flex-col justify-center w-full">
                                                    <div>
                                                        <div className="flex items-center justify-between">
                                                            <img className="w-[40px] h-[40px] rounded-[50%] border-[2px] border-[#660eb3]" src={element.clientImg == null ? ImageProfile : element.clientImg} alt="" />
                                                            <p className="text-[#cccccc] text-[15px]">{element.time}</p>
                                                        </div>

                                                        <p className="mt-3 ml-0 mr-0">{element.message}</p>

                                                        {(element.type == 'like' || element.type == 'response' || element.type == 'mention') &&
                                                            <p className="text-[#cccccc] text-[15px] mt-3">{element.text}</p>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }

                                {(notifications.length == 0 && notFound == false) &&
                                    <div className="flex flex-col items-center h-full justify-center mt-10">
                                        <div className="animate-spin inline-block size-10 border-5 border-current border-t-transparent text-[#660eb3] rounded-full dark:text-[#660eb3]" role="status" aria-label="loading">
                                            <span className="sr-only">Loading...</span>
                                        </div>
                                    </div>
                                }

                                {(notifications.length == 0 && notFound == true) &&
                                    <h1 className="font-semibold text-[25px] text-center mt-12">Não há notificações</h1>
                                }
                            </div>
                        </div>

                        {!for765Width &&
                            <SearchInput />
                        }

                        {for500Width &&
                            <SideBar setShowLoadingLogout={setShowLoadingLogout} setShowSearch={setShowSearch} img={img} user={user} />
                        }
                    </div>
                </>
            }
        </>
    )
}

export default Notifications