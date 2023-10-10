import { Menu } from "@headlessui/react"
import MenuLayout from "../button/MenuLayout"
import CommonImage from "../image/CommonImage"


const ImageOption = ({
    url,id,establecimiento_id,establecimiento_uuid
}:{
    url:string
    id:number
    establecimiento_id:number,
    establecimiento_uuid:string

}) =>{

    return(
        <div className="relative  w-40 h-40 rounded-md">
            <div className=" absolute right-1 top-1">
            <MenuLayout className=" bg-white rounded-full">
            <Menu.Item >
                {({ active }) => (
                  <button 
                  onClick={()=>{}}
                  className={`
                 ${active ? 'bg-primary text-white' : 'text-gray-900'}
                 disabled:bg-opacity-50 disabled:text-gray-500 disabled:pointer-events-none
                 group whitespace-nowrap flex w-full items-center rounded-md px-2 py-2 text-sm
                 `}
                 >
                  Eliminar foto
                  </button>
                )}
              </Menu.Item>
            </MenuLayout>
            </div>
            <CommonImage
            h={200}
            w={200}
            src={url}
            className="object-cover border-[1px] h-40 w-40"
            />
        </div>
    )
}
export default ImageOption;