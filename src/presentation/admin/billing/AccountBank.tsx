import EditComponent from "@/presentation/util/input/EditComponent";
import EditComponentSelect from "@/presentation/util/input/EditComponentSelect";
import Loader from "@/presentation/util/loaders/Loader";
import { unexpectedError } from "@/context/config";
import { UpdateBankAccount } from "@/core/repository/billing";
import { useEffect } from "react";
import { toast } from "react-toastify";


const AccountBank = ({accountBank,loading,banks,setAccountBank,enableEdit=true}:{
    accountBank:AccountBank | null
    banks:Bank[]
    loading?:boolean
    enableEdit?:boolean
    setAccountBank:(account:AccountBank)=>void
}) =>{
    const items:SelectItem[] = banks.map(item=>{return({value:item.id.toString(),name:item.name})})

    const update = async(addLoader:()=>void,removeLoader:()=>void,value:string,key:string) => {
        if(accountBank == null) return
        try{
            addLoader()
            const data:AccountBank= {
                ...accountBank,
                [key]:value
            }
            // console.log(data)
            await UpdateBankAccount(data)
            setAccountBank(data)
            toast.success("¡Los cambios realizados han sido guardados exitosamente!")
            removeLoader()
        }catch(err){
            toast.error(unexpectedError)
            removeLoader()
        }
    }

    useEffect(()=>{
        console.log("RENDER")
    },[])

    return(
        <div className=" w-full pt-4">

            {accountBank != null &&
            <>
            <div className=" font-semibold title text-lg w-full">
                {accountBank.name}
            </div>
            
            <div className="grid md:grid-cols-2 gap-x-4 xl:gap-x-10 ">
            <EditComponent
            enableEdit={enableEdit}
            label="Nombre de la cuenta"
            content={accountBank.name}
            edit={(addLoader,removeLoader,value)=>update(addLoader,removeLoader,value,"name")}
            />
            <EditComponent
            enableEdit={enableEdit}
            label="Número de cuenta"
            content={accountBank.account_number}
            edit={(addLoader,removeLoader,value)=>update(addLoader,removeLoader,value,"account_number")}
            />
             <EditComponent
            enableEdit={enableEdit}
            label="Nombre del usuario de la cuenta"
            content={accountBank.account_name}
            edit={(addLoader,removeLoader,value)=>update(addLoader,removeLoader,value,"account_name")}
            />
            {items.length >0 &&
            <EditComponentSelect
            label="Institución Bancaria"
            currentSelected={items.find(item=>item.value == accountBank.bank_id.toString()) || items[0]}
            items={items}
            getItems={()=>{}}
            enableEdit={enableEdit}
            updateSelect={(value,addLoader,removeLoader)=>update(addLoader,removeLoader,value,"bank_id")}
            />
        }
            </div>
        </>
        }
            {/* {JSON.stringify(accountBank)} */}
        </div>
    )
}

export default AccountBank;