import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState, useId } from 'react'
import { useNavigate } from 'react-router-dom'
import ImageProfile from '../../assets/981d6b2e0ccb5e968a0618c8d47671da.jpg'
import { useMediaQuery } from 'react-responsive'

library.add(fas, far, fab)

const Posts = props => {
    const for380Width = useMediaQuery({ query: '(max-width: 380px)' })

    const [icon, setIcon] = useState(props.post.isLiked == true ? 'fa-solid fa-heart' : 'fa-regular fa-heart')
    const words = props.post.text.split(' ')
    const _id = useId()
    const _id2 = useId()
    const navigate = useNavigate()

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
        if(props.reply == undefined) navigate(`/post/${props.post._id}`)

        else navigate(`/post/${props.post.postId}?commentId=${props.post.commentId}&replyId=${props.post._id}`)
    }

    return (
        <div onClick={handleClick} className="cursor-pointer flex w-auto wrap-anywhere p-7 border-[#808080] border-1 border-t-0 border-l-0 border-r-0">
            <img onClick={(e) => {
                e.stopPropagation()
                navigate(`/profile/${props.post.user}`)
            }} className="max-[500px]:h-[45px] max-[500px]:w-[45px] border-[2px] border-[#660eb3] w-[55px] h-[55px] rounded-[50%]" src={props.post.profileImg == null ? ImageProfile : props.post.profileImg} alt="" />

            <div className="ml-3 mt-[2px]">
                <div className="flex max-[380px]:flex-col">
                    <p onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/profile/${props.post.user}`)
                    }} className="max-[380px]:mb-[2px] mb-1 font-semibold max-w-[150px] max-[500px]:text-[15px]">{props.post.user}</p>                    

                    {!for380Width &&
                        <>
                            {'\u00A0'}
                        
                            <p className="text-[#cccccc] text-[15px] max-[500px]:text-[14px]">· {props.post.createdAt}</p>
                        </>
                    }

                    {for380Width &&
                        <p className="mb-2 text-[#cccccc] text-[15px] max-[500px]:text-[14px]">{props.post.createdAt}</p>
                    }
                </div>

                <p className='max-[500px]:text-[15px]'>
                    {
                        words.map((element) => {
                            if (element.includes('@'))
                                return (
                                    <>
                                        <span onClick={(e) => {
                                            e.stopPropagation()
                                            if(element.replace('@', '') == props.user && props.profile == true) window.scrollTo({ top: 0 })
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
                    {props.reply == undefined &&
                        <>
                            <FontAwesomeIcon className="mr-2" icon='fa-regular fa-comment' />
                            <p className="text-[16px]">{props.post.comments}</p>
                        </>
                    }

                    <div style={props.reply == true ? { marginLeft: '0px' } : { marginLeft: '20px' }} className="flex items-center" onClick={(e) => {
                        e.stopPropagation()
                        handleLike(props.reply != true ? 'post' : 'reply', props.post._id, props.userId, e)
                    }}>
                        <FontAwesomeIcon id={_id} style={props.post.isLiked == true ? { color: '#660eb3' } : { color: 'white' }} className="mr-2" icon={icon} />
                        <p id={_id2} className="text-[16px]">{props.post.likes}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Posts