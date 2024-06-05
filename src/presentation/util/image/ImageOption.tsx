import { Menu } from "@headlessui/react"
import MenuLayout from "../button/MenuLayout"
import CommonImage from "./CommonImage"
import { useState } from "react"
import Loader from "../loaders/Loader"
import Spinner from "../loaders/Spinner"
import { TypeEntity } from "@/data/model/types/enums"


const ImageOption = ({
    photo,establecimiento_uuid,deletePhoto
}:{
    photo:Photo
    establecimiento_uuid:string
    deletePhoto:(setLoading:(e:boolean)=>void,d:Photo)=>void
}) =>{
    const [loading,setLoading] = useState(false)

    return(
        <div className="relative  rounded-md">
            {photo.type_entity == TypeEntity.ENTITY_PHOTO &&
            <div className=" absolute right-1 top-1">
            <MenuLayout className=" bg-white rounded-full">
            <Menu.Item >
                {({ active }) => (
                  <button 
                  onClick={()=>{
                    const p:Photo = {
                        url:photo.url,
                        uuid:establecimiento_uuid,
                        parent_id:photo.parent_id,
                        id:photo.id,
                        type_entity:photo.type_entity
                    }
                    deletePhoto((e)=>setLoading(e),p)
                  }}
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
            }

            {loading &&
            <Spinner
            className=" absolute z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            />
        }
            <CommonImage
            h={200}
            w={200}
            src={photo.url}
            className={`object-cover border-[1px] h-40 w-40 ${loading && "filter brightness-50 "}`}
            />
        </div>
    )
}
export default ImageOption;