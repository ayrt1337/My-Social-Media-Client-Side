import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import ImageProfile from '../../assets/981d6b2e0ccb5e968a0618c8d47671da.jpg'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUser } from "@fortawesome/free-solid-svg-icons"
import { useMediaQuery } from "react-responsive"

let timeout
let controller

const SearchInput = () => {
    const for1080Width = useMediaQuery({ query: '(max-width: 1080px)' })

    const inputDiv = useRef(null)
    const [users, setUsers] = useState([])
    const [inputValue, setInputValue] = useState(null)
    const [results, showResults] = useState(false)
    const navigate = useNavigate()
    const inputRef = useRef(null)
    const [showLoading, setShowLoading] = useState(false)

    document.body.addEventListener('click', (e) => {
        if (!inputDiv.current.contains(e.target)) {
            if (showResults) showResults(false)
        }
    })

    const handleInput = (e) => {
        if (e.target.value.length >= 2) {
            if (results == false) showResults(true)

            setShowLoading(true)
            setInputValue(e.target.value)

            clearTimeout(timeout)
            timeout = setTimeout(async () => {
                if (controller) {
                    controller.abort()
                }

                controller = new AbortController()
                let signal = controller.signal

                const result = await fetch(`http://localhost:3000/searchUsers`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    credentials: 'include',
                    signal,
                    body: JSON.stringify({ value: e.target.value })
                })

                const output = await result.json()
                controller = null

                if (output.status == 'success') {
                    setUsers(output.users)
                    setShowLoading(false)
                }
            }, 1000)
        }

        else {
            showResults(false)
        }
    }

    const handleEnter = (e) => {
        if (e.key == 'Enter') {
            navigate(`/profile/${inputValue}`)
        }
    }

    return (
        <div className="max-[1300px]:pl-[30px] h-full bg-[#000000] text-[#ffffff] top-[0px] right-[0px] pl-[50px] pt-[50px] w-full">
            <div ref={inputDiv} onFocus={handleInput} className="fixed flex flex-col relative">
                {!for1080Width &&
                    <input onKeyDown={handleEnter} ref={inputRef} onInput={handleInput} className="focus:outline-2 focus:outline-offset-2 focus:outline-none border-transparent border-2 rounded-[15px] focus:border-[#660eb3] max-w-[280px] w-full bg-[#0f0f0f] pt-3 pb-3 pr-5 pl-4" placeholder="Pesquisar" id="search" />
                }

                {results &&
                    <div style={users.length > 4 ? { overflow: 'auto', height: '337px' } : { overflow: 'visible' }} id="result" className="absolute mt-17 bg-[#0f0f0f] max-w-[280px] w-full rounded-[15px]">
                        {showLoading &&
                            <div className="rounded-tl-[15px] rounded-tr-[15px] pt-5 flex flex-col items-center bg-[#0f0f0f] h-full justify-center">
                                <div className="animate-spin inline-block size-5 border-5 border-current border-t-transparent text-[#660eb3] rounded-full dark:text-[#660eb3]" role="status" aria-label="loading">
                                    <span className="sr-only">Loading...</span>
                                </div>
                            </div>
                        }

                        {!showLoading &&
                            <>
                                {users.length == 0 &&
                                    <h2 className="text-center p-4 pt-[20px]">Não encotrado</h2>
                                }

                                {users.length > 0 &&
                                    <>
                                        {
                                            users.map((user, index) => {
                                                return (
                                                    <div style={index == 0 ? { borderTopLeftRadius: '15px', borderTopRightRadius: '15px', paddingTop: '18px' } : { borderTopLeftRadius: '0px', borderTopRightRadius: '0px' }} onClick={() => navigate(`/profile/${user.user}`)} className="hover:bg-[#30005bff] flex cursor-pointer items-center p-4 pb-3 pt-3" key={index}>
                                                        <img className="w-[45px] h-[45px] rounded-[50%]" src={user.profileImg == null ? ImageProfile : user.profileImg} alt="" />

                                                        <div className="flex flex-col ml-2">
                                                            <p className="text-[15px]">{user.user}</p>

                                                            {(user.isFollowingAndFollower != undefined || user.isFollowing != undefined || user.isFollowingMe != undefined) &&
                                                                <div className="flex items-center mt-1">
                                                                    <FontAwesomeIcon icon={faUser} className="mr-1" />

                                                                    {user.isFollowingAndFollower &&
                                                                        <p className="text-[14px]">Vocês se seguem</p>
                                                                    }

                                                                    {user.isFollowing &&
                                                                        <p className="text-[14px]">Você segue</p>
                                                                    }

                                                                    {user.isFollowingMe &&
                                                                        <p className="text-[14px]">Segue você</p>
                                                                    }
                                                                </div>
                                                            }
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </>
                                }
                            </>
                        }

                        <div onClick={() => navigate(`/profile/${inputRef.current.value}`)} className="cursor-pointer items-center p-4 pt-2">
                            <div className="">
                                <p className="text-[15px]">Acesse @{inputValue}</p>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default SearchInput