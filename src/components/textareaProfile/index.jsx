import Mentions from 'rc-mentions'
import './textareaProfile.less'
import { useState, useRef } from 'react'
import ImageProfile from '../../assets/981d6b2e0ccb5e968a0618c8d47671da.jpg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'

const { Option } = Mentions
let timeout
let controller

const TextareaProfile = props => {
    const [users, setUsers] = useState([])
    const [result, setResult] = useState(false)
    const [stringBio, setStringBio] = useState(props.bioLength)
    const [mentions, setMentions] = useState([])
    const [content, setContent] = useState(null)
    const containerRef = useRef(null)
    const timeout = useRef(null)
    const controller = useRef(null)
    const mentionIndex = useRef(null)

    const loading =
        <div className="flex flex-col items-center bg-[#0f0f0f] h-full justify-center">
            <div className="animate-spin inline-block size-5 border-5 border-current border-t-transparent text-[#660eb3] rounded-full dark:text-[#660eb3]" role="status" aria-label="loading">
                <span className="sr-only">Loading...</span>
            </div>
        </div>

    const notFound =
        <div className='text-center'>
            <p className='text-[15px]]'>Não encontrado</p>
        </div>

    const handleFocus = () => {
        const labels = document.getElementsByTagName('label')

        labels[2].style.border = 'solid 2px #660eb3'
        labels[2].style.borderBottom = 'solid 0px #660eb3'
    }

    const handleBlur = () => {
        const labels = document.getElementsByTagName('label')

        labels[2].style.border = '2px solid transparent'
        labels[2].style.borderBottom = '0px solid transparent'
    }

    const handleChange = (text) => {
        const length = text.length
        setStringBio(length)

        if (length > props.length) document.getElementById('stringLength').style.color = 'red'

        else document.getElementById('stringLength').style.color = 'white'
    }

    const getUsers = async (user) => {
        if (controller.current) {
            controller.current.abort()
        }

        controller.current = new AbortController()
        const signal = controller.current.signal

        const result = await fetch('http://localhost:3000/searchUsers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include',
            signal,
            body: JSON.stringify({ value: user })
        })

        const output = await result.json()
        controller.current = null

        if (output.status == 'success') {
            if (output.users.length == 0) {
                setContent(notFound)
            }

            else {
                setUsers(output.users)
                setResult(true)
            }
        }
    }

    const handleInput = (e) => {
        setContent(loading)

        const regex = /@[^\s]+/g
        const search = e.target.value
        const searchMentions = search.match(regex)

        if (result) {
            setResult(false)
        }

        if (mentionIndex.current != null) {
            mentionIndex.current = null
        }

        if (searchMentions != null) {
            for (let i = 0; i < searchMentions.length; i++) {
                if (searchMentions[i] != mentions[i]) {
                    setMentions(searchMentions)

                    clearTimeout(timeout.current)
                    timeout.current = setTimeout(() => getUsers(searchMentions[i].replace("@", '')), 1000)

                    const cursorIndex = e.target.selectionStart

                    const textBefore = search.slice(0, cursorIndex)
                    const lastAt = textBefore.lastIndexOf('@')
                    const textAfter = search.slice(cursorIndex)
                    const nextSpace = textAfter.indexOf(' ')

                    mentionIndex.current = { start: lastAt, end: nextSpace == -1 ? search.length - 1 : (textBefore.length + textAfter.slice(0, nextSpace).length) - 1 }

                    break
                }
            }
        }
    }

    const handleCursor = (e) => {
        if (e.keyCode == '37' || e.keyCode == '39' || e.type == 'click') {
            setContent(loading)

            const text = e.target.value
            const cursorIndex = e.target.selectionStart

            if (mentionIndex.current != null && (mentionIndex.current.start >= cursorIndex || mentionIndex.current.end + 1 < cursorIndex)) {
                setResult(false)
                mentionIndex.current = null
            }

            const textBefore = text.slice(0, cursorIndex)
            const lastAt = textBefore.lastIndexOf('@')

            if (lastAt != -1 && mentionIndex.current == null) {
                const textBetween = textBefore.slice(lastAt)

                if (!textBetween.includes(' ')) {
                    const textAfter = text.slice(cursorIndex)
                    const nextSpace = textAfter.indexOf(' ')
                    const mention = textBetween + (nextSpace == -1 ? textAfter : textAfter.slice(0, nextSpace))
                    mentionIndex.current = { start: lastAt, end: nextSpace == -1 ? text.length - 1 : (textBefore.length + textAfter.slice(0, nextSpace).length) - 1 }

                    clearTimeout(timeout.current)
                    timeout.current = setTimeout(() => getUsers(mention.replace('@', '')), 1000)
                }
            }
        }
    }

    return (
        <>
            <label className="flex justify-between w-full border-transparent border-2 border-b-0 bg-[#0f0f0f] rounded-t-[10px] pr-[15px] pl-[15px] pt-3" htmlFor="bio-form">
                <p>Bio</p>
                <p id='stringLength'>{stringBio} / {props.length}</p>
            </label>

            <div className='relative' ref={containerRef}>
                <Mentions onClick={handleCursor} onKeyUp={handleCursor} prefixCls='profile' dropdownClassName="profile-mentions-dropdown" getPopupContainer={() => containerRef.current} defaultValue={props.value} id='bio-form' notFoundContent={content} onInput={handleInput} onBlur={handleBlur} onFocus={handleFocus} onChange={handleChange} className='profile w-full resize-none bg-[#0f0f0f]'>
                    {result &&
                        <>
                            {
                                users.map((element, index) => {
                                    return (
                                        <Option value={element.user} onClick={() => navigate(`/profile/${element.user}`)} className="bg-[#0f0f0f] w-full flex cursor-pointer items-center text-[#ffffff]" key={index}>
                                            <img className="w-[45px] h-[45px] rounded-[50%]" src={element.profileImg == null ? ImageProfile : element.profileImg} alt="" />

                                            <div className="flex flex-col ml-2">
                                                <p className="text-[15px]">{element.user}</p>

                                                {(element.isFollowingAndFollower != undefined || element.isFollowing != undefined || element.isFollowingMe != undefined) &&
                                                    <div className="flex items-center mt-1">
                                                        <FontAwesomeIcon icon={faUser} className="mr-1" />

                                                        {element.isFollowingAndFollower &&
                                                            <p className="text-[14px]">Vocês se seguem</p>
                                                        }

                                                        {element.isFollowing &&
                                                            <p className="text-[14px]">Você segue</p>
                                                        }

                                                        {element.isFollowingMe &&
                                                            <p className="text-[14px]">Segue você</p>
                                                        }
                                                    </div>
                                                }
                                            </div>
                                        </Option>
                                    )
                                })
                            }
                        </>
                    }
                </Mentions>
            </div>
        </>
    )
}

export default TextareaProfile