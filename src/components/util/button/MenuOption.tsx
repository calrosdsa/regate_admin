import { Props } from "@headlessui/react/dist/types"

const MenuOption = ({openMenu}:{
    openMenu:()=>void
}) =>{

    return(
        <div className=" rounded-full hover:bg-gray-200 cursor-pointer flex justify-center"
            onClick={()=>openMenu()}>/
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                className="w-8 h-8 p-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
            </svg>
        </div>
    )
}

export default MenuOption;