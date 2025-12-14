import Mentions from 'rc-mentions'
import './textareaProfile.less'
import { useState } from 'react'
import ImageProfile from '../../assets/981d6b2e0ccb5e968a0618c8d47671da.jpg'

const { Option } = Mentions
let timeout
let controller

const TextareaProfile = props => {
    const [users, setUsers] = useState([])
    const [result, setResult] = useState(false)
    const [stringBio, setStringBio] = useState(props.bioLength)
    const [mentions, setMentions] = useState([])

    const loading =
        <div className="flex flex-col items-center bg-[#0f0f0f] h-full justify-center">
            <div className="animate-spin inline-block size-5 border-5 border-current border-t-transparent text-[#660eb3] rounded-full dark:text-[#660eb3]" role="status" aria-label="loading">
                <span className="sr-only">Loading...</span>
            </div>
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

    const handleInput = (e) => {
        const length = e.target.value.length
        setStringBio(length)

        if(length > props.length) document.getElementById('stringLength').style.color = 'red'

        else document.getElementById('stringLength').style.color = 'white'
    }

    const handleChange = async (search) => {
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

    return(
        <>
            <label className="flex justify-between w-full border-transparent border-2 border-b-0 bg-[#0f0f0f] rounded-t-[10px] pr-[15px] pl-[15px] pt-3" htmlFor="bio-form">
                <p>Bio</p>
                <p id='stringLength'>{stringBio} / {props.length}</p>
            </label>

            <Mentions dropdownClassName="profile-mentions-dropdown" getPopupContainer={() => document.body} defaultValue={props.value} id='bio-form' notFoundContent={loading} onInput={handleInput} onBlur={handleBlur} onFocus={handleFocus} onChange={handleChange} className='profile w-full resize-none bg-[#0f0f0f]'>
                {result &&
                    <>
                        {   
                            users.map((element, index) => {
                                return(
                                    <Option value={element.user} onClick={() => navigate(`/profile/${element.user}`)} className="bg-[#0f0f0f] w-full flex cursor-pointer items-center text-[#ffffff]" key={index}>
                                        <img className="w-[45px] h-[45px] rounded-[50%]" src={element.profileImg == null ? ImageProfile : element.profileImg} alt=""/>

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
        </>
    )
}

export default TextareaProfile