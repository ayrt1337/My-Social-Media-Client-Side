const PageNotFound = () => {
    return(
        <div className="max-[421px]:pl-10 max-[421px]:pr-10 flex flex-col items-center justify-center h-full text-[#ffffff] p-20 pb-40 text-center">
            <p className="max-[421px]:text-[120px] text-[170px]">404</p>
            <p className="max-[421px]:text-[19px] text-[23px]">Página não encontrada</p>
            <p className="max-[421px]:text-[17px] text-[18px] mt-5">A página que você está procurando não existe, por favor volte e insira um novo endereço.</p>
        </div>
    )
}

export default PageNotFound