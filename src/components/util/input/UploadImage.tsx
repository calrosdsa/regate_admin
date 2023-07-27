import Image from "next/image";
import { ChangeEvent, useState } from "react";

const UploadImage = ({setFile}:{
    setFile:(e:File)=>void
}) => {
    const [source,setSource] = useState("/images/img-default.png")
    const uploadImage = (e:ChangeEvent<HTMLInputElement>)=>{     
        if(e.target.files?.length != undefined){
            const file = e.target.files[0]
            setFile(file)
            const fileUrl = URL.createObjectURL(file)
            setSource(fileUrl)
        }
    }
    return(
        <div className="grid grid-cols-2  place-items-center  h-52">
            <div className="w-full h-44">
            <Image
            src={source}
            width={200}
            height={200}
            className="w-full h-44 rounded object-contain"
            alt={""}
            />
            </div>
            <label htmlFor="file" className="button h-10">
                Upload Image
            <input id="file" className="hidden" type="file" onChange={uploadImage}/>
            </label>
        </div>
    )
}

// 854c0252-726f-4928-b099-68bfa37838d1
// 1469058c-6084-4e1e-a191-de1d5fa3b9c5

export default UploadImage;