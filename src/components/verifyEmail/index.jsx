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

            if (output.status == 'success') {
                setShowLoading(false)

                setTimeout(() => {
                    navigate('/login')
                }, 2000)
            }

            else {
                setShowLoading(false)
                setShowError(true)
            }
        }

        verifyToken()
    }, [])

    return (
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
                        <div className="max-[590px]:pr-8 max-[590px]:pl-8 max-[590px]:rounded-[0px] max-[590px]:w-full max-[590px]:h-full relative text-center flex flex-col items-center justify-center bg-[#000000] rounded-[15px] p-17 pb-14 pt-14 text-[#FFFFFF]">
                            <img className='max-[590px]:size-[180px] size-[200px]' src={Checked} alt="" />

                            <div className="flex flex-col items-center">
                                <h1 className="max-[590px]:text-[24px] text-[28px] mb-0 mt-6">Conta Cadastrada!</h1>
                                <h1 className="max-[590px]:text-[17px] text-[18px] mb-3 mt-3">Você será redirecionado para o login em breve.</h1>
                            </div>
                        </div>
                    }

                    {showError &&
                        <div className="max-[590px]:pr-8 max-[590px]:pl-8 max-[590px]:rounded-[0px] max-[590px]:w-full max-[590px]:h-full relative text-center flex flex-col items-center justify-center bg-[#000000] rounded-[15px] p-17 pb-14 pt-14 text-[#FFFFFF]">
                            <img className='max-[590px]:size-[180px] size-[200px]' src={Error} alt="" />

                            <div className="flex flex-col items-center">
                                <h1 className="max-[590px]:text-[24px] text-[28px] mb-0 mt-6">Algo inesperado aconteceu...</h1>
                                <h1 className="max-[590px]:text-[17px] text-[18px] mb-3 mt-3">Tente realizar o cadastro novamente.</h1>
                            </div>
                        </div>
                    }
                </div>
            }
        </>
    )
}

export default VerifyEmail