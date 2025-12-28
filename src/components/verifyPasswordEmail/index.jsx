import Checked from '../../assets/1200px-Eo_circle_purple_white_checkmark.svg.png'
import Error from '../../assets/cancel-512.png'
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faLock } from "@fortawesome/free-solid-svg-icons"
import { faEye } from "@fortawesome/free-solid-svg-icons"
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons"
import { faExclamation } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from 'react-router-dom';

const VerifyPassword = () => {
    const [showPassword1, setShowPassword1] = useState(false)
    const [showPassword2, setShowPassword2] = useState(false)
    const [showLoading, setShowLoading] = useState(false)
    const [showError, setShowError] = useState(false)
    const [showInputs, setShowInputs] = useState(true)
    const navigate = useNavigate()

    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    const email = urlParams.get('email')
    const token = urlParams.get('token')

    const submitData = async (e) => {
        const event = e.key || e.type

        if(event == 'Enter' || event == 'click'){
            const password = document.getElementById('password').value
            const confirmPassword = document.getElementById('confirmPassword').value
            const inputs = document.getElementsByTagName('input')
            const errors = document.getElementsByClassName('error')
            var emptyCamps = 0

            for(let i = 0; i < inputs.length; i++){
                if(i < inputs.length) errors[i].classList.add('hidden')

                if(i < errors.length && inputs[i].value == '') emptyCamps++
            }

            if(emptyCamps == 0){
                if(password == confirmPassword){
                    setShowInputs(false)
                    setShowLoading(true)

                    const result = await fetch('http://localhost:3000/verifypassword', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify({ email: email, password: password, token: token })
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

                else errors[1].classList.remove('hidden')
            } 

            else errors[0].classList.remove('hidden')
        }
    }

    const handleFocus = (e) => {
        const labels = document.getElementsByTagName('label')
        const inputs = document.getElementsByTagName('input')
        const eyes = document.getElementsByClassName('eye')
        
        for(let i = 0; i < inputs.length; i++){
            if(e.target == inputs[i]){
                labels[i].style.border = 'solid 2px #660eb3'
                labels[i].style.borderRight = 'solid 0px #660eb3'
                eyes[i].style.border = 'solid 2px #660eb3'
                eyes[i].style.borderLeft = 'solid 0px #660eb3'
            }
        }
    }

    const handleBlur = (e) => {
        const labels = document.getElementsByTagName('label')
        const inputs = document.getElementsByTagName('input')
        const eyes = document.getElementsByClassName('eye')
        
        for(let i = 0; i < inputs.length; i++){
            if(e.target == inputs[i]){
                labels[i].style.border = '2px solid transparent'
                labels[i].style.borderRight = '0px solid transparent'
                eyes[i].style.border = '2px solid transparent'
                eyes[i].style.borderLeft = '0px solid transparent'
            }
        }
    }

    const hidePassword = (e) => {
        const openEyes = document.getElementsByClassName('openEye')
        const openEyeDivs = document.getElementsByClassName('openEyeDiv')
        const closedEyes = document.getElementsByClassName('closedEye')
        const closedEyeDivs = document.getElementsByClassName('closedEyeDiv')

        for(let i = 0; i < openEyes.length; i++){
            if(e.target == openEyes[i] || e.target.parentElement == openEyes[i]){
                openEyeDivs[i].classList.add('hidden')
                closedEyeDivs[i].classList.remove('hidden')

                if(i == 0) setShowPassword1(true)
                else setShowPassword2(true)
            }

            else if(e.target == closedEyes[i] || e.target.parentElement == closedEyes[i]){
                closedEyeDivs[i].classList.add('hidden')
                openEyeDivs[i].classList.remove('hidden')
                
                if(i == 0) setShowPassword1(false)
                else setShowPassword2(false)
            }
        }
    }

    return(
        <>
            {(!showLoading) &&
                <>
                    <div className="max-[531px]:bg-[#000000] flex flex-col items-center bg-[#0f0f0f] h-full justify-center">
                        {showInputs &&
                            <div className="max-[430px]:pr-5 max-[430px]:pl-5 max-[531px]:w-full text-center flex flex-col items-center justify-between bg-[#000000] rounded-[15px] pl-10 pr-10 text-[#FFFFFF]">
                                <div className="max-[430px]:m-8 text-[15px] flex flex-col items-center m-10 mb-14 mt-14 w-full">
                                    <h1 className="text-[20px] mb-6">Insira abaixo a nova senha</h1>

                                    <div className="error flex mb-5 items-center hidden">
                                        <div className="flex p-3 mr-2 bg-[#e30e2a] rounded-[50%] size-[15px] items-center justify-center">
                                            <FontAwesomeIcon icon={faExclamation} />
                                        </div>

                                        <p className="text-[#e30e2a]">Preencha todos os campos!</p>
                                    </div>

                                    <div className="error flex mb-5 items-center hidden">
                                        <div className="flex p-3 mr-2 bg-[#e30e2a] rounded-[50%] size-[15px] items-center justify-center">
                                            <FontAwesomeIcon icon={faExclamation} />
                                        </div>

                                        <p className="text-[#e30e2a]">As senhas devem ser iguais!</p>
                                    </div>
                                    
                                    <div className="flex w-full items-center mb-3">
                                        <label className="border-r-0 border-transparent border-2 pl-5 rounded-r-[0px] rounded-[7px] bg-[#0f0f0f] h-full flex items-center" htmlFor="password"><FontAwesomeIcon icon={faLock} /></label>
                                        <input onFocus={handleFocus} onBlur={handleBlur} className="focus:outline-2 focus:outline-offset-2 focus:outline-none border-l-0 border-r-0 border-transparent border-2 focus:border-b-[#660eb3] focus:border-t-[#660eb3] w-full bg-[#0f0f0f] pt-3 pb-3 pr-5 pl-3" type={showPassword1 ? 'text' : 'password'} placeholder="Senha" id="password"/>
                                        <div className="eye h-full border-l-0 border-transparent border-2 pr-5 rounded-l-[0px] rounded-[7px] bg-[#0f0f0f] flex items-center">
                                            <div className="openEyeDiv">
                                                <FontAwesomeIcon onClick={hidePassword} className="openEye cursor-pointer" icon={faEye}/>
                                            </div>
                                            
                                            <div className="closedEyeDiv hidden">
                                                <FontAwesomeIcon onClick={hidePassword} className="closedEye cursor-pointer" icon={faEyeSlash}/>
                                            </div>
                                        </div>
                                    </div>  

                                    <div className="flex w-full items-center mb-10">
                                        <label className="border-r-0 border-transparent border-2 pl-5 rounded-r-[0px] rounded-[7px] bg-[#0f0f0f] h-full flex items-center" htmlFor="confirmPassword"><FontAwesomeIcon icon={faLock} /></label>
                                        <input onFocus={handleFocus} onBlur={handleBlur} className="focus:outline-2 focus:outline-offset-2 focus:outline-none border-l-0 border-r-0 border-transparent border-2 focus:border-b-[#660eb3] focus:border-t-[#660eb3] w-full bg-[#0f0f0f] pt-3 pb-3 pr-5 pl-3" type={showPassword2 ? 'text' : 'password'} placeholder="Confirmar Senha" id="confirmPassword"/>
                                        <div className="eye h-full border-l-0 border-transparent border-2 pr-5 rounded-l-[0px] rounded-[7px] bg-[#0f0f0f] flex items-center">
                                            <div className="openEyeDiv">
                                                <FontAwesomeIcon onClick={hidePassword} className="openEye cursor-pointer" icon={faEye}/>
                                            </div>
                                            
                                            <div className="closedEyeDiv hidden">
                                                <FontAwesomeIcon onClick={hidePassword} className="closedEye cursor-pointer" icon={faEyeSlash}/>
                                            </div>
                                        </div>
                                    </div>

                                    <a onClick={submitData} className="text-[16px] font-semibold bg-[#660eb3] pb-3 pt-3 pl-12 pr-12 rounded-[20px] cursor-pointer">
                                        Alterar senha
                                    </a>
                                </div>
                            </div>
                        }

                        {(!showError && !showInputs) &&
                            <div className="max-[590px]:pr-8 max-[590px]:pl-8 max-[590px]:rounded-[0px] max-[590px]:w-full max-[590px]:h-full relative text-center flex flex-col items-center justify-center bg-[#000000] rounded-[15px] p-17 pb-14 pt-14 text-[#FFFFFF]">
                                <img className='max-[590px]:size-[180px] size-[200px]' src={Checked} alt="" />
                                                            
                                <div className="flex flex-col items-center">
                                    <h1 className="max-[590px]:text-[24px] text-[28px] mb-0 mt-6">Senha alterada!</h1>
                                    <h1 className="max-[590px]:text-[17px] text-[18px] mb-3 mt-3">Você será redirecionado para o login em breve.</h1>
                                </div>
                            </div>
                        }
                        
                        {(showError && !showInputs) &&
                            <div className="max-[590px]:pr-8 max-[590px]:pl-8 max-[590px]:rounded-[0px] max-[590px]:w-full max-[590px]:h-full relative text-center flex flex-col items-center justify-center bg-[#000000] rounded-[15px] p-17 pb-14 pt-14 text-[#FFFFFF]">
                                <img className='max-[590px]:size-[180px] size-[200px]' src={Error} alt="" />
                                                            
                                <div className="flex flex-col items-center">
                                    <h1 className="max-[590px]:text-[24px] text-[28px] mb-0 mt-6">Algo inesperado aconteceu...</h1>
                                    <h1 className="max-[590px]:text-[17px] text-[18px] mb-3 mt-3">Tente realizar a troca de senha novamente.</h1>
                                </div>
                            </div>
                        }
                    </div>    
                </>
            }

            {showLoading &&
                <div className="flex flex-col items-center bg-[#0f0f0f] h-full justify-center">
                    <div className="animate-spin inline-block size-20 border-5 border-current border-t-transparent text-[#660eb3] rounded-full dark:text-[#660eb3]" role="status" aria-label="loading">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>   
            }
        </>
    )
}

export default VerifyPassword