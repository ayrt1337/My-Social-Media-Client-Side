import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Textarea from "../textarea"
import { useState, useId, useRef } from "react"
import Reply from "../reply"
import { useNavigate } from "react-router-dom"
import ImageProfile from '../../assets/981d6b2e0ccb5e968a0618c8d47671da.jpg'
import { useMediaQuery } from "react-responsive"

const Comment = props => {
    const for541Width = useMediaQuery({ query: '(max-width: 541px)' })

    const navigate = useNavigate()
    const [showReplies, setShowReplies] = useState(false)
    const [showLoading, setShowLoading] = useState(props.comment.comments > 0 ? true : false)
    const [replies, setReplies] = useState([])
    const words = props.comment.text.split(' ')
    const [icon, setIcon] = useState(props.comment.isLiked == true ? 'fa-solid fa-heart' : 'fa-regular fa-heart')
    const id = useId()
    const _id = useId()
    const _id2 = useId()
    const comment = useRef(null)

    const handleLike = async (type, id) => {
        let action
        const heart = document.getElementById(_id)

        if (icon == 'fa-regular fa-heart') {
            action = 'add'
            setIcon('fa-solid fa-heart')
            heart.style.color = '#660eb3'
            document.getElementById(_id2).innerText = `${Number(document.getElementById(_id2).innerText) + 1}`
        }

        else {
            action = 'remove'
            setIcon('fa-regular fa-heart')
            heart.style.color = 'white'
            document.getElementById(_id2).innerText = `${Number(document.getElementById(_id2).innerText) - 1}`
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

    const handleClick = async (id, comments) => {
        if (props.profile) navigate(`/post/${props.comment.postId}?commentId=${props.comment._id}`)

        else if (!showReplies) {
            setShowReplies(true)

            if (comments > 0) {
                const result = await fetch('http://localhost:3000/getReplies', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({ id: id })
                })

                const output = await result.json()
                setReplies(output.replies)
                setShowLoading(false)
            }
        }

        else setShowReplies(false)
    }

    const handleLoad = () => {
        const queryString = window.location.search
        const urlParams = new URLSearchParams(queryString)
        const commentId = urlParams.get('commentId')
        const replyId = urlParams.get('replyId')

        if (commentId == props.comment._id) {
            if (replyId == undefined) {
                comment.current.scrollIntoView({ block: 'center' })
                navigate(`/post/${props.comment.postId}`, { replace: true })
            }

            else comment.current.firstChild.click()
        }
    }

    const submitReply = async (commentId) => {
        const value = document.getElementById(id).firstChild.firstChild.value

        if (value.length > 0 && value.length < 200) {
            const result = await fetch('http://localhost:3000/createReply', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ commentId: commentId, text: value })
            })

            const output = await result.json()
            const replyId = output.id

            if (output.status == 'success') window.location.href = `?commentId=${commentId}&replyId=${replyId}`
        }
    }

    return (
        <div ref={comment} className="flex flex-col w-auto wrap-anywhere pt-7 border-[#808080] border-1 border-t-0 border-l-0 border-r-0">
            <div id={props.comment._id} onLoad={handleLoad} onClick={() => handleClick(props.comment._id, props.comment.comments)} className="max-[611px]:pr-7 cursor-pointer flex pl-7 pr-7 pb-7">
                <img onClick={(e) => {
                    e.stopPropagation()
                    navigate(`/profile/${props.comment.user}`)
                }} className="max-[611px]:w-[45px] max-[611px]:h-[45px] border-[2px] border-[#660eb3] w-[55px] h-[55px] rounded-[50%]" src={props.comment.profileImg == null ? ImageProfile : props.comment.profileImg} alt="" />

                <div className="ml-3 mt-[2px]">
                    <div className="flex max-[541px]:flex-col">
                        <p onClick={(e) => {
                            e.stopPropagation()
                            navigate(`/profile/${props.comment.user}`)
                        }} className="max-[611px]:text-[15px] max-[468px]:mb-[2px] mb-1 font-semibold max-w-[150px]">{props.comment.user}</p>

                        {!for541Width &&
                            <>
                                {'\u00A0'}

                                <p className="max-[611px]:text-[14px] text-[#cccccc] text-[15px]">· {props.comment.createdAt}</p>
                            </>
                        }

                        {for541Width &&
                            <p className="mb-2 text-[#cccccc] text-[15px]">{props.comment.createdAt}</p>
                        }
                    </div>

                    <p>
                        {
                            words.map((element) => {
                                if (element.includes('@'))
                                    return (
                                        <>
                                            <span onClick={(e) => {
                                                e.stopPropagation()
                                                if (element.replace('@', '') == props.user && props.profile == true) window.scrollTo({ top: 0 })
                                                else navigate(`/profile/${element.replace('@', '')}`)
                                            }} className="text-[#660eb3] hover:underline">{element}</span>

                                            {'\u00A0'}
                                        </>
                                    )

                                else return element + ' '
                            })
                        }
                    </p>

                    <div className="flex text-[20px] mt-3 items-center">
                        <FontAwesomeIcon className="mr-2" icon='fa-regular fa-comment' />
                        <p className="text-[16px]">{props.comment.comments}</p>

                        <div className="flex items-center" onClick={(e) => {
                            e.stopPropagation()
                            handleLike('comment', props.comment._id)
                        }}>
                            <FontAwesomeIcon id={_id} style={props.comment.isLiked == true ? { color: '#660eb3' } : { color: 'white' }} className="mr-2 ml-5" icon={icon} />
                            <p id={_id2} className="text-[16px]">{props.comment.likes}</p>
                        </div>
                    </div>
                </div>
            </div>

            {showReplies &&
                <>
                    {showLoading &&
                        <div className="flex flex-col items-center h-full justify-center mb-7">
                            <div className="animate-spin inline-block size-8 border-5 border-current border-t-transparent text-[#660eb3] rounded-full dark:text-[#660eb3]" role="status" aria-label="loading">
                                <span className="sr-only">Loading...</span>
                            </div>
                        </div>
                    }

                    {!showLoading &&
                        <>
                            <div onClick={() => handleClick(props.comment._id, props.comment.comments)} className="border-1 border-[#808080] border-l-0 border-r-0 pl-7 pr-7 pb-5 cursor-pointer text-center pt-5">
                                <p>Ocultar respostas</p>
                            </div>

                            <div className="flex mt-10 pl-7 pr-7">
                                <img onClick={(e) => {
                                    e.stopPropagation()
                                    navigate(`/profile/${props.user}`)
                                }} className="cursor-pointer border-[2px] border-[#660eb3] w-[55px] h-[55px] rounded-[50%]" src={props.profileImg} alt="" />

                                <div style={replies.length > 0 ? { marginBottom: '0px' } : { marginBottom: '40px' }} onClick={(e) => e.stopPropagation()} className="flex flex-col w-full ml-3 items-start">
                                    <Textarea id={id} length={200} placeholder={'Postar resposta'} />

                                    <p onClick={() => submitReply(props.comment._id)} className="text-[16px] font-semibold bg-[#660eb3] mt-5 pb-2 pt-2 pl-7 pr-7 rounded-[15px] cursor-pointer">
                                        Responder
                                    </p>
                                </div>
                            </div>

                            {replies.length > 0 &&
                                <>
                                    {
                                        replies.map((element, index) => {
                                            let lastIndex = null

                                            if (index == replies.length - 1) lastIndex = true

                                            return <Reply postId={props.comment.postId} key={index} reply={element} index={lastIndex} commentId={props.comment._id} />
                                        })
                                    }
                                </>
                            }
                        </>
                    }
                </>
            }
        </div>
    )
}

export default Comment