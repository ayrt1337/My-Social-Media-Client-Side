import Mentions from 'rc-mentions'
import './textareaHome.less'
import { useState, useId } from 'react'
import ImageProfile from '../../assets/981d6b2e0ccb5e968a0618c8d47671da.jpg'

const { Option } = Mentions
let timeout
let controller

const Textarea = props => {
    const [users, setUsers] = useState([])
    const [result, setResult] = useState(false)
    const [stringPost, setStringPost] = useState(0)
    const [mentions, setMentions] = useState([])
    const id = useId()
    const id2 = useId()

    const loading =
        <div className="flex flex-col items-center bg-[#0f0f0f] h-full justify-center">
            <div className="animate-spin inline-block size-5 border-5 border-current border-t-transparent text-[#660eb3] rounded-full dark:text-[#660eb3]" role="status" aria-label="loading">
                <span className="sr-only">Loading...</span>
            </div>
        </div>

    const handleFocus = (e) => {
        const labels = document.getElementsByTagName('label')
        const textareas = []

        document.querySelectorAll('.rc-mentions').forEach((element) => {
            textareas.push(element.children.item(0))
        })

        const index = textareas.indexOf(e.target)

        labels[index].style.border = 'solid 2px #660eb3'
        labels[index].style.borderTop = 'solid 0px #660eb3'
    }

    const handleBlur = (e) => {
        const labels = document.getElementsByTagName('label')
        const textareas = []

        document.querySelectorAll('.rc-mentions').forEach((element) => {
            textareas.push(element.children.item(0))
        })

        const index = textareas.indexOf(e.target)

        labels[index].style.border = '2px solid transparent'
        labels[index].style.borderTop = '0px solid transparent'
    }

    const handleInput = (e) => {
        const length = e.target.value.length
        const label = document.getElementById(id2)

        setStringPost(length)

        if (length > props.length) label.style.color = 'red'

        else label.style.color = 'white'
    }

    const handleChange = (search) => {
        const regex = /@[^\s]+/g
        const searchMentions = search.match(regex)

        if (result) {
            setResult(false)
            setUsers([])
        }

        if (searchMentions != null) {
            clearTimeout(timeout)
            timeout = setTimeout(async () => {
                for (let i = 0; i < searchMentions.length; i++) {
                    if (searchMentions[i] != mentions[i] || (searchMentions[i] == mentions[i] && searchMentions[i].length == 4)) {
                        if (searchMentions[i].length > 3) {
                            if (controller) {
                                controller.abort()
                            }

                            controller = new AbortController()
                            const signal = controller.signal

                            const result = await fetch('http://localhost:3000/searchUsers', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Accept': 'application/json'
                                },
                                signal,
                                body: JSON.stringify({ value: searchMentions[i].replace('@', '') })
                            })

                            const output = await result.json()
                            controller = null

                            if (output.status == 'success') {
                                setUsers(output.users)
                                setResult(true)
                            }

                            setMentions(searchMentions)

                            break
                        }

                        else {
                            if (result) {
                                setResult(false)
                                setUsers([])
                            }
                        }
                    }

                    else if (searchMentions[i] == mentions[i] && i == searchMentions.length - 1) {
                        if (result) {
                            setResult(false)
                            setUsers([])
                        }
                    }
                }
            }, 1000)
        }
    }

    return (
        <div id={props.id} className='flex flex-col w-full'>
            <Mentions id={id} defaultValue={props.defaultValue != undefined ? props.defaultValue : null} placeholder={props.placeholder} autoSize={true} notFoundContent={loading} onInput={handleInput} onBlur={handleBlur} onFocus={handleFocus} onChange={handleChange} className='post-form w-full resize-none bg-[#0f0f0f]'>
                {result &&
                    <>
                        {
                            users.map((element, index) => {
                                return (
                                    <Option value={element.user} onClick={() => navigate(`/profile/${element.user}`)} className="bg-[#0f0f0f] w-full flex cursor-pointer items-center text-[#ffffff]" key={index}>
                                        <img className="w-[45px] h-[45px] rounded-[50%]" src={element.profileImg == null ? ImageProfile : element.profileImg} alt="" />

                                        <div className="flex flex-col ml-2">
                                            <p className="text-[15px]">{element.user}</p>
                                            <p className="text-[14px]">{element.bio.length >= 20 ? element.bio.substring(0, 17) + '...' : element.bio}</p>
                                        </div>
                                    </Option>
                                )
                            })
                        }
                    </>
                }
            </Mentions>

            <label id={id2} className="w-full text-end border-transparent border-2 border-t-0 bg-[#0f0f0f] rounded-b-[10px] pr-3 pl-3 pt-2 pb-2" htmlFor={id}>{stringPost} / {props.length}</label>
        </div>
    )
}

export default Textarea