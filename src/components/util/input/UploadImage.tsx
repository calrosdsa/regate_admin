import Image from "next/image";
import { ChangeEvent, useEffect, useState } from "react";
import CommonImage from "../image/CommonImage";
import ButtonWithLoader from "../button/ButtonWithLoader";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Button } from "@mui/material";
import { styled } from '@mui/material/styles';

const UploadImage = ({setFile,src,save,id="file",width="w-44",height="h-44",clearAfterUpload=false}:{
    setFile:(e:File)=>void
    src?:string
    width?:string
    height?:string
    save?:(setLoading:(e:boolean)=>void)=>Promise<void>
    id?:string
    clearAfterUpload?:boolean
}) => {
    const [loading,setLoading] = useState(false)
    const [source,setSource] = useState("/images/img-default.png")
    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
      });
    const uploadImage = (e:ChangeEvent<HTMLInputElement>)=>{     
        if(e.target.files != null){
            console.log(e.target.files)
            const file = e.target.files[0]
            if(file != undefined){    
                console.log(file)
                setFile(file)
                const fileUrl = URL.createObjectURL(file)
                setSource(fileUrl)
            }
        }
    }
    useEffect(()=>{
        if(src != "" && src != null){
            setSource(src as string)
        }else{
            setSource("/images/img-default.png")
        }
    },[src])
    return(
        <div className="grid sm:grid-cols-2  place-items-center ">
            <div className="w-full">
            <CommonImage
            src={source.includes("https") ? `${source}?${Date.now()}` : source}
            w={250}
            h={200}
            className={`${width} ${height} rounded object-contain`}
            // alt={""}
            />
            </div>
            <div className="flex justify-between w-full mt-2 sm:w-max sm:grid sm:gap-y-2">
            <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
            >
            Subir imagen
            <VisuallyHiddenInput type="file"  id={id} onChange={uploadImage}
            accept="image/*"/>
            </Button>
            {/* <label htmlFor={id} className="button h-10">
            Subir imagen
            <input id={id} className="hidden" type="file" onChange={uploadImage}
            accept="image/*"
            />
            </label> */}
            {save != undefined &&
            <ButtonWithLoader
            onClick={async()=>{
                await save((e)=>setLoading(e))
                if(clearAfterUpload){
                    setSource("/images/img-default.png")
                }
            }}
            title="Guardar"
            className=""
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