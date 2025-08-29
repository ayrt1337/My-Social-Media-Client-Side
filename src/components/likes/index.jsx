import { useState, useId } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useNavigate } from "react-router-dom"

const Likes = props => {
    const words = props.likes.text.split(' ')
    const [icon, setIcon] = useState(props.likes.isLiked == true ? 'fa-solid fa-heart' : 'fa-regular fa-heart')
    const _id = useId()
    const _id2 = useId()
    const navigate = useNavigate()
    let type

    if(props.likes.postId == undefined && props.likes.commentId == undefined) type = 'post'
    else if(props.likes.postId != undefined && props.likes.commentId == undefined) type = 'comment'
    else type = 'reply'

    const handleClick = () => {
        if(type == 'post') navigate(`/post/${props.likes._id}`)
        else if(type == 'comment') navigate(`/post/${props.likes.postId}?commentId=${props.likes._id}`)
        else navigate(`/post/${props.likes.postId}?commentId=${props.likes.commentId}&replyId=${props.likes._id}`)
    }

    const handleLike = async (id, userId) => {
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
            body: JSON.stringify({ type: type, id: id, action: action, userId: userId })
        })
    }

    return (
        <div onClick={handleClick} className="cursor-pointer flex w-auto wrap-anywhere p-7 border-[#808080] border-1 border-t-0 border-l-0 border-r-0">
            <img onClick={(e) => {
                e.stopPropagation()
                navigate(`/profile/${props.likes.user}`)
            }} className="border-[2px] border-[#660eb3] w-[55px] h-[55px] rounded-[50%]" src={props.likes.profileImg} alt="" />

            <div className="ml-3 mt-[2px]">
                <div className="flex">
                    <p onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/profile/${element.user}`)
                    }} className="mb-1 font-semibold max-w-[150px]">{props.likes.user}</p>

                    {'\u00A0'}

                    <p className="text-[#cccccc] text-[15px]">· {props.likes.createdAt}</p>
                </div>

                <p>
                    {
                        words.map((element) => {
                            if (element.includes('@'))
                                return (
                                    <>
                                        <span onClick={(e) => {
                                            e.stopPropagation()
                                            if(element.replace('@', '') == props.user) window.scrollTo({ top: 0 })
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
                    {props.likes.comments != undefined &&
                        <>
                            <FontAwesomeIcon className="mr-2" icon='fa-regular fa-comment' />
                            <p className="text-[16px]">{props.likes.comments}</p>
                        </>
                    }

                    <div style={props.likes.comments == undefined ? { marginLeft: '0px' } : { marginLeft: '20px' }} className="flex items-center" onClick={(e) => {
                        e.stopPropagation()
                        handleLike(props.likes._id, props.userId)
                    }}>
                        <FontAwesomeIcon id={_id} style={props.likes.isLiked == true ? { color: '#660eb3' } : { color: 'white' }} className="mr-2" icon={icon} />
                        <p id={_id2} className="text-[16px]">{props.likes.likes}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Likes