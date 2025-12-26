import { useEffect, useState, useId } from "react"
import ImageProfile from '../../assets/981d6b2e0ccb5e968a0618c8d47671da.jpg'
import SideBar from "../sideBar"
import SearchInput from "../searchInput"
import Textarea from "../textarea"
import Posts from "../post"
import { useNavigate } from "react-router-dom"
import SearchOverlay from "../searchOverlay"
import { useMediaQuery } from "react-responsive"

const Home = () => {
    const for765Width = useMediaQuery({ query: '(max-width: 765px)' })
    const for500Width = useMediaQuery({ query: '(max-width: 499px)' })

    const [showLoading, setShowLoading] = useState(true)
    const [user, setUser] = useState('')
    const [img, setImg] = useState(ImageProfile)
    const [posts, setPosts] = useState([])
    const navigate = useNavigate()
    const id = useId()
    const [unreadMessages, setUnreadMessages] = useState(null)
    const [showSearch, setShowSearch] = useState(false)

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
            const getPosts = async () => {
                const result = await fetch('http://localhost:3000/getPosts', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    credentials: 'include'
                })
                const output = await result.json()

                setPosts(output.posts)
            }

            getPosts()
        }
    }, [user])

    const submitPost = async () => {
        const value = document.getElementById(id).firstChild.firstChild.firstChild.value

        if (value.length > 0 && value.length < 200) {
            const result = await fetch('http://localhost:3000/createPost', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ text: value })
            })

            const output = await result.json()

            if (output.status == 'success') window.location.href = '/home'
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

                    <div className="grid max-[500px]:flex max-[500px]:flex-col max-[500px]:justify-between max-[667px]:grid-cols-[0.7fr_3fr] max-[1080px]:grid-cols-[1fr_3fr_1fr] max-[1300px]:grid-cols-[0.7fr_3fr_1.7fr] grid-cols-[1fr_1.1fr_1fr]">
                        {!for500Width &&
                            <SideBar setShowSearch={setShowSearch} unreadMessages={unreadMessages} img={img} user={user} />
                        }

                        <div className="bg-[#000000] text-[#ffffff] w-full max-[500px]:pb-[64px]">
                            <div className="max-[500px]:min-h-[0px] max-[500px]:border-0 max-[600px]:border-r-0 border-[#808080] border-1 border-b-0 min-h-[100vh] pt-[50px]">
                                <div className="flex flex-col border-[#808080] border-1 border-t-0 border-l-0 border-r-0 w-full pl-7 pr-7 pb-[30px]">
                                    <div className="flex">
                                        <img onClick={(e) => {
                                            e.stopPropagation()
                                            navigate(`/profile/${user}`)
                                        }} className="max-[500px]:w-[45px] max-[500px]:h-[45px] cursor-pointer border-[2px] border-[#660eb3] w-[55px] h-[55px] rounded-[50%]" src={img} alt="" />

                                        <div id={id} className="flex flex-col w-full ml-3 items-end">
                                            <Textarea length={200} placeholder={'Compartilhe o seu dia com os outros'} />

                                            <p onClick={submitPost} className="text-[16px] font-semibold bg-[#660eb3] mt-5 pb-2 pt-2 pl-7 pr-7 rounded-[15px] cursor-pointer">
                                                Postar
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {posts.length == 0 &&
                                    <div className="flex flex-col items-center h-full justify-center mt-10">
                                        <div className="animate-spin inline-block size-10 border-5 border-current border-t-transparent text-[#660eb3] rounded-full dark:text-[#660eb3]" role="status" aria-label="loading">
                                            <span className="sr-only">Loading...</span>
                                        </div>
                                    </div>
                                }

                                {posts.length > 0 &&
                                    <>
                                        {
                                            posts.map((element, index) => {
                                                return <Posts key={index} post={element} />
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
                            <SideBar setShowSearch={setShowSearch} unreadMessages={unreadMessages} img={img} user={user} />
                        }
                    </div>
                </>
            }
        </>
    )
}

export default Home