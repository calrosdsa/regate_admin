import ImageOption from "./ImageOption";


const Photos = ({
    items,uuid,deletePhoto
}:{
    items:Photo[] | null
    uuid:string
    deletePhoto:(setLoading:(e:boolean)=>void,d:Photo)=>void
}) => {
    return(
        <>
        <div  className=" flex flex-wrap">
        {items != null &&
            items.map((item,index)=>{
                return(
                    <div className="" key={index}>
                        <ImageOption
                        photo={item}
                        establecimiento_uuid={uuid}
                        deletePhoto={deletePhoto}
                        />
                    </div>
                )
            })}
        </div>
        </>
    )
}

export default Photos;