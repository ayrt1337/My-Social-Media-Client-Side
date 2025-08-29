import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEnvelope } from "@fortawesome/free-solid-svg-icons"
import { faExclamation } from "@fortawesome/free-solid-svg-icons"

const ResetPassword = () => {
    const navigate = useNavigate()

    const submitData = async (e) => {
        const event = e.key || e.type

        if(event == 'Enter' || event == 'click'){
            const inputs = document.getElementsByTagName('input')
            const errors = document.getElementsByClassName('error')
            const email = document.getElementById('email').value
            var emptyCamps = 0

            for(let i = 0; i <= inputs.length; i++){
                if(i <= inputs.length) errors[i].classList.add('hidden')

                if(i < errors.length - 1 && inputs[i].value == '') emptyCamps++
            }

            if(emptyCamps > 0) errors[0].classList.remove('hidden')

            else{
                const result = await fetch('http://localhost:3000/reset', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({ 'email': email })
                })

                const output = await result.json()

                if(output.status == 'success') navigate(`/confirmemailpassword?email=${email}`)

                else errors[1].classList.remove('hidden')
            }
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
        <div className="flex flex-col items-center bg-[#0f0f0f] h-full justify-center">
            <div className="text-[15px] text-center flex flex-col items-center justify-between bg-[#000000] rounded-[15px] pr-5 pl-5 pt-20 pb-20 text-[#FFFFFF]">
                <div className="flex flex-col items-center w-full">
                    <div className="relative text-center flex flex-col items-center justify-between bg-[#000000] rounded-[15px] pl-12 pr-12 pb-10 text-[#FFFFFF] w-[500px]">
                        <div className="flex flex-col items-center">
                            <h1 className="text-[35px]">Mude sua senha</h1>
                            <h1 className="text-[20px] mb-0 mt-3">Insira abaixo o email da conta que você deseja alterar a senha</h1>
                        </div>
                    </div>

                    <div className="error flex mb-5 items-center hidden">
                        <div className="flex p-3 mr-2 bg-[#e30e2a] rounded-[50%] size-[15px] items-center justify-center">
                            <FontAwesomeIcon icon={faExclamation} />
                        </div>
                    
                        <p className="text-[#e30e2a]">Insira o email!</p>
                    </div>

                    <div className="error flex mb-5 items-center hidden">
                        <div className="flex p-3 mr-2 bg-[#e30e2a] rounded-[50%] size-[15px] items-center justify-center">
                            <FontAwesomeIcon icon={faExclamation} />
                        </div>
                    
                        <p className="text-[#e30e2a]">Email não encontrado!</p>
                    </div>

                    <div className="flex w-full items-center text-center justify-center mb-3">
                        <label className="border-r-0 border-transparent border-2 pl-5 rounded-r-[0px] rounded-[7px] bg-[#0f0f0f] h-full flex items-center" htmlFor="email"><FontAwesomeIcon icon={faEnvelope} /></label>
                        <input onKeyDown={submitData} onFocus={handleFocus} onBlur={handleBlur} className="focus:outline-2 focus:outline-offset-2 focus:outline-none border-l-0 border-transparent border-2 focus:border-b-[#660eb3] focus:border-t-[#660eb3] focus:border-r-[#660eb3] w-[400px] bg-[#0f0f0f] rounded-l-[0px] rounded-[7px] pt-3 pb-3 pr-5 pl-3" type="text" placeholder="Email" id="email"/>
                    </div>

                    <a onClick={submitData} className="font-semibold text-[16px] bg-[#660eb3] pb-4 pt-4 pl-20 pr-20 mb-5 mt-5 rounded-[20px] cursor-pointer">
                        Solicitar troca de senha
                    </a>

                    <Link to={'/login'} className="text-[#660eb3] cursor-pointer underline">
                        Voltar para o login
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default ResetPassword