import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Image from '../../assets/online-user-sign-up-illustration-download-in-svg-png-gif-file-formats--account-login-registration-or-pack-interface-illustrations-3723272.webp'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEnvelope } from "@fortawesome/free-solid-svg-icons"
import { faLock } from "@fortawesome/free-solid-svg-icons"
import { faEye } from "@fortawesome/free-solid-svg-icons"
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons"
import { faExclamation } from "@fortawesome/free-solid-svg-icons"

const Register = () => {
    const [showPassword1, setShowPassword1] = useState(false)
    const [showPassword2, setShowPassword2] = useState(false)
    const navigate = useNavigate()

    const emailMask = (email) => {
        var re = /\S+@\S+\.\S+/
        return re.test(email)
    }

    const submitData = async (e) => {
        const event = e.key || e.type

        if(event == 'Enter' || event == 'click'){
            const email = document.getElementById('email').value
            const password = document.getElementById('password').value
            const confirmPassword = document.getElementById('confirmPassword').value
            const inputs = document.getElementsByTagName('input')
            const errors = document.getElementsByClassName('error')
            var emptyCamps = 0

            for(let i = 0; i <= inputs.length + 2; i++){
                if(i <= inputs.length + 2) errors[i].classList.add('hidden')

                if(i < errors.length - 4 && inputs[i].value == '') emptyCamps++
            }

            if(emptyCamps == 0){
                if(emailMask(email) && password == confirmPassword){
                    if(password.includes(' ')) errors[4].classList.remove('hidden')

                    else{
                        const result = await fetch('http://localhost:3000/confirmEmail', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Accept': 'application/json'
                            },
                            body: JSON.stringify({ email: email, password: password })
                        })

                        const output = await result.json()

                        if(output.status == 'success') navigate(`/confirmemail?email=${email}&password=${password}`)
                        
                        else errors[2].classList.remove('hidden')
                    }
                }

                else if(password != confirmPassword) errors[3].classList.remove('hidden')

                else if(password.includes('>') || password.includes('<')) errors[5].classList.remove('hidden')

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

                if(i == 1 || i == 2){
                    eyes[i - 1].style.border = 'solid 2px #660eb3'
                    eyes[i - 1].style.borderLeft = 'solid 0px #660eb3'
                }
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
                
                if(i == 1 || i == 2){
                    eyes[i - 1].style.border = '2px solid transparent'
                    eyes[i - 1].style.borderLeft = '0px solid transparent'
                }
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
            <div className="flex flex-col items-center bg-[#0f0f0f] h-full justify-center">
                <div className="text-center flex flex-col items-center justify-between bg-[#000000] rounded-[15px] pb-13 pl-10 pr-10 text-[#FFFFFF]">
                    <div className="flex flex-col items-center m-10 w-full text-[15px]">
                        <img src={Image} className="max-w-[350px]"></img>

                        <h1 className="font-bold text-[22px] mb-5">CADASTRAR</h1>

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

                            <p className="text-[#e30e2a]">Formato de email inválido!</p>
                        </div>

                        <div className="error flex mb-5 items-center hidden">
                            <div className="flex p-3 mr-2 bg-[#e30e2a] rounded-[50%] size-[15px] items-center justify-center">
                                <FontAwesomeIcon icon={faExclamation} />
                            </div>

                            <p className="text-[#e30e2a]">Email já cadastrado!</p>
                        </div>

                        <div className="error flex mb-5 items-center hidden">
                            <div className="flex p-3 mr-2 bg-[#e30e2a] rounded-[50%] size-[15px] items-center justify-center">
                                <FontAwesomeIcon icon={faExclamation} />
                            </div>

                            <p className="text-[#e30e2a]">As senhas devem ser iguais!</p>
                        </div>

                        <div className="error flex mb-5 items-center hidden">
                            <div className="flex p-3 mr-2 bg-[#e30e2a] rounded-[50%] size-[15px] items-center justify-center">
                                <FontAwesomeIcon icon={faExclamation} />
                            </div>

                            <p className="text-[#e30e2a]">Retire os espaços da senha!</p>
                        </div>

                        <div className="error flex mb-5 items-center hidden">
                            <div className="flex p-3 mr-2 bg-[#e30e2a] rounded-[50%] size-[15px] items-center justify-center">
                                <FontAwesomeIcon icon={faExclamation} />
                            </div>

                            <p className="text-[#e30e2a]">Caracteres proibidos!</p>
                        </div>

                        <div className="flex w-full items-center mb-3">
                            <label className="border-r-0 border-transparent border-2 pl-5 rounded-r-[0px] rounded-[7px] bg-[#0f0f0f] h-full flex items-center" htmlFor="email"><FontAwesomeIcon icon={faEnvelope} /></label>
                            <input onKeyDown={submitData} onFocus={handleFocus} onBlur={handleBlur} className="focus:outline-2 focus:outline-offset-2 focus:outline-none border-l-0 border-transparent border-2 focus:border-b-[#660eb3] focus:border-t-[#660eb3] focus:border-r-[#660eb3] w-full bg-[#0f0f0f] rounded-l-[0px] rounded-[7px] pt-3 pb-3 pr-5 pl-3" type="text" placeholder="Email" id="email"/>
                        </div>
                        
                        <div className="flex w-full items-center mb-3">
                            <label className="border-r-0 border-transparent border-2 pl-5 rounded-r-[0px] rounded-[7px] bg-[#0f0f0f] h-full flex items-center" htmlFor="password"><FontAwesomeIcon icon={faLock} /></label>
                            <input onKeyDown={submitData} onFocus={handleFocus} onBlur={handleBlur} className="focus:outline-2 focus:outline-offset-2 focus:outline-none border-l-0 border-r-0 border-transparent border-2 focus:border-b-[#660eb3] focus:border-t-[#660eb3] w-full bg-[#0f0f0f] pt-3 pb-3 pr-5 pl-3" type={showPassword1 ? 'text' : 'password'} placeholder="Senha" id="password"/>
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
                            <input onKeyDown={submitData} onFocus={handleFocus} onBlur={handleBlur} className="focus:outline-2 focus:outline-offset-2 focus:outline-none border-l-0 border-r-0 border-transparent border-2 focus:border-b-[#660eb3] focus:border-t-[#660eb3] w-full bg-[#0f0f0f] pt-3 pb-3 pr-5 pl-3" type={showPassword2 ? 'text' : 'password'} placeholder="Confirmar Senha" id="confirmPassword"/>
                            <div className="eye h-full border-l-0 border-transparent border-2 pr-5 rounded-l-[0px] rounded-[7px] bg-[#0f0f0f] flex items-center">
                                <div className="openEyeDiv">
                                    <FontAwesomeIcon onClick={hidePassword} className="openEye cursor-pointer" icon={faEye}/>
                                </div>
                                
                                <div className="closedEyeDiv hidden">
                                    <FontAwesomeIcon onClick={hidePassword} className="closedEye cursor-pointer" icon={faEyeSlash}/>
                                </div>
                            </div>
                        </div>

                        <a onClick={submitData} className="font-semibold text-[16px] bg-[#660eb3] pb-4 pt-4 pl-25 pr-25 rounded-[20px] cursor-pointer">
                            Cadastrar
                        </a>
                    </div>

                    <p>Já possui uma conta?&nbsp;
                        <Link to='/login' className="cursor-pointer text-[#660eb3] underline">Faça o Login!</Link>
                    </p>
                </div>
            </div>
        </>
    )
}

export default Register