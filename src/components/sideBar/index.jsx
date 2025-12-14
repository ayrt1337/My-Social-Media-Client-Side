import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHome } from "@fortawesome/free-solid-svg-icons"
import { faSignOut } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from "react-router-dom"
import { faBell, faSearch } from "@fortawesome/free-solid-svg-icons"
import { useMediaQuery } from "react-responsive"
import { useState } from "react"

const SideBar = props => {
    const navigate = useNavigate()

    const logout = async () => {
        const result = await fetch('http://localhost:3000/logout', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include'
        })

        const output = await result.json()

        if(output.status == 'success') navigate('/login')
    }

    return(
        <div className="flex flex-col items-end h-full bg-[#000000] text-[#ffffff] pr-[85px] pt-[60px]">
            <div className="flex flex-col fixed">
                <div onClick={() => navigate(`/profile/${props.user}`)} className="text-[16px] cursor-pointer flex items-center mb-[60px]">
                    <img className="w-[40px] h-[40px] rounded-[50%] border-[2px] border-[#660eb3]" src={props.img} alt=""/>
                    <p className="ml-3">{props.user}</p>
                </div>
        
                <div onClick={() => navigate('/home')} className="cursor-pointer flex items-center mb-[30px]">
                    <FontAwesomeIcon className="text-[23px]" icon={faHome}/>
                    <p className="ml-[15px] text-[20px]">Home</p>
                </div>

                <div className="cursor-pointer flex items-center mb-[30px]">
                    <FontAwesomeIcon className="text-[23px]" icon={faSearch}/>
                    <p className="ml-[15px] text-[20px]">Pesquisar</p>
                </div>

                <div onClick={() => navigate('/notifications')} className="cursor-pointer flex items-center mb-[30px]">
                    <div className="flex items-center relative">
                        <FontAwesomeIcon className="text-[25px]" icon={faBell}/>
                        
                        {props.unreadMessages > 0 &&
                            <div className="flex items-center justify-center absolute bg-[#660eb3] p-1 rounded-[50%] w-[20px] h-[20px] left-[8px] top-[-5px]">
                                <p className="text-[13px] text-center">{props.unreadMessages}</p>
                            </div>
                        }
                    </div>
                    
                    <p className="ml-[15px] text-[20px]">Notificações</p>
                </div>
        
                <div onClick={logout} className="flex items-center cursor-pointer">
                    <FontAwesomeIcon className="text-[23px]" icon={faSignOut}/>
                    <p className="ml-[15px] text-[20px]">Sair</p>
                </div>
            </div>
        </div>
    )   
}

export default SideBar