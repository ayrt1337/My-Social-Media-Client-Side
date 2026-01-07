import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHome } from "@fortawesome/free-solid-svg-icons"
import { faSignOut } from "@fortawesome/free-solid-svg-icons"
import { useLocation, useNavigate } from "react-router-dom"
import { faBell, faSearch } from "@fortawesome/free-solid-svg-icons"
import { useMediaQuery } from "react-responsive"

const SideBar = props => {
    const for1300Width = useMediaQuery({ query: '(max-width: 1300px)' })
    const navigate = useNavigate()
    const location = useLocation()

    const logout = async () => {
        props.setShowLoadingLogout(true)

        const result = await fetch('http://localhost:3000/logout', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include'
        })

        const output = await result.json()

        if (output.status == 'success') navigate('/login')
    }

    return (
        <div className="max-[500px]:z-9 max-[500px]:m-0 max-[500px]:p-0 max-[600px]:pr-[20px] max-[1300px]:pr-[30px] flex flex-col items-end h-full bg-[#000000] text-[#ffffff] pr-[85px] pt-[50px]">
            <div className="max-[370px]:pl-7 max-[370px]:pr-8 max-[500px]:bg-[#000000] max-[500px]:flex-row max-[500px]:justify-between max-[500px]:pb-3 max-[500px]:pr-10 max-[500px]:pt-3 max-[500px]:border-t-1 max-[500px]:border-[#808080] max-[500px]:pl-9 max-[500px]:w-[100vw] flex flex-col fixed max-[500px]:bottom-[0px]">
                <div onClick={() => {if(location.pathname != `/profile/${props.user}`) navigate(`/profile/${props.user}`)}} className="max-[500px]:m-0 text-[16px] cursor-pointer flex items-center mb-[60px]">
                    <img className="max-[500px]:w-[40px] max-[500px]:h-[40px] w-[50px] h-[50px] rounded-[50%] border-[2px] border-[#660eb3]" src={props.img} alt="" />
                    
                    {!for1300Width &&
                        <p className="ml-3">{props.user}</p>
                    }
                </div>

                <div onClick={() => {if(location.pathname != `/home`) navigate('/home')}} className="max-[500px]:m-0 max-[1300px]:justify-center cursor-pointer flex items-center mb-[30px]">
                    <FontAwesomeIcon className="text-[23px]" icon={faHome} />

                    {!for1300Width &&
                        <p className="ml-[15px] text-[20px]">Home</p>
                    }
                </div>

                <div onClick={() => props.setShowSearch(true)} className="max-[500px]:m-0 max-[1300px]:justify-center cursor-pointer flex items-center mb-[30px]">
                    <FontAwesomeIcon className="text-[23px]" icon={faSearch} />

                    {!for1300Width &&
                        <p className="ml-[15px] text-[20px]">Pesquisar</p>
                    }
                </div>

                <div onClick={() => {if(location.pathname != `/notifications`) navigate(`/notifications`)}} className="max-[500px]:m-0 max-[1300px]:justify-center cursor-pointer flex items-center mb-[30px]">
                    <div className="flex items-center relative">
                        <FontAwesomeIcon className="text-[25px]" icon={faBell} />

                        {props.unreadMessages > 0 &&
                            <div className="flex items-center justify-center absolute bg-[#660eb3] p-1 rounded-[50%] w-[20px] h-[20px] left-[8px] top-[-5px]">
                                <p className="text-[13px] text-center">{props.unreadMessages}</p>
                            </div>
                        }
                    </div>

                    {!for1300Width &&
                        <p className="ml-[15px] text-[20px]">Notificações</p>
                    }
                </div>

                <div onClick={logout} className="max-[1300px]:justify-center flex items-center cursor-pointer">
                    <FontAwesomeIcon className="text-[23px]" icon={faSignOut} />

                    {!for1300Width &&
                        <p className="ml-[15px] text-[20px]">Sair</p>
                    }
                </div>
            </div>
        </div>
    )
}

export default SideBar