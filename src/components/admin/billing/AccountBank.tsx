import EditComponent from "@/components/util/input/EditComponent";
import EditComponentSelect from "@/components/util/input/EditComponentSelect";
import Loader from "@/components/util/loaders/Loader";
import { unexpectedError } from "@/context/config";
import { UpdateBankAccount } from "@/core/repository/billing";
import { useEffect } from "react";
import { toast } from "react-toastify";


const AccountBank = ({accountBank,loading,banks,setAccountBank}:{
    accountBank:AccountBank | null
    banks:Bank[]
    loading:boolean
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
        <div className=" w-full ">
            <div className=" font-semibold p-2 w-full">
            Información de la cuenta
            </div>
            {loading &&
            <Loader
            className="flex justify-center items-center mt-4"
            />
            }
            {accountBank != null &&
            
            <div className="grid md:grid-cols-2 gap-x-4 xl:gap-x-10 p-2">
            <EditComponent
            label="Número de cuenta"
            content={accountBank.account_number}
            edit={(addLoader,removeLoader,value)=>update(addLoader,removeLoader,value,"account_number")}
            />
             <EditComponent
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
            updateSelect={(value,addLoader,removeLoader)=>update(addLoader,removeLoader,value,"bank_id")}
            />
            }
            </div>
        }
            {/* {JSON.stringify(accountBank)} */}
        </div>
    )
}

export default AccountBank;