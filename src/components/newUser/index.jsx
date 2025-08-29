import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faExclamation } from "@fortawesome/free-solid-svg-icons"
import { faUser } from "@fortawesome/free-regular-svg-icons"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

const NewUser = () => {
    const [user, setUser] = useState(null)
    const [showTerms, setShowTerms] = useState(false)
    const [showLoading, setShowLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const getSession = async () => {
            const result = await fetch('http://localhost:3000/session', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include'
            })

            const output = await result.json()

            if(output.user != undefined){
                if(output.user != ''){
                    navigate('/home')
                }

                else setShowLoading(false)  
            }

            else{
                window.alert('Você não possui sessão')
                navigate('/login')
            }
        }

        getSession()
    }, [])

    const verifyUser = async (e) => {
        const inputUser = document.getElementById('user').value
        const event = e.key || e.type
        const errors = document.getElementsByClassName('error')

        if(event == 'Enter' || event == 'click'){
            for(let i = 0; i < errors.length; i++){
                errors[i].classList.remove('hidden')
                errors[i].classList.add('hidden')
            }

            if(inputUser != ''){
                if(inputUser.includes(' ')) errors[2].classList.remove('hidden')
                
                else if(inputUser.length > 15) errors[3].classList.remove('hidden')

                else if(inputUser.length < 3) errors[4].classList.remove('hidden')

                else{   
                    const result = await fetch('http://localhost:3000/verifyUser', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify({ user: inputUser })
                    })

                    const output = await result.json()

                    if(output.status == 'fail') errors[1].classList.remove('hidden')

                    else{
                        setUser(inputUser) 
                        setShowTerms(true)
                    }
                }
            }

            else errors[0].classList.remove('hidden')
        }
    }

    const updateUser = async (e) => {
        const event = e.key || e.type

        if(event == 'Enter' || event == 'click'){
            const result = await fetch('http://localhost:3000/updateUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ user: user })
            })

            const output = await result.json()
            
            if(output.status == 'success') navigate('/home')
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

                if(i == 1){
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
                <>
                    {!showTerms &&
                        <div className="flex flex-col items-center bg-[#0f0f0f] h-full justify-center">
                            <div className="text-[15px] flex flex-col items-center justify-between bg-[#000000] rounded-[15px] pr-5 pl-5 pt-18 pb-14 text-[#FFFFFF]">
                                <div className="flex flex-col items-center w-full">
                                    <div className="relative text-center flex flex-col items-center justify-between bg-[#000000] rounded-[15px] pl-12 pr-12 pb-10 text-[#FFFFFF] w-[500px]">
                                        <div className="flex flex-col items-center">
                                            <h1 className="text-[30px]">Como você quer que os outros te chamem?</h1>
                                        </div>
                                    </div>

                                    <div className="error flex mb-7 items-center hidden">
                                        <div className="flex p-3 mr-2 bg-[#e30e2a] rounded-[50%] size-[15px] items-center justify-center">
                                            <FontAwesomeIcon icon={faExclamation} />
                                        </div>
                                    
                                        <p className="text-[#e30e2a]">Insira o usuário!</p>
                                    </div>

                                    <div className="error flex mb-7 items-center hidden">
                                        <div className="flex p-3 mr-2 bg-[#e30e2a] rounded-[50%] size-[15px] items-center justify-center">
                                            <FontAwesomeIcon icon={faExclamation} />
                                        </div>
                                    
                                        <p className="text-[#e30e2a]">Usuário já cadastrado!</p>
                                    </div>

                                    <div className="error flex mb-5 items-center hidden">
                                        <div className="flex p-3 mr-2 bg-[#e30e2a] rounded-[50%] size-[15px] items-center justify-center">
                                            <FontAwesomeIcon icon={faExclamation} />
                                        </div>
                                    
                                        <p className="text-[#e30e2a]">Retire os espaços!</p>
                                    </div>

                                    <div className="error flex mb-5 items-center hidden">
                                        <div className="flex p-3 mr-2 bg-[#e30e2a] rounded-[50%] size-[15px] items-center justify-center">
                                            <FontAwesomeIcon icon={faExclamation} />
                                        </div>
                                    
                                        <p className="text-[#e30e2a]">Usuário muito longo!</p>
                                    </div>

                                    <div className="error flex mb-5 items-center hidden">
                                        <div className="flex p-3 mr-2 bg-[#e30e2a] rounded-[50%] size-[15px] items-center justify-center">
                                            <FontAwesomeIcon icon={faExclamation} />
                                        </div>
                                    
                                        <p className="text-[#e30e2a]">Usuário muito curto!</p>
                                    </div>

                                    <div className="flex w-auto flex-col">
                                        <div className="flex w-full items-center text-center justify-center mb-3">
                                            <label className="border-r-0 border-transparent border-2 pl-5 rounded-r-[0px] rounded-[7px] bg-[#0f0f0f] h-full flex items-center" htmlFor="user"><FontAwesomeIcon icon={faUser} /></label>
                                            <input onKeyDown={verifyUser} onFocus={handleFocus} onBlur={handleBlur} className="focus:outline-2 focus:outline-offset-2 focus:outline-none border-l-0 border-transparent border-2 focus:border-b-[#660eb3] focus:border-t-[#660eb3] focus:border-r-[#660eb3] w-[400px] bg-[#0f0f0f] rounded-l-[0px] rounded-[7px] pt-3 pb-3 pr-5 pl-3" type="text" placeholder="Usuário" id="user"/>
                                        </div>

                                        <div className="ml-[5px] w-[430px] mt-[10px]">
                                            <h1>Lembre-se:</h1>

                                            <ul className="list-disc ml-[20px] mt-[15px]">
                                                <li>
                                                    O usuário deve ser único;
                                                </li>

                                                <li>
                                                    Outras pessoas poderão visualizar;
                                                </li>

                                                <li>
                                                    Não deve ser ofensivo;
                                                </li>

                                                <li>
                                                    Você poderá alterar depois;
                                                </li>

                                                <li>
                                                    Não pode haver espaços;
                                                </li>

                                                <li>
                                                    Não pode ter mais de 15 caracteres.
                                                </li>

                                                <li>
                                                    Não pode ter menos de 3 caracteres.
                                                </li>
                                            </ul>
                                        </div>
                                    </div>

                                    <a onClick={verifyUser} className="font-semibold text-[16px] bg-[#660eb3] pb-4 pt-4 pl-20 pr-20 mb-5 mt-10 rounded-[20px] cursor-pointer">
                                        Continuar
                                    </a>
                                </div>
                            </div>
                        </div>            
                    }

                    {showTerms &&
                        <div className="flex flex-col items-center bg-[#0f0f0f] h-full justify-center">
                            <div className="w-[600px] text-center text-[20px] flex flex-col items-center justify-between bg-[#000000] rounded-[15px] pr-15 pl-15 pt-18 pb-14 text-[#FFFFFF]">
                                <p>Este website foi criado apenas com o propósito de ser adicionado a um portfólio pessoal, esta iniciativa não busca nenhum tipo de retorno financeiro, mais informações sobre o código fonte podem ser acessadas em <span className="text-[#660eb3]">//github link</span>, reportem quaisquer vulnerabilidades ou bugs pelo email <span className="text-[#660eb3]">ayrttalon@gmail.com</span> ou pelo meu instagram <span className="text-[#660eb3]">@ayrt1337</span></p>
                                <a onClick={updateUser} className="font-semibold text-[16px] bg-[#660eb3] pb-4 pt-4 pl-20 pr-20 mt-10 rounded-[20px] cursor-pointer">
                                    Continuar
                                </a>
                            </div>
                        </div>
                    }
                </>
            }
        </>
    )
}

export default NewUser