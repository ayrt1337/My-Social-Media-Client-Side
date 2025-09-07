import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import ImageProfile from '../../assets/981d6b2e0ccb5e968a0618c8d47671da.jpg'

const SearchInput = () => {
    const inputDiv = useRef(null)
    const [users, setUsers] = useState([])
    const [inputValue, setInputValue] = useState(null)
    const [results, showResults] = useState(false)
    const navigate = useNavigate()

    document.body.addEventListener('click', (e) => {
        if (!inputDiv.current.contains(e.target)) {
            if (showResults) showResults(false)
        }
    })

    const handleInput = async (e) => {
        if (e.target.value.length >= 2) {
            if(results == false) showResults(true)

            setInputValue(e.target.value)

            const result = await fetch(`http://localhost:3000/searchUsers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ value: e.target.value })
            })
            
            const output = await result.json()

            if (output.status == 'success') {
                setUsers(output.users)
            }
        }

        else {
            showResults(false)
        }
    }

    return (
        <div className="h-full bg-[#000000] text-[#ffffff] top-[0px] right-[0px] pl-[50px] pt-[45px] w-full">
            <div ref={inputDiv} onFocus={handleInput} className="fixed flex flex-col relative">
                <input onInput={handleInput} className="focus:outline-2 focus:outline-offset-2 focus:outline-none border-transparent border-2 rounded-[15px] focus:border-[#660eb3] max-w-[280px] w-full bg-[#0f0f0f] pt-3 pb-3 pr-5 pl-4" placeholder="Pesquisar" id="search" />

                {results &&
                    <div style={users.length > 5 ? { overflow: 'auto', height: '337px' } : { overflow: 'visible' }} id="result" className="absolute mt-17 bg-[#0f0f0f] max-w-[280px] w-full rounded-[15px]">
                        {
                            users.map((user, index) => {
                                return (
                                    <div style={index == 0 ? { borderTopLeftRadius: '15px', borderTopRightRadius: '15px' } : { borderTopLeftRadius: '0px', borderTopRightRadius: '0px' }} onClick={() => navigate(`/profile/${user.user}`)} className="hover:bg-[#30005bff] flex cursor-pointer items-center p-4 pb-3 pt-3" key={index}>
                                        <img className="w-[45px] h-[45px] rounded-[50%]" src={user.profileImg == null ? ImageProfile : user.profileImg} alt="" />

                                        <div className="flex flex-col ml-2">
                                            <p className="text-[15px]">{user.user}</p>
                                            <p className="text-[14px]">{user.bio.length >= 20 ? user.bio.substring(0, 17) + '...' : user.bio}</p>
                                        </div>
                                    </div>
                                )
                            })
                        }

                        <div onClick={() => navigate(`/profile/${inputRef.current.value}`)} className="cursor-pointer items-center p-4">
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