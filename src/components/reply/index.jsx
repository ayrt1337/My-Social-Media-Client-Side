import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Textarea from "../textarea"
import { useState, useId, useRef } from "react"
import { useNavigate } from "react-router-dom"
import ImageProfile from '../../assets/981d6b2e0ccb5e968a0618c8d47671da.jpg'
import { useMediaQuery } from "react-responsive"

const Reply = props => {
    const for541Width = useMediaQuery({ query: '(max-width: 541px)' })

    const [showTextarea, setShowTextarea] = useState(false)
    const words = props.reply.text.split(' ')
    const [icon, setIcon] = useState(props.reply.isLiked == true ? 'fa-solid fa-heart' : 'fa-regular fa-heart')
    const id = useId()
    const _id = useId()
    const _id2 = useId()
    const navigate = useNavigate()
    const reply = useRef(null)

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

    const handleClick = () => {
        if (!showTextarea) setShowTextarea(true)

        else setShowTextarea(false)
    }

    const submitReply = async (commentId) => {
        const value = document.getElementById(id).firstChild.firstChild.firstChild.value

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

            if (output.status = 'success') window.location.href = `?commentId=${commentId}&replyId=${replyId}`
        }
    }

    const handleLoad = () => {
        const queryString = window.location.search
        const urlParams = new URLSearchParams(queryString)
        const replyId = urlParams.get('replyId')

        if (replyId == props.reply._id) {
            reply.current.scrollIntoView({ block: 'center' })
            navigate(`/post/${props.postId}`, { replace: true })
        }
    }

    return (
        <div ref={reply} onLoad={handleLoad} id={props.reply._id} style={props.index ? { marginBottom: '40px' } : { marginBottom: '0px' }} className="max-[611px]:pr-7 flex mt-9 pl-7 pr-7">
            <img onClick={(e) => {
                e.stopPropagation()
                navigate(`/profile/${props.reply.user}`)
            }} className="max-[611px]:w-[45px] max-[611px]:h-[45px] cursor-pointer border-[2px] border-[#660eb3] w-[55px] h-[55px] rounded-[50%]" src={props.reply.profileImg == null ? ImageProfile : props.reply.profileImg} alt="" />

            <div className="ml-3 mt-[2px] w-full">
                <div className="flex max-[541px]:flex-col">
                    <p onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/profile/${props.reply.user}`)
                    }} className="max-[611px]:text-[15px] max-[468px]:mb-[2px] cursor-pointer mb-1 font-semibold max-w-[150px]">{props.reply.user}</p>

                    {!for541Width &&
                        <>
                            {'\u00A0'}

                            <p className="max-[611px]:text-[14px] text-[#cccccc] text-[15px]">· {props.reply.createdAt}</p>
                        </>
                    }

                    {for541Width &&
                        <p className="text-[#cccccc] text-[15px]">{props.reply.createdAt}</p>
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
                                            navigate(`/profile/${element.replace('@', '')}`)
                                        }} className="cursor-pointer text-[#660eb3] hover:underline">{element}</span>

                                        {'\u00A0'}
                                    </>
                                )

                            else return element + ' '
                        })
                    }
                </p>

                <div className="flex text-[20px] mt-3 items-center">
                    <div className="flex items-center cursor-pointer" onClick={(e) => {
                        e.stopPropagation()
                        handleLike('reply', props.reply._id)
                    }}>
                        <FontAwesomeIcon id={_id} style={props.reply.isLiked == true ? { color: '#660eb3' } : { color: 'white' }} className="mr-2" icon={icon} />
                        <p id={_id2} className="text-[16px]">{props.reply.likes}</p>
                    </div>

                    <p onClick={handleClick} className="ml-3 text-[15px] cursor-pointer">Responder</p>
                </div>

                {showTextarea &&
                    <div id={id} className="flex flex-col w-full mt-4 items-start">
                        <Textarea length={200} placeholder={'Postar resposta'} defaultValue={`@${props.reply.user}`} />

                        <div className="flex items-center max-[380px]:flex-col max-[380px]:w-full">
                            <p onClick={() => submitReply(props.commentId)} className="max-[380px]:w-full max-[380px]:mr-0 text-center text-[16px] font-semibold bg-[#660eb3] mt-5 pb-2 pt-2 pl-7 pr-7 mr-4 rounded-[15px] cursor-pointer">
                                Responder
                            </p>

                            <p onClick={() => setShowTextarea(false)} className="text-center text-[16px] font-semibold mt-5 rounded-[15px] cursor-pointer">
                                Cancelar
                            </p>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default Reply