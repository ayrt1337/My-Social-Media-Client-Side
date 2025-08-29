import Checked from '../../assets/1200px-Eo_circle_purple_white_checkmark.svg.png'
import Error from '../../assets/cancel-512.png'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const VerifyEmail = () => {
    const [showLoading, setShowLoading] = useState(true)
    const [showError, setShowError] = useState(false)
    const navigate = useNavigate()

    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    const email = urlParams.get('email')
    const token = urlParams.get('token')

    useEffect(() => {
        const verifyToken = async () => {
            const result = await fetch(`http://localhost:3000/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ 'email': email, 'token': token })
            })

            const output = await result.json()

            if(output.status == 'success'){
                setShowLoading(false)

                setTimeout(() => {
                    navigate('/login')
                }, 2000)
            }

            else{
                setShowLoading(false)
                setShowError(true)
            }
        }

        verifyToken()
    }, [])

    return(
        <>
            {showLoading &&
                <div className="flex flex-col items-center bg-[#0f0f0f] h-full justify-center">
                    <div className="animate-spin inline-block size-20 border-5 border-current border-t-transparent text-[#660eb3] rounded-full dark:text-[#660eb3]" role="status" aria-label="loading">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>    
            }

            {!showLoading &&
                <div className="flex flex-col items-center bg-[#0f0f0f] h-full justify-center">
                    {!showError &&
                        <div className="relative text-center flex flex-col items-center justify-between bg-[#000000] rounded-[15px] p-12 text-[#FFFFFF]">
                            <img className='size-[230px] h-full' src={Checked} alt="" />
                                    
                            <div className="flex flex-col items-center">
                                <h1 className="text-[35px] mb-0 mt-3">Conta cadastrada!</h1>
                                <h1 className="text-[20px] mb-3 mt-3">Você será redirecionado para o login em breve.</h1>
                            </div>
                        </div>
                    }

                    {showError &&
                        <div className="relative text-center flex flex-col items-center justify-between bg-[#000000] rounded-[15px] p-12 text-[#FFFFFF]">
                            <img className='size-[230px] h-full' src={Error} alt="" />
                                    
                            <div className="flex flex-col items-center">
                                <h1 className="text-[35px] mb-0 mt-3">Algo inesperado aconteceu...</h1>
                                <h1 className="text-[20px] mb-3 mt-3">Tente realizar o cadastro novamente.</h1>
                            </div>
                        </div>
                    }
                </div>
            }
        </>
    )
}

export default VerifyEmail