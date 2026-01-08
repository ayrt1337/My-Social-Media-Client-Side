import { useState, useId } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useNavigate } from "react-router-dom"
import ImageProfile from '../../assets/981d6b2e0ccb5e968a0618c8d47671da.jpg'
import { useMediaQuery } from "react-responsive"

const Likes = props => {
    const for386Width = useMediaQuery({ query: '(max-width: 386px)' })

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

    const handleLike = async (id) => {
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

    return (
        <div onClick={handleClick} className="cursor-pointer flex w-auto wrap-anywhere p-7 border-[#808080] border-1 border-t-0 border-l-0 border-r-0">
            <img onClick={(e) => {
                e.stopPropagation()
                if (props.likes.user == props.user && props.profile == true) window.scrollTo({ top: 0 })
                else navigate(`/profile/${props.likes.user}`)
            }} className="max-[510px]:size-[45px] border-[2px] border-[#660eb3] size-[55px] rounded-[50%]" src={props.likes.profileImg == null ? ImageProfile : props.likes.profileImg} alt="" />

            <div className="ml-3 mt-[2px]">
                <div className="max-[387px]:flex-col flex">
                    <p onClick={(e) => {
                        e.stopPropagation()
                        if (props.likes.user == props.user && props.profile == true) window.scrollTo({ top: 0 })
                        else navigate(`/profile/${props.likes.user}`)
                    }} className="max-[387px]:mb-[2px] max-[510px]:text-[15px] mb-1 font-semibold max-w-[150px]">{props.likes.user}</p>

                    {!for386Width &&
                        <>
                            {'\u00A0'}
                        
                            <p className="text-[#cccccc] text-[15px] max-[510px]:text-[14px]">· {props.likes.createdAt}</p>
                        </>
                    }

                    {for386Width &&
                        <p className="mb-2 text-[#cccccc] text-[14px]">{props.likes.createdAt}</p>
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
                        handleLike(props.likes._id)
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