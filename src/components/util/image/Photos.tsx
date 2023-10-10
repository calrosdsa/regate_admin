import ImageOption from "../input/ImageOption";


const Photos = ({
    items,uuid
}:{
    items:Photo[]
    uuid:string
}) => {
    return(
        <>
            {items.map((item,index)=>{
                return(
                    <div className="w-40" key={index}>
                        <ImageOption
                        establecimiento_id={item.parent_id}
                        id={item.id}
                        url={item.url}
                        establecimiento_uuid={uuid}
                        />
                    </div>
                )
            })}
        </>
    )
}

export default Photos;