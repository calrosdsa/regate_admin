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
        {items != null &&
            items.map((item,index)=>{
                return(
                    <div className="w-40" key={index}>
                        <ImageOption
                        photo={item}
                        establecimiento_uuid={uuid}
                        deletePhoto={deletePhoto}
                        />
                    </div>
                )
            })}
        </>
    )
}

export default Photos;