import Image from "next/image";
import { ChangeEvent, useEffect, useState } from "react";
import CommonImage from "../image/CommonImage";
import ButtonWithLoader from "../button/ButtonWithLoader";

const UploadImage = ({setFile,src,save}:{
    setFile:(e:File)=>void
    src:string
    save?:(setLoading:(e:boolean)=>void)=>void
}) => {
    const [loading,setLoading] = useState(false)
    const [source,setSource] = useState("/images/img-default.png")
    const uploadImage = (e:ChangeEvent<HTMLInputElement>)=>{     
        if(e.target.files?.length != undefined){
            const file = e.target.files[0]
            setFile(file)
            const fileUrl = URL.createObjectURL(file)
            setSource(fileUrl)
        }
    }
    useEffect(()=>{
        if(src != "" && src != null){
            setSource(src)
        }
    },[src])
    return(
        <div className="grid grid-cols-2  place-items-center  h-52">
            <div className="w-full h-44">
            <CommonImage
            src={source}
            w={250}
            h={200}
            className="w-full h-44 rounded object-cover"
            // alt={""}
            />
            </div>
            <div className="grid gap-y-2">
            <label htmlFor="file" className="button ">
                Upload Image
            <input id="file" className="hidden" type="file" onChange={uploadImage}/>
            </label>
            {save != undefined &&
            <ButtonWithLoader
            onClick={()=>save((e)=>setLoading(e))}
            title="Guardar"
            loading={loading}
            />
            }
            </div>
        </div>
    )
}

// 854c0252-726f-4928-b099-68bfa37838d1
// 1469058c-6084-4e1e-a191-de1d5fa3b9c5

export default UploadImage;