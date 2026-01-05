import EmailImg from '../../assets/10542536.png'

const ConfirmEmail = () => {
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    const email = urlParams.get('email')
    const password = urlParams.get('password')

    const sendEmail = async () => {
        const error = document.getElementsByClassName('error')[0]

        await fetch('http://localhost:3000/confirmEmail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ email: email, password: password })
        })

        error.classList.remove('hidden')

        setTimeout(() => {
            error.classList.add('hidden')
        }, 2000)
    }

    return (
        <div className="max-[681px]:pt-8 max-[681px]:pb-8 pt-13 pb-13 max-[681px]:bg-[#000000] flex flex-col items-center bg-[#0f0f0f] min-h-[100vh] justify-center">
            <div className="max-[681px]:w-full max-[681px]:p-8 w-[600px] relative text-center flex flex-col items-center justify-between bg-[#000000] rounded-[15px] p-12 text-[#FFFFFF]">
                <img className='max-[421px]:size-[180px] size-[200px] h-full' src={EmailImg} alt="" />

                <div className="flex flex-col items-center">
                    <h1 className="max-[421px]:text-[25px] text-[30px] mb-7 mt-3">Confirmação de Email</h1>

                    <p className="mb-10 text-[17px]">Enviamos um email para <span className="text-[#660eb3]">{email}</span>, clique no link presente no email para realizar a confirmação.</p>
                </div>

                <p className="text-[17px]"><span onClick={sendEmail} className="text-[#660eb3] cursor-pointer">Clique aqui</span> se você não recebeu nenhum email.</p>

                <div className="error hidden pl-6 pr-6 p-4 absolute bg-[#0f0f0f] rounded-[15px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                    <p className='text-[18px]'>Email reenviado!</p>
                </div>
            </div>
        </div>
    )
}

export default ConfirmEmail